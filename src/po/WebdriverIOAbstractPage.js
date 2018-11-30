const Element = require("./Element");
const Collection = require("./Collection");

/**
 * @global $ - shortcut for element
 */

/**
 * @abstract
 * @type {AbstractPage}
 */
class WebdriverIOAbstractPage {

    constructor() {
        this.elements = new Map();
    }

    /**
     * Define element on page
     * @param {string} element.alias - alias
     * @param {string|Function} element.selector - selector
     * @param {string} [element.selectorType] - selector type (css, cssContainingText, xpath) (default css)
     * @param {string} [element.text] - text (for cssContainingText selector type)
     * @example
     * class Page extends AbstractPage {
     *   constructor() {
     *     super();
     *     this.defineElement({
     *         alias: "YourElement",
     *         selector: "div > div",
     *         selectorType: "cssContainingText",
     *         text: "some text"});
     *     }
     * }
     */
    defineElement(element) {
        this.elements.set(element.alias, new Element(element));
    }

    /**
     * Define collection on page
     * @param {string} collection.alias - alias
     * @param {string} collection.selector - selector
     * @param {string} [collection.selectorType] - selector type (css, cssContainingText, xpath) (default css)
     * @param {string} [collection.text] - text (for cssContainingText selector type)
     * @example
     * class Page extends AbstractPage {
     *   constructor() {
     *     super();
     *     this.defineCollection({
     *         alias: "YourCollection",
     *         selector: "div > div",
     *         selectorType: "cssContainingText",
     *         text: "some text"});
     *     }
     *   }
     * }
     */
    defineCollection(collection) {
        this.elements.set(collection.alias, new Collection(collection));
    }

    /**
     * Define component on page
     * @param {string} [component.alias] - alias or component
     * @param {Component} component.component - component
     * @example
     * class Page extends AbstractPage {
     *   constructor() {
     *     super();
     *     this.defineComponent({
     *         alias: "YourComponent",
     *         component: new CustomComponent()});
     *     this.defineComponent({
     *         component: new CustomComponent()
     *     });
     *   }
     * }
     */
    defineComponent(component) {
        if (component.alias) {
            this.elements.set(component.alias, component.component);
        } else {
            this.elements.set(component.component.alias, component.component);
        }
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

/**
 * Component tree node
 * @type {ComponentNode}
 * @private
 */
class ComponentNode {

    /**
     * Constructor of Component Node
     * @param {*} element
     * @param {AbstractPage|Component} component
     */
    constructor(element, component) {
        this.element = element;
        this.component = component;
    }

}

/**
 * Class representing set of element of token
 * @type {ParsedToken}
 * @private
 */
class ParsedToken {

    /**
     * Define token
     * @param {string} token
     */
    constructor(token) {
        const ELEMENT_OF_COLLECTION_REGEXP = /#([!\$]?.+)\s+(in|of)\s+(.+)/;
        if (ELEMENT_OF_COLLECTION_REGEXP.test(token)) {
            const parsedTokens = token.match(ELEMENT_OF_COLLECTION_REGEXP);
            const value = parsedTokens[1];

            this.index = parsedTokens[2] === "of" ? Number.parseInt(value) : undefined;
            this.innerText = parsedTokens[2] === "in" ? value : undefined;
            this.alias = parsedTokens[3];
        } else {
            this.alias = token;
        }
    }

    /**
     * Check if token is element of collection
     * @return {boolean}
     * @public
     */
    isElementOfCollection() {
        return this.index !== undefined || this.innerText !== undefined
    }

    /**
     * Check if token is of
     * @return {boolean}
     * @public
     */
    hasTokenOf() {
        return this.index !== undefined
    }

    /**
     * Check if token is in
     * @return {boolean}
     * @public
     */
    hasTokenIn(){
        return this.innerText !== undefined
    }

}

module.exports = WebdriverIOAbstractPage;