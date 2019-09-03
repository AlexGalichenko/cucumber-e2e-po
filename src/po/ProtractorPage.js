const AbstractPage = require("./AbstractPage");
const ComponentNode = require("./ComponentNode");
const ParsedToken = require("./ParsedToken");
const NoSuchElementException = require("./exception/NoSuchElementException");
const regexp = require("./helpers/regexp");
const scripts = require("./scripts/scripts");

/**
 * @global element from protractor
 * @extends {AbstractPage}
 */
class ProtractorPage extends AbstractPage {

    constructor() {
        super();
    }

    /**
     * Get element by key
     * @param {string} key - key
     * @return {ElementFinder|ElementArrayFinder} - protractor element
     * @override
     */
    getElement(key) {
        const tokens = ParsedToken.getTokens(key);
        const firstToken = tokens.shift();
        const startNode = new ComponentNode(
            this._getProtractorElement(null, this, firstToken),
            this._getComponent(this, firstToken)
        );
        const protractorElement = tokens.reduce((current, token) => {
            return new ComponentNode(
                this._getProtractorElement(current.element, current.component, token),
                this._getComponent(current.component, token)
            )
        }, startNode);

        return protractorElement.element;
    }

    /**
     * Get protractor single element or collection of elements or element from collection
     * @param {ElementFinder|ElementArrayFinder} currentProtractorElement - current element
     * @param {AbstractPage|Component} currentComponent - current component
     * @param {string} token - token to get new element
     * @return {ElementFinder|ElementArrayFinder} - return new element
     * @private
     */
    _getProtractorElement(currentProtractorElement, currentComponent, token) {
        const parsedToken = new ParsedToken(token);
        if (parsedToken.isElementOfCollection()) {
            return this._getElementOfCollection(currentProtractorElement, currentComponent, parsedToken)
        } else {
            return this._getElementOrCollection(currentProtractorElement, currentComponent, parsedToken)
        }
    }

    /**
     * Get protractor element by index or text
     * @param {ElementFinder|ElementArrayFinder} currentProtractorElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - parsed token
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOfCollection(currentProtractorElement, currentComponent, parsedToken) {
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentProtractorElement ? currentProtractorElement : element;
        if (newComponent.isCollection) {
            const elementsCollection = !parsedToken.isThis()
                ? rootElement.all(this._getSelector(newComponent))
                : rootElement;
            if (parsedToken.hasTokenIn()) return this._getElementOfCollectionByText(elementsCollection, parsedToken, rootElement);
            if (parsedToken.hasTokenOf()) return this._getElementOfCollectionByIndex(elementsCollection, parsedToken);
        } else {
            throw new Error(`${parsedToken.alias} is not collection`)
        }
    }

    /**
     * Get element from collection by text
     * @param elementsCollection - collection to select from
     * @param parsedToken - token to select element
     * @param rootElement - root element
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOfCollectionByText(elementsCollection, parsedToken, rootElement) {
        let elementFinder;
        let mode;
        let resolver;
        const locator = elementsCollection.locator();
        if (parsedToken.isPartialMatch()) {
            mode = "partial";
            resolver = elem => elem.getText().then(text => text.includes(parsedToken.innerText));
        }
        if (parsedToken.isExactMatch()) {
            mode = "exact";
            resolver = elem => elem.getText().then(text => text === parsedToken.innerText);
        }
        if (parsedToken.isRegexp()) {
            mode = "regexp";
            resolver = elem => elem.getText().then(text => new RegExp(parsedToken.innerText, "gmi").test(text));
        }
        if (this._isLocatorTranformable(locator) && !parsedToken.isThis()) {
            elementFinder = rootElement.all(this._transformLocatorByText(locator, parsedToken.innerText, mode));
        } else {
            elementFinder = elementsCollection.filter(resolver);
        }
        if (parsedToken.hasAllModifier()) return elementFinder;
        return elementFinder.first()
    }

    /**
     * Get element from collection by index
     * @param elementsCollection - collection to select from
     * @param parsedToken - token to select element
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOfCollectionByIndex(elementsCollection, parsedToken) {
        if (typeof parsedToken.index === "number") return elementsCollection.get(parsedToken.index - 1);
        if (parsedToken.index === "FIRST") return elementsCollection.first();
        if (parsedToken.index === "LAST") return elementsCollection.last();
        if (regexp.PARTIAL_ARRAY_REGEXP.test(parsedToken.index)) {
            const [startIndex, endIndex] = parsedToken.index.split("-").map(index => +index);
            return elementsCollection.filter((_, i) => i >= startIndex - 1 && i <= endIndex - 1);
        }
        if (regexp.PARTIAL_MORE_LESS_REGEXP.test(parsedToken.index)) {
            const [operator, index] = [parsedToken.index[0], +parsedToken.index.slice(1)];
            switch (operator) {
                case ">": return elementsCollection.filter((_, i) => i > index - 1);
                case "<": return elementsCollection.filter((_, i) => i < index - 1);
                default: throw new Error(`Operator ${operator} is not defined`)
            }
        }
    }

    /**
     * Get protractor element or collection
     * @param {ElementFinder|ElementArrayFinder} currentProtractorElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - alias
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOrCollection(currentProtractorElement, currentComponent, parsedToken) {
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentProtractorElement ? currentProtractorElement : element;

        if (newComponent.isCollection || rootElement.count) {
            return rootElement.all(this._getSelector(newComponent))
        } else {
            if (currentProtractorElement) {
                return rootElement.element(this._getSelector(newComponent))
            } else {
                return element(this._getSelector(newComponent))
            }
        }
    }

    /**
     * Function for verifying and returning element
     * @param {AbstractPage|Component} currentComponent - current component
     * @param {string} token - token to create new compoenent
     * @returns {Component} - new component
     * @throws {Error}
     * @private
     */
    _getComponent(currentComponent, token) {
        const parsedToken = new ParsedToken(token);
        if (parsedToken.isThis()) return currentComponent;
        if (currentComponent.elements.has(parsedToken.alias)) return currentComponent.elements.get(parsedToken.alias);
        throw new NoSuchElementException(parsedToken.alias, currentComponent);
    }

