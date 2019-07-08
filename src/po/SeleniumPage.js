const AbstractPage = require("./AbstractPage");
const ComponentNode = require("./ComponentNode");
const ParsedToken = require("./ParsedToken");
const NoSuchElementException = require("./exception/NoSuchElementException");
const regexp = require("./helpers/regexp");

/**
 * @extends {AbstractPage}
 */
class SeleniumPage extends AbstractPage {

    constructor() {
        super();
        this.driver = null;
    }

    /**
     * Set instance of webdriver.
     * Need to be done before call getElement()
     * @param driver {WebDriver} - instance of webdriver
     * @return {SeleniumPage}
     */
    setDriver(driver) {
        this.driver = driver;
        return this
    }

    /**
     * Get element by key
     * @param {string} key - key
     * @return {*} - selenium element
     * @override
     */
    getElement(key) {
        const tokens = ParsedToken.getTokens(key);
        const firstToken = tokens.shift();
        const startNode = new ComponentNode(
            this._getSeleniumElement(null, this, firstToken),
            this._getComponent(this, firstToken)
        );
        const seleniumElement = tokens.reduce((current, token) => {
            return new ComponentNode(
                this._getSeleniumElement(current.element, current.component, token),
                this._getComponent(current.component, token)
            )
        }, startNode);

        return seleniumElement.element;
    }

    /**
     * Get selenium single element or collection of elements or element from collection
     * @param {*} currentElement - current element
     * @param {AbstractPage|Component} currentComponent - current component
     * @param {string} token - token to get new element
     * @return {*} - return new element
     * @private
     */
    _getSeleniumElement(currentElement, currentComponent, token) {
        const parsedToken = new ParsedToken(token);
        if (parsedToken.isElementOfCollection()) {
            return this._getElementOfCollection(currentElement, currentComponent, parsedToken)
        } else {
            return this._getElementOrCollection(currentElement, currentComponent, parsedToken)
        }
    }

    /**
     * Get selenium element by index or text
     * @param {*} currentElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - parsed token
     * @return {*} - new selenium element
     * @private
     */
    _getElementOfCollection(currentElement, currentComponent, parsedToken) {
        const ROOT_ELEMENT_SELECTOR = {css: "html"};
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentElement ? currentElement : this.driver.findElement(ROOT_ELEMENT_SELECTOR);
        return rootElement.then(element => {
            if (newComponent.isCollection) {
                const elementsCollection = parsedToken.alias !== "this"
                    ? element.findElements(this._getSelector(newComponent))
                    : Promise.resolve(element);
                if (parsedToken.hasTokenIn()) return this._getElementOfCollectionByText(elementsCollection, parsedToken);
                if (parsedToken.hasTokenOf()) return this._getElementOfCollectionByIndex(elementsCollection, parsedToken);
            } else {
                throw new Error(`${parsedToken.alias} is not collection`)
            }
        });
    }

    /**
     * Get element from collection by text
     * @param elementsCollection - collection to select from
     * @param parsedToken - token to select element
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOfCollectionByText(elementsCollection, parsedToken) {
        return elementsCollection.then(
            collection => {
                const promises = collection
                    .map(element => element.getText()
                        .then(text => {
                            if (parsedToken.isPartialMatch()) return text.includes(parsedToken.innerText);
                            if (parsedToken.isExactMatch()) return text === parsedToken.innerText;
                            if (parsedToken.isRegexp()) return new RegExp(parsedToken.innerText).test(text);
                        }));
                return Promise.all(promises).then(results => {
                    if (!parsedToken.hasAllModifier()) return collection.find((element, index) => results[index]);
                    return collection.filter((element, index) => results[index])
                })
            }
        )
    }

    /**
     * Get element from collection by index
     * @param elementsCollection - collection to select from
     * @param parsedToken - token to select element
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOfCollectionByIndex(elementsCollection, parsedToken) {
        if (typeof parsedToken.index === "number") return elementsCollection.then(collection => collection[parsedToken.index - 1]);
        if (parsedToken.index === "FIRST") return elementsCollection.then(collection => collection[0]);
        if (parsedToken.index === "LAST") return elementsCollection.then(collection => collection[collection.length - 1]);
        if (regexp.PARTIAL_ARRAY_REGEXP.test(parsedToken.index)) {
            const [startIndex, endIndex] = parsedToken.index.split("-");
            return elementsCollection.then(collection => collection.filter((_, i) => i >= startIndex - 1 && i <= endIndex - 1));
        }
        if (regexp.PARTIAL_MORE_LESS_REGEXP.test(parsedToken.index)) {
            const [operator, index] = [parsedToken.index[0], +parsedToken.index.slice(1)];
            switch (operator) {
                case ">": return elementsCollection.then(collection => collection.filter((_, i) => i > index - 1));
                case "<": return elementsCollection.then(collection => collection.filter((_, i) => i < index - 1));
                default: throw new Error(`Operator ${operator} is not defined`)
            }
        }
    }

    /**
     * Get selenium element or collection
     * @param {*} currentElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - alias
     * @return {*} - new selenium element
     * @private
     */
    _getElementOrCollection(currentElement, currentComponent, parsedToken) {
        const ROOT_ELEMENT_SELECTOR = {css: "html"};
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentElement ? currentElement : this.driver.findElement(ROOT_ELEMENT_SELECTOR);
        if (newComponent.isCollection) {
            return rootElement.then(element => element.findElements(this._getSelector(newComponent)));
        } else {
            return rootElement.then(element => {
                if (element.length) {
                    return Promise.all(element.map(item => item.findElement(this._getSelector(newComponent))))
                } else {
                    return element.findElement(this._getSelector(newComponent))
                }
            });
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
        if (parsedToken.alias === "this") return currentComponent;
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
            case "css": return {
                using: 'css selector',
                value: element.selector
            };
            case "xpath": return {
                using: 'xpath',
                value: element.selector
            };
            //todo fix bug that will allow to pass params into function
            case "js": return function(context) {
                const driver = context.driver_ ||context;
                return driver.executeScript.apply(driver, [element.selector]);
            };
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
            default: throw new Error(`Selector type ${element.selectorType} is not defined`);
        }
    }

}

module.exports = SeleniumPage;
