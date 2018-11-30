const AbstractPage = require("./AbstractPage");
const ComponentNode = require("./ComponentNode");
const ParsedToken = require("./ParsedToken");

/**
 * @abstract
 * @type {AbstractPage}
 */
class WebdriverIOAbstractPage extends AbstractPage {

    constructor() {
        super();
    }

    /**
    * Get element by key
    * @param {string} key - key
    * @return {*} - webdriverIO element
    */
    getElement(key) {
        const TOKEN_SPLIT_REGEXP = /\s*>\s*/;
        const tokens = key.split(TOKEN_SPLIT_REGEXP);
        const firstToken = tokens.shift();
        const startNode = new ComponentNode(
            this._getWebdriverIOElement(null, this, firstToken),
            this._getComponent(this, firstToken)
        );
        const webdriverIOElement = tokens.reduce((current, token) => {
            return new ComponentNode(
                this._getWebdriverIOElement(current.element, current.component, token),
                this._getComponent(current.component, token)
            )
        }, startNode);

        return webdriverIOElement.element;
    }

    /**
     * Get webdriverIO single element or collection of elements or element from collection
     * @param {*} currentElement - current element
     * @param {WebdriverIOAbstractPage|Component} currentComponent - current component
     * @param {string} token - token to get new element
     * @return {*} - return new element
     * @private
     */
    _getWebdriverIOElement(currentElement, currentComponent, token) {
        const parsedToken = new ParsedToken(token);
        if (parsedToken.isElementOfCollection()) {
            return this._getElementOfCollection(currentElement, currentComponent, parsedToken)
        } else {
            return this._getElementOrCollection(currentElement, currentComponent, parsedToken)
        }
    }

    /**
     * Get webdriverIO element by index or text
     * @param {*} currentElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - parsed token
     * @return {*} - new webdriverIO element
     * @private
     */
    _getElementOfCollection(currentElement, currentComponent, parsedToken) {
        const ROOT_ELEMENT_SELECTOR = "html";
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentElement ? currentElement : $(ROOT_ELEMENT_SELECTOR);
        if (newComponent.isCollection) {
            const elementsCollection = rootElement.$$(this._getSelector(newComponent));
            if (parsedToken.hasTokenIn()) {
                return elementsCollection.then(
                    collection => {
                        const promises = collection
                            .map(element => browser.elementIdText(element.value.ELEMENT)
                                .then(text => text.value.includes(parsedToken.innerText)));
                        return Promise.all(promises).then(texts => collection[texts.findIndex(isRightText => isRightText)])
                    }
                )
            } else if (parsedToken.hasTokenOf()) {
                return elementsCollection.then(collection => collection[parsedToken.index - 1])
            }
        } else {
            throw new Error(`${parsedToken.alias} is not collection`)
        }
    }

    /**
     * Get webdriverIO element or collection
     * @param {*} currentElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - alias
     * @return {*} - new webdriverIO element
     * @private
     */
    _getElementOrCollection(currentElement, currentComponent, parsedToken) {
        const ROOT_ELEMENT_SELECTOR = "html";
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentElement ? currentElement : $(ROOT_ELEMENT_SELECTOR);
        if (newComponent.isCollection || rootElement.length) {
            return rootElement.$$(this._getSelector(newComponent))
        } else {
            return rootElement.$(this._getSelector(newComponent))
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
     * @return {*} - by selector
     * @throws {Error}
     * @private
     */
    _getSelector(element) {
        switch (element.selectorType) {
            case "css": return element.selector;
            case "xpath": return element.selector;
            default: throw new Error(`Selector type ${element.selectorType} is not defined`);
        }
    }

}

module.exports = WebdriverIOAbstractPage;