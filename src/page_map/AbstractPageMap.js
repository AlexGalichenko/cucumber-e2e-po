const State = require("../state/State");

/**
 * Class representing Page Map
 * @abstract
 * @type {AbstractPageMap}
 */
class AbstractPageMap {

    constructor() {
        this.pages = new Map();
    }

    /**
     * Define page by page selector
     * @param {string} alias - alias of page
     * @param {string|RegExp} selector - regexp selector of page
     * @param {AbstractPage} pageObject - constructed page
     * @example
     * class PageMap extends AbstractPageMap {
     *   constructor() {
     *     super();
     *     this.definePage("Your Page", /^.+page.html$/, new YourPage())
     *   }
     * }
     */
    definePage(alias, selector, pageObject) {
        this.pages.set(alias, new PageDefinition(alias, selector, pageObject))
    }

    /**
     * Get page definition by alias
     * @param {string} alias - alias of page definition
     * @return {PageDefinition} - page definition by alias
     */
    getPage(alias) {
        const page = this.pages.get(alias);
        if (page) {
            return page
        } else {
            throw new Error(`${alias} page is not defined`)
        }
    }

    init() {
        State.setPageMap(this);
    }

}

/**
 * Class representing page definition
 * @type {PageDefinition}
 */
class PageDefinition {

    /**
     * Page definition
     * @param {string} alias - alias
     * @param {string|RegExp} selector - selector
     * @param {AbstractPage} pageObject - page object
     */
    constructor(alias, selector, pageObject) {
        this.alias = alias;
        this.selector = selector;
        this.pageObject = pageObject;
    }

}

module.exports = AbstractPageMap;