const Page = require("../src/po/Page");
const Component = require("../src/po/Component");

class TestPage extends Page {
    constructor() {
        super();
    }
}

const testPage = new TestPage();

test("define default css element", () => {
    testPage.defineElement({
        alias: "defaultCssAlias",
        selector: ".default.css"
    });

    const element = testPage.elements.get("defaultCssAlias");

    expect(element.alias).toBe("defaultCssAlias");
    expect(element.selector).toBe(".default.css");
    expect(element.selectorType).toBe("css");
    expect(element.text).toBe("");
    expect(element.isCollection).toBe(false);
});

test("define cssContainingText element", () => {
    testPage.defineElement({
        alias: "cssContainingTextAlias",
        selectorType: "cssContainingText",
        selector: ".default.css",
        text: "text"
    });

    const element = testPage.elements.get("cssContainingTextAlias");

    expect(element.alias).toBe("cssContainingTextAlias");
    expect(element.selector).toBe(".default.css");
    expect(element.selectorType).toBe("cssContainingText");
    expect(element.text).toBe("text");
    expect(element.isCollection).toBe(false);
});

test("define xpath element", () => {
    testPage.defineElement({
        alias: "xpathAlias",
        selectorType: "xpath",
        selector: "//xpath",
    });

    const element = testPage.elements.get("xpathAlias");

    expect(element.alias).toBe("xpathAlias");
    expect(element.selector).toBe("//xpath");
    expect(element.selectorType).toBe("xpath");
    expect(element.text).toBe("");
    expect(element.isCollection).toBe(false);
});

test("define default css collection", () => {
    testPage.defineCollection({
        alias: "defaultCssCollectionAlias",
        selector: ".default.css"
    });

    const element = testPage.elements.get("defaultCssCollectionAlias");

    expect(element.alias).toBe("defaultCssCollectionAlias");
    expect(element.selector).toBe(".default.css");
    expect(element.selectorType).toBe("css");
    expect(element.text).toBe("");
    expect(element.isCollection).toBe(true);
});

test("define cssContainingText collection", () => {
    testPage.defineCollection({
        alias: "cssContainingTextCollectionAlias",
        selectorType: "cssContainingText",
        selector: ".default.css",
        text: "text"
    });

    const element = testPage.elements.get("cssContainingTextCollectionAlias");

    expect(element.alias).toBe("cssContainingTextCollectionAlias");
    expect(element.selector).toBe(".default.css");
    expect(element.selectorType).toBe("cssContainingText");
    expect(element.text).toBe("text");
    expect(element.isCollection).toBe(true);
});

test("define xpath collection", () => {
    testPage.defineCollection({
        alias: "xpathCollectionAlias",
        selectorType: "xpath",
        selector: "//xpath",
    });

    const element = testPage.elements.get("xpathCollectionAlias");

    expect(element.alias).toBe("xpathCollectionAlias");
    expect(element.selector).toBe("//xpath");
    expect(element.selectorType).toBe("xpath");
    expect(element.text).toBe("");
    expect(element.isCollection).toBe(true);
});

test("define component", () => {
    testPage.defineComponent({
        alias: "componentAlias",
        component: new Component({
            alias: "alias",
            selector: "componentSelector"
        })
    });

    const element = testPage.elements.get("componentAlias");

    expect(element.alias).toBe("alias");
    expect(element.selector).toBe("componentSelector");
    expect(element.selectorType).toBe("css");
    expect(element.text).toBe("");
    expect(element.isCollection).toBe(false);
});

test("define component with default alias", () => {
    testPage.defineComponent({
        component: new Component({
            alias: "componentAlias",
            selector: "componentSelector"
        })
    });

    const element = testPage.elements.get("componentAlias");

    expect(element.alias).toBe("componentAlias");
    expect(element.selector).toBe("componentSelector");
    expect(element.selectorType).toBe("css");
    expect(element.text).toBe("");
    expect(element.isCollection).toBe(false);
});
