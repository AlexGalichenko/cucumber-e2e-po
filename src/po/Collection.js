const Element = require("./Element");

/**
 * Collection of elements
 * @type {Collection}
 */
class Collection extends Element {

    /**
     * Constructor of collection
     * @param {string} collection.alias - alias of Collection
     * @param {string} collection.selector - selector
     * @param {string} [collection.selectorType] - selector type (css, cssContainingText, xpath)
     * @param {string} [collection.text] - text for cssContainingText
     */
    constructor(collection) {
        super(collection);
        this.isCollection = true;
    }

}

module.exports = Collection;