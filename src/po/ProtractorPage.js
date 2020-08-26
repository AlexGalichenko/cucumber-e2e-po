const Page = require('./Page');
const { element } = require('protractor');
const by = require('./helpers/extendedBy.js');
const parseTokens = require('./parseTokens.js');
const Collection = require('./Collection');

class ProtractorPage extends Page {

    constructor() {
        super();
    }

    /**
     * Get element by element path
     * @param {string} path - element path
     * @return {ElementFinder|ElementArrayFinder} - protractor element
     * @override
     */
    getElement(path) {
        const tokens = parseTokens(path);
        const elementList = this.getElementList(tokens);
        const root = element(by.css('html'));
        const reducer = (frameworkElement, elementDefiniton) => this.getFrameworkElement(frameworkElement, elementDefiniton);
        return elementList.reduce(reducer, root);
    }

    /**
     * @private
     * 
     */
    getFrameworkElement(frameworkElement, elementDefiniton) {
        if (elementDefiniton.selectorType === 'js') return element(this.getSelector(elementDefiniton));
        if (!elementDefiniton.token || !elementDefiniton.token.type) return this.getChildElement(frameworkElement, elementDefiniton);
        if (elementDefiniton.token.byIndex) return this.getElementFromCollectionByIndex(frameworkElement, elementDefiniton);
        if (elementDefiniton.token.byText) return this.getElementFromCollectionByText(frameworkElement, elementDefiniton);
    }

    getChildElement(frameworkElement, elementDefiniton) {
        const selector = this.getSelector(elementDefiniton);
        if (elementDefiniton.token.isThis) return frameworkElement
        if (elementDefiniton.isCollection || frameworkElement.count) return frameworkElement.all(selector);
        return frameworkElement.element(selector)
    }

    //Index
    getElementFromCollectionByIndex(frameworkElement, elementDefiniton) {
        const collection = this.getRootElement(frameworkElement, elementDefiniton);
        if (elementDefiniton.token.byExactIndex) return this.getElementFromCollectionByExactIndex(collection, elementDefiniton)
        if (elementDefiniton.token.byRangeBetween) return this.getElementsFromCollectionByRange(collection, elementDefiniton)
        if (elementDefiniton.token.byRangeGreater) return this.getElementsFromCollectionByGreater(collection, elementDefiniton)
        if (elementDefiniton.token.byRangeLess) return this.getElementsFromCollectionByLess(collection, elementDefiniton)
    }

    getElementFromCollectionByExactIndex(collection, elementDefiniton) {
        if (elementDefiniton.token.value === 'LAST') return collection.last()
        return collection.get(elementDefiniton.token.value - 1)
    }

    getElementsFromCollectionByRange(collection, elementDefiniton) {
        const { startIndex, endIndex } = elementDefiniton.token.value;
        const filterFn = (_, i) => i >= startIndex - 1 && i <= endIndex - 1;
        return collection.filter(filterFn)
    }

    getElementsFromCollectionByGreater(collection, elementDefiniton) {
        const { startIndex } = elementDefiniton.token.value;
        const filterFn = (_, i) => i > startIndex - 1;
        return collection.filter(filterFn)
    }

    getElementsFromCollectionByLess(collection, elementDefiniton) {
        const { endIndex } = elementDefiniton.token.value;
        const filterFn = (_, i) => i < endIndex - 1;
        return collection.filter(filterFn)
    }

    //Text
    getElementFromCollectionByText(frameworkElement, elementDefiniton) {
        if (elementDefiniton.token.byPartialText) return this.getElementFromCollectionByTextFilter(
            frameworkElement,
            elementDefiniton,
            text => text.includes(elementDefiniton.token.value)
        )
        if (elementDefiniton.token.byExactText) return this.getElementFromCollectionByTextFilter(
            frameworkElement,
            elementDefiniton,
            text => text === elementDefiniton.token.value
        )
        if (elementDefiniton.token.byRegExp) return this.getElementFromCollectionByTextFilter(
            frameworkElement,
            elementDefiniton,
            text => elementDefiniton.token.value.test(text)
        )
    }

    /**
     * Get element from collection by text
     * @param {ElementArrayFinder} frameworkElement - element to interact
     * @param {Element|Collection|Component} elementDefiniton
     * @param {Function} filterFn - function to filter element in collection
     */
    getElementFromCollectionByTextFilter(frameworkElement, elementDefiniton, filterFn) {
        if (this.isSelectorTransformable(elementDefiniton)) return frameworkElement.element(this.transformSelector(elementDefiniton))
        const collection = this.getRootElement(frameworkElement, elementDefiniton);
        const isAll = elementDefiniton.token.hasAllModifier;
        return this.getElementByFilter(collection, isAll, filterFn);
    }

    getElementByFilter(collection, isAll, filterFn) {
        const filteredCollection = collection.filter(element => element.getText().then(filterFn));
        if (isAll) return filteredCollection
        return filteredCollection.first()
    }

    getRootElement(frameworkElement, elementDefiniton) {
        const selector = this.getSelector(elementDefiniton);
        return !elementDefiniton.token.isThis ? frameworkElement.all(selector) : frameworkElement;
    }

    getSelector(element) {
        switch (element.selectorType) {
            case 'css': return by.css(element.selector);
            case 'xpath': return by.xpath(element.selector);
            case 'js': return by.js(element.selector);
            case 'android': return {
                using: '-android uiautomator',
                value: element.selector
            };
            case 'ios': return {
                using: '-ios uiautomation',
                value: element.selector
            };
            case 'accessibilityId': return {
                using: 'accessibility id',
                value: element.selector
            };
            case 'cssContainingText': {
                if (element.text) {
                    return by.cssContainingText(element.selector, element.text)
                } else {
                    throw new Error('Text is not defined')
                }
            }
            default: throw new Error(`Selector type ${element.selectorType} is not defined`);
        }
    }

    isSelectorTransformable(elementDefiniton) {
        const noAllModifier = !elementDefiniton.token.hasAllModifier;
        const notThis = !elementDefiniton.token.isThis;
        switch (true) {
            case noAllModifier && notThis && elementDefiniton.selectorType === 'css': return true;
            case noAllModifier && notThis && elementDefiniton.selectorType === 'android': return true;
            default: return false
        }
    }

    transformSelector(elementDefiniton) {
        switch (elementDefiniton.selectorType) {
            case 'css': {
                switch (true) {
                    case elementDefiniton.token.byPartialText: return by.cssContainingText(elementDefiniton.selector, elementDefiniton.token.value);
                    case elementDefiniton.token.byExactText: return by.cssExactText(elementDefiniton.selector, elementDefiniton.token.value);
                    case elementDefiniton.token.byRegExp: return by.cssContainingText(elementDefiniton.selector, elementDefiniton.token.value);
                }
            } break;
            case 'android': return {
                using: '-android uiautomator',
                value: `${elementDefiniton.selector}.text('${elementDefiniton.value}')`
            };
        }
    }
}

module.exports = ProtractorPage;
