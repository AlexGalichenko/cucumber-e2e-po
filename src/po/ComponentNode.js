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

module.exports = ComponentNode;