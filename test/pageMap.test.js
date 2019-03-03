const AbstractPageMap = require("../lib/page_map/AbstractPageMap");
const AbstractPage = require("../lib/po/AbstractPage");

const page = new AbstractPage();
class PageMap extends AbstractPageMap {
    constructor() {
        super();
        this.definePage("Page", ".+^", page);
    }
}
const pageMap = new PageMap();

test("define page", () => {
    expect(pageMap.pages.get("Page").alias).toBe("Page");
    expect(pageMap.pages.get("Page").selector).toBe(".+^");
    expect(pageMap.pages.get("Page").pageObject).toBe(page);
});

test("get defined page", () => {
    const pageDefinition = pageMap.getPage("Page");
    expect(pageDefinition.alias).toBe("Page");
    expect(pageDefinition.selector).toBe(".+^");
    expect(pageDefinition.pageObject).toBe(page);
});

test("get not defined page", () => {
    function errorHandler() {
        pageMap.getPage("Not Existing Page")
    }
    expect(errorHandler).toThrowError("Not Existing Page page is not defined");
});
