const WebdriverIOPage = require("../lib/po/WebdriverIOPage");
const Component = require("../lib/po/Component");
const path = require("path");

class TestPage extends WebdriverIOPage {
    constructor() {
        super();
    }
}

const testPage = new TestPage();

describe("webdriverIO tests", () => {
    beforeAll(async () => {
        await browser.url(path.resolve("./test/testPage.html"));

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
    });

    it("get single element", async function() {
        expect(await (await testPage.getElement("single element")).getText()).toBe("text of single element");
    });

    it("get child element", async function() {
        expect(await (await testPage.getElement("component > child element")).getText()).toBe("text of first child item");
    });

    it("get item from collection by index", async function() {
        expect(await (await testPage.getElement("#1 of collection")).getText()).toBe("First");
    });

    it("get item from collection by index alias FIRST", async function() {
        expect(await (await testPage.getElement("#FIRST of collection")).getText()).toBe("First");
    });

    it("get item from collection by index alias LAST", async function() {
        expect(await (await testPage.getElement("#LAST of collection")).getText()).toBe("Last");
    });

    it("get item from collection by partial text", async function() {
        expect(await (await testPage.getElement("#cond in collection")).getText()).toBe("Second");
    });

    it("get item from collection by exact text", async function() {
        expect(await (await testPage.getElement("@Third Third in collection")).getText()).toBe("Third Third");
    });

    it("get item from collection by regexp", async function() {
        expect(await (await testPage.getElement("/^.+ird Th.+$/ in collection")).getText()).toBe("Third Third");
    });

    it("get collection by collection extending", async function() {
        expect(await (await testPage.getElement("component2 > child component > child element"))[1].getText()).toBe("2");
        expect((await testPage.getElement("component2 > child component > child element")).length).toBe(3);
    });

    // it("verify did you mean feature", async function () {
    //     try {
    //         await testPage.getElement("component2 > children component > child element")
    //     } catch (e) {
    //         expect(e.message).toEqual("There is no such element: 'children component'\nDid you mean:\nchild component");
    //     }
    // });

});
