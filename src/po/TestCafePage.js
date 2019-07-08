const AbstractPage = require("./AbstractPage");
const ComponentNode = require("./ComponentNode");
const ParsedToken = require("./ParsedToken");
const NoSuchElementException = require("./exception/NoSuchElementException");
const regexp = require("./helpers/regexp");

/**
 * @extends {AbstractPage}
 */
class TestCafePage extends AbstractPage {

    constructor() {
        super();
        this.Selector = null;
    }

    /**
     * Set Selector class
     * Need to be done before call getElement()
     * @param selector {class} - class of testcafe selector
     * @return {TestCafePage}
     */
    setSelector(selector) {
        this.Selector = selector;
        return this
    }

    /**
     * Get element by key
     * @param {string} key - key
     * @return {*} - testcafe element
     * @override
     */
    getElement(key) {
        const tokens = ParsedToken.getTokens(key);
        const firstToken = tokens.shift();
        const startNode = new ComponentNode(
            this._getTestcafeElement(null, this, firstToken),
            this._getComponent(this, firstToken)
        );
        const testcafeElement = tokens.reduce((current, token) => {
            return new ComponentNode(
                this._getTestcafeElement(current.element, current.component, token),
                this._getComponent(current.component, token)
            )
        }, startNode);

        return testcafeElement.element;
    }

    /**
     * Get testcafe single element or collection of elements or element from collection
     * @param {*} currentElement - current element
     * @param {AbstractPage|Component} currentComponent - current component
     * @param {string} token - token to get new element
     * @return {*} - return new element
     * @private
     */
    _getTestcafeElement(currentElement, currentComponent, token) {
        const parsedToken = new ParsedToken(token);
        if (parsedToken.isElementOfCollection()) {
            return this._getElementOfCollection(currentElement, currentComponent, parsedToken)
        } else {
            return this._getElementOrCollection(currentElement, currentComponent, parsedToken)
        }
    }

    /**
     * Get testcafe element by index or text
     * @param {*} currentElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - parsed token
     * @return {*} - new testcafe element
     * @private
     */
    _getElementOfCollection(currentElement, currentComponent, parsedToken) {
        const ROOT_ELEMENT_SELECTOR = "body";
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        const rootElement = currentElement ? currentElement : this.Selector(ROOT_ELEMENT_SELECTOR);
        if (newComponent.isCollection) {
            const elementsCollection = parsedToken.alias !== "this"
                ? rootElement.find(this._getSelector(newComponent))
                : rootElement;
            if (parsedToken.hasTokenIn()) return this._getElementOfCollectionByText(elementsCollection, parsedToken);
            if (parsedToken.hasTokenOf()) return this._getElementOfCollectionByIndex(elementsCollection, parsedToken);
        } else {
            throw new Error(`${parsedToken.alias} is not collection`)
        }
    }

    /**
     * Get element from collection by text
     * @param elementsCollection - collection to select from
     * @param parsedToken - token to select element
     * @return {Selector} - new protractor element
     * @private
     */
    _getElementOfCollectionByText(elementsCollection, parsedToken) {
        let filteredElements;
        if (parsedToken.isPartialMatch()) filteredElements = elementsCollection.withText(parsedToken.innerText);
        if (parsedToken.isExactMatch()) filteredElements = elementsCollection.withExactText(parsedToken.innerText);
        if (parsedToken.isRegexp()) filteredElements = elementsCollection.withText(new RegExp(parsedToken.innerText));

        if (parsedToken.hasAllModifier()) return filteredElements;
        return filteredElements.nth(0)
    }

    /**
     * Get element from collection by index
     * @param elementsCollection - collection to select from
     * @param parsedToken - token to select element
     * @return {ElementFinder|ElementArrayFinder} - new protractor element
     * @private
     */
    _getElementOfCollectionByIndex(elementsCollection, parsedToken) {
        if (typeof parsedToken.index === "number") return elementsCollection.nth(parsedToken.index - 1);
        if (parsedToken.index === "FIRST") return elementsCollection.nth(0);
        if (parsedToken.index === "LAST") return elementsCollection.nth(-1);
        if (regexp.PARTIAL_ARRAY_REGEXP.test(parsedToken.index)) {
            const [startIndex, endIndex] = parsedToken.index.split("-");
            const filterFn = new Function(`_`, `i`, `return i >= (${startIndex} - 1) && i <= (${endIndex} - 1)`);
            return elementsCollection.filter(filterFn);
        }
        if (regexp.PARTIAL_MORE_LESS_REGEXP.test(parsedToken.index)) {
            const [operator, index] = [parsedToken.index[0], +parsedToken.index.slice(1)];
            const filterMoreFn = new Function(`_`, `i`, `return i > (${index} - 1)`);
            const filterLessFn = new Function(`_`, `i`, `return i < (${index} - 1)`);
            switch (operator) {
                case ">": return elementsCollection.filter(filterMoreFn);
                case "<": return elementsCollection.filter(filterLessFn);
                default: throw new Error(`Operator ${operator} is not defined`)
            }
        }
    }

    /**
     * Get testcafe element or collection
     * @param {*} currentElement - current element
     * @param {Component} currentComponent - current component
     * @param {ParsedToken} parsedToken - alias
     * @return {*} - new testcafe element
     * @private
     */
    _getElementOrCollection(currentElement, currentComponent, parsedToken) {
        const newComponent = this._getComponent(currentComponent, parsedToken.alias);
        return currentElement
            ? currentElement.find(this._getSelector(newComponent))
            : this.Selector(this._getSelector(newComponent));
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
        if (parsedToken.alias === "this") return currentComponent;
        if (currentComponent.elements.has(parsedToken.alias)) return currentComponent.elements.get(parsedToken.alias);
        throw new NoSuchElementException(parsedToken.alias, currentComponent);
    }

    /**
     * Resolve element by location strategy
     * @param {Element|Collection|Component} element - element to get selector
     * @return {WebDriverLocator|ProtractorLocator|Object} - by selector
     * @throws {Error}
     * @private
     */
    _getSelector(element) {
        switch (element.selectorType) {
            case "css": return element.selector;
            case "js": return element.selector;
            default: throw new Error(`Selector type ${element.selectorType} is not defined`);
        }
    }

}

module.exports = TestCafePage;
