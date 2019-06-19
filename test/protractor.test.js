const ProtractorPage = require("../lib/po/ProtractorPage");
const Component = require("../lib/po/Component");
const path = require("path");

class TestPage extends ProtractorPage {
    constructor() {
        super();
    }
}

const testPage = new TestPage();

describe("protractor tests", () => {
    beforeAll(() => {
        browser.waitForAngularEnabled(false);
        browser.get(path.resolve("./test/testPage.html"));

        class MyComponent extends Component {
            constructor() {
                super({
                    alias: "component",
                    selector: ".container"
                });

                this.defineElement({
                    alias: "child element",
                    selector: ".child-item"
                });
            }
        }

        class ChildComponent extends Component {
            constructor() {
                super({
                    alias: "child component",
                    selector: ".l-component",
                    isCollection: true
                });

                this.defineElement({
                    alias: "child element",
                    selector: "div"
                })
            }
        }

        class MyComponent2 extends Component {
            constructor() {
                super({
                    alias: "component2",
                    selector: ".list-components"
                });

                this.defineComponent({
                    alias: "child component",
                    component: new ChildComponent()
                });
            }
        }

        testPage.defineComponent({
            alias: "component2",
            component: new MyComponent2()
        });

        testPage.defineElement({
            alias: "single element",
            selector: ".single-element"
        });

        testPage.defineComponent({
            alias: "component",
            component: new MyComponent()
        });

        testPage.defineCollection({
            alias: "collection",
            selector: "ol > li"
        });

        testPage.defineElement({
            alias: "single element js",
            selector: function () {
                return document.querySelector(".single-element")
            },
            // selector: "return document.querySelector(\".single-element\")",
            selectorType: "js"
        });
    });

    it("get single element", async () => {
        expect(await testPage.getElement("single element").getText()).toBe("text of single element");
    });

    it("get child element", async function () {
        expect(await testPage.getElement("component > child element").getText()).toBe("text of first child item");
    });

    it("get item from collection by index", async function () {
        expect(await testPage.getElement("#1 of collection").getText()).toBe("First");
    });

    it("get item from collection by index alias FIRST", async function () {
        expect(await testPage.getElement("#FIRST of collection").getText()).toBe("First");
    });

    it("get item from collection by index alias LAST", async function () {
        expect(await testPage.getElement("#LAST of collection").getText()).toBe("Last");
    });

    it("get item from collection by partial text", async function () {
        expect(await testPage.getElement("#cond in collection").getText()).toBe("Second");
    });

    it("get item from collection by exact text", async function () {
        expect(await testPage.getElement("@Third Third in collection").getText()).toBe("Third Third");
    });

    it("get item from collection by regexp", async function () {
        expect(await testPage.getElement("/^.+ird Th.+$/ in collection").getText()).toBe("Third Third");
    });

    it("get collection by collection extending", async function () {
        expect(await testPage.getElement("component2 > child component > child element").count()).toBe(3);
    });

    it("get part of collection", async function () {
        expect(await testPage.getElement("#2-3 of collection").count()).toBe(2);
    });

    it("get part by operator > of collection", async function () {
        expect(await testPage.getElement("#>1 of collection").count()).toBe(4);
    });

    it("get part by operator < of collection", async function () {
        expect(await testPage.getElement("#<3 of collection").count()).toBe(2);
    });

    it("get subset from collection by partial text", async function () {
        expect(await testPage.getElement("all #Third in collection").count()).toBe(2);
    });

    it("get subset from collection by exact text", async function () {
        expect(await testPage.getElement("all @Third in collection").count()).toBe(1);
    });

    it("get subset from collection by regexp", async function () {
        expect(await testPage.getElement("all /Third/ in collection").count()).toBe(2);
    });

    it("get subset from collection by partial text", async function () {
        expect(await testPage.getElement("all #Third in collection > #1 of this").getText()).toBe("Third");
    });

    it("get subset from collection by exact text", async function () {
        expect(await testPage.getElement("all @Third in collection > #Third in this").getText()).toBe("Third");
    });

    it("get subset from collection by regexp", async function () {
        expect(await testPage.getElement("all /Third/ in collection > all @Third in this").count()).toBe(1);
    });

    it("verify did you mean feature", function () {
        function errorHandler() {
            const element = testPage.getElement("component2 > children component > child element")
        }
        expect(errorHandler).toThrowError(
            "There is no such element: 'children component'\nDid you mean:\nchild component"
        );
    });

    it("get single element by js", async () => {
        expect(await testPage.getElement("single element js").getText()).toBe("text of single element");
    });
});
