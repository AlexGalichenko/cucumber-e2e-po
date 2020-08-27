const Page = require('./Page.js');

/**
 * Component
 * @type {Component}
 */
class Component extends Page {

    /**
     * Constructor of component or collection of components
     * @param {string} component.alias - alias of Collection
     * @param {string} component.selector - selector
     * @param {boolean} [component.isCollection] - isCollection flag
     * @param {string} [component.selectorType] - selector type (css, cssContainingText, xpath)
     * @param {string} [component.text] - text for cssContainingText
     */
    constructor(component) {
        super();

        if (!component.alias) {
            throw new Error(`Alias of ${this.constructor.name} is not defined`)
        }

        if (!component.selector) {
            throw new Error(`Selector of ${this.constructor.name} is not defined`)
        }

        this.alias = component.alias;
        this.selector = component.selector;
        this.selectorType = component.selectorType || 'css';
        this.text = component.text ? component.text : '';
        this.isCollection = Boolean(component.isCollection);
    }

}

module.exports = Component;