/**
 * Element
 * @type {Element}
 */
class Element {

    /**
     * Constructor of element
     * @param {string} element.alias - alias of element
     * @param {string} element.selector - selector
     * @param {string} [element.selectorType] - selector type (css, cssContainingText, xpath)
     * @param {string} [element.text] - text for cssContainingText
     */
    constructor(element) {
        if (!element.alias) {
            throw new Error(`Alias of ${this.constructor.name} is not defined`)
        }

        if (!element.selector) {
            throw new Error(`Selector of ${this.constructor.name} is not defined`)
        }

        this.alias = element.alias;
        this.selector = element.selector;
        this.selectorType = element.selectorType || "css";
        this.text = element.text ? element.text : "";
        this.isCollection = false;
    }

}

module.exports = Element;