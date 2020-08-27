const AbstractPageMap = require("../src/page_map/PageMap");
const Page = require("../src/po/Page");

const page = new Page();
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