    /**
     * Resolve element by location strategy
     * @param {Element|Collection|Component} element - element to get selector
     * @return {WebDriverLocator|ProtractorLocator|Object} - by selector
     * @throws {Error}
     * @private
     */
    _getSelector(element) {
        switch (element.selectorType) {
            case "css": return by.css(element.selector);
            case "xpath": return by.xpath(element.selector);
            case "js": return by.js(element.selector);
            case "android": return {
                using: "-android uiautomator",
                value: element.selector
            };
            case "ios": return {
                using: "-ios uiautomation",
                value: element.selector
            };
            case "accessibilityId": return {
                using: "accessibility id",
                value: element.selector
            };
            case "cssContainingText": {
                if (element.text) {
                    return by.cssContainingText(element.selector, element.text)
                } else {
                    throw new Error("Text is not defined")
                }
            }
            default: throw new Error(`Selector type ${element.selectorType} is not defined`);
        }
    }

    /**
     * Verify if locator hack can be applied
     * @param locator - locator of element
     * @return {boolean}
     * @private
     */
    _isLocatorTranformable(locator) {
        switch (locator.using) {
            case "css selector": return true;
            case "android": return true;
            default: return false
        }
    }

    /**
     * Transform locator for text selection
     * @param locator - locator
     * @param text - text
     * @param mode - mode of transformation
     * @return {ProtractorLocator|Object}
     * @private
     */
    _transformLocatorByText(locator, text, mode) {
        switch (locator.using) {
            case "css selector": {
                switch (mode) {
                    case "partial": return by.cssContainingText(locator.value, text);
                    case "exact": {
                        if (!by.cssExactText) {
                            by.addLocator("cssExactText", scripts.getAllElementsByCssExactText);
                        }
                        return by.cssExactText(locator.value, text);
                    }
                    case "regexp": return by.cssContainingText(locator.value, new RegExp(text));
                }
            } break;
            case "android": return {
                using: "-android uiautomator",
                value: element.selector + ".text(\"" + text + "\")"
            };
        }
    }
}

module.exports = ProtractorPage;
