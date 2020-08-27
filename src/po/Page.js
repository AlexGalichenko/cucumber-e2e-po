const Element = require("./Element.js");
const Collection = require("./Collection.js");
const NoSuchElementException = require("./exception/NoSuchElementException.js");

/**
 * @abstract
 */
class Page {

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
     *         text: "some text"
     *     });
     *   }
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
     *         text: "some text"
     *     });
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
     *         component: new CustomComponent()
     *     });
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
     * Get list of definition by provided tokens
     * @protected
     * @param {Array<Token>} tokens
     * @returns {Array<Element|Collection|Component>} - list of elements
     */
    getElementList(tokens) {
        return tokens.reduce((data, token) => {
            const element = this.findNode(data.currentElement, token);
            if (!element) throw new NoSuchElementException(token.elementName, data.currentElement);
            return { result: [...data.result, ...element.path], currentElement: element}
        }, { result: [], currentElement: this }).result
    }

    /**
     * find node in case of skipped tokens
     * @private
     * @param {Element|Collection|Component} currentNode 
     * @param {Token} token 
     * @param {Array<Element|Collection|Component>} [path] - path to necessary node
     * @returns {Array<Element|Collection|Component>} - list of components
     */
    findNode(currentNode, token, path = []) {
        if (token.isThis) {
            const thisNode = Object.assign({}, currentNode);
            thisNode.token = token;
            thisNode.path = [...path, thisNode]
            return thisNode
        }
        if (currentNode.elements) {
            if (currentNode.elements.has(token.elementName)) {
                const element = currentNode.elements.get(token.elementName);
                element.path = [...path, element];
                element.token = token;
                return element
            }
            else {
                const childComponents = [...currentNode.elements.values()].filter(component => component.elements);
                for (const component of childComponents) {
                    return this.findNode(component, token, [...path, component]);
                }
            }
        }
        return null
    }

}

module.exports = Page;
