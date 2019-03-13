const AbstractPage = require("./AbstractPage");
const ComponentNode = require("./ComponentNode");
const ParsedToken = require("./ParsedToken");

/**
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
        const TOKEN_SPLIT_REGEXP = /\s*>\s*/;
        const tokens = key.split(TOKEN_SPLIT_REGEXP);
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
            const elementsCollection = rootElement.all(this._getSelector(newComponent));
            if (parsedToken.hasTokenIn()) {
                const locator = elementsCollection.locator();
                if (this._isLocatorTranformable(locator)) {
                    return rootElement.all(this._transformLocatorByText(locator, parsedToken.innerText)).first()
                } else {
                    return elementsCollection
                        .filter(elem => elem.getText().then(text => text.includes(parsedToken.innerText)))
                        .first();
                }
            } else if (parsedToken.hasTokenOf()) {
                return elementsCollection.get(parsedToken.index - 1)
            }
        } else {
            throw new Error(`${parsedToken.alias} is not collection`)
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
        if (currentComponent.elements.has(parsedToken.alias)) {
            return currentComponent.elements.get(parsedToken.alias)
        } else {
            throw new Error(`There is no such element: '${parsedToken.alias}'`)
        }
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
            } break;
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
     * @return {ProtractorLocator}
     * @private
     */
    _transformLocatorByText(locator, text) {
        switch (locator.using) {
            case "css selector": return by.cssContainingText(locator.value, text);
            case "android": return {
                using: "-android uiautomator",
                value: element.selector + ".text(\"" + text + "\")"
            };
        }
    }
}

module.exports = ProtractorPage;
