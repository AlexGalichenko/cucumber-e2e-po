/**
 * Element
 * @type {Element}
 */
class Element {

    /**
     * Constructor of element
     * @param {string} alias - alias of element
     * @param {string} selector - selector
     * @param {string} [selectorType] - selector type (css, cssContainingText, xpath)
     * @param {string} [text] - text for cssContainingText
     */
    constructor(alias, selector, selectorType = "css", text = "") {
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
        this.isCollection = false;
    }

}

module.exports = Element;