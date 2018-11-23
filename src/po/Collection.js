const Element = require("./Element");

/**
 * Collection of elements
 * @type {Collection}
 */
class Collection extends Element {

    /**
     * Constructor of collection
     * @param {string} alias - alias of Collection
     * @param {string} selector - selector
     * @param {string} [selectorType] - selector type (css, cssContainingText, xpath)
     * @param {string} [text] - text for cssContainingText
     */
    constructor(alias, selector, selectorType = "css", text = "") {
        super(alias, selector, selectorType, text);
        this.isCollection = true;
    }

}

module.exports = Collection;