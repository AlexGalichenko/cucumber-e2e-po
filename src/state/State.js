/**
 * Class representing State
 * @param {State}
 */
class State {

    /**
     * Set page map
     * @param {AbstractPageMap} pageMap - page map
     * @example State.setPageMap(new PageMap());
     */
    static setPageMap(pageMap) {
        this.pageMap = pageMap;
    }

    /**
     * Set current page by Name
     * @param {string} pageName - name of page ot set
     * @example State.setPage("YourPage");
     */
    static setPage(pageName) {
        this.page = this.pageMap.getPage(pageName).pageObject;
    }

    /**
     * Get current page
     * @return {AbstractPage} - current page
     * @throws {Error}
     * @example State.getPage();
     */
    static getPage() {
        if (this.page) {
            return this.page;
        } else {
            throw new Error("Current page is not defined")
        }
    }
}

module.exports = State;