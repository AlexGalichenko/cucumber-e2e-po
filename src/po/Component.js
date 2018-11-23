const AbstractPage = require("./AbstractPage");

/**
 * Component
 * @type {Component}
 */
class Component extends AbstractPage {

    /**
     * Constructor of component or collection of components
     * @param {string} alias - alias of Collection
     * @param {string} selector - selector
     * @param {boolean} [isCollection] - isCollection flag
     * @param {string} [selectorType] - selector type (css, cssContainingText, xpath)
     * @param {string} [text] - text for cssContainingText
     */
    constructor(alias, selector, isCollection = false, selectorType = "css", text = "") {
        super();

        if (!alias) {
            throw new Error(`Alias of ${this.constructor.name} is not defined`)
        }

        if (!selector) {
            throw new Error(`Selector of ${this.constructor.name} is not defined`)
        }

        this.alias = alias;
        this.selector = selector;
        this.selectorType = selectorType;
        this.text = text;
        this.isCollection = isCollection;
    }

}

module.exports = Component;