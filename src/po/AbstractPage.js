const Element = require("./Element");
const Collection = require("./Collection");
const regexp = require("./helpers/regexp");
/**
 * @abstract
 */
class AbstractPage {

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
     * Get tokens array from alias
     * @param alias
     * @protected
     */
    _getTokens(alias) {
        return alias.split(regexp.TOKEN_SPLIT_REGEXP);
    }

}

module.exports = AbstractPage;
