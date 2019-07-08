const path = require("path");
const TestCafePage = require("../lib/po/TestCafePage");
const Component = require("../lib/po/Component");
const Selector = require("testcafe").Selector;
const expect = require("chai").expect;

class TestPage extends TestCafePage {
    constructor() {
        super();
    }
}

const testPage = new TestPage();

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

testPage.setSelector(Selector);

fixture("testcafe tests")
    .page("file:///" + path.resolve("./test/testPage.html"));

test("get single element", async function() {
    expect(await (testPage.getElement("single element")).innerText).to.equal("text of single element");
});

test("get child element", async function() {
    expect(await (testPage.getElement("component > child element")).innerText).to.equal("text of first child item");
});

test("get item from collection by index", async function() {
    expect(await (testPage.getElement("#1 of collection")).innerText).to.equal("First");
});

test("get item from collection by index alias FIRST", async function() {
    expect(await (testPage.getElement("#FIRST of collection")).innerText).to.equal("First");
});

test("get item from collection by index alias LAST", async function() {
    expect(await (testPage.getElement("#LAST of collection")).innerText).to.equal("Last");
});

test("get item from collection by partial text", async function() {
    expect(await (testPage.getElement("#cond in collection")).innerText).to.equal("Second");
});

test("get item from collection by exact text", async function() {
    expect(await (testPage.getElement("@Third Third in collection")).innerText).to.equal("Third Third");
});

test("get item from collection by regexp", async function() {
    expect(await (testPage.getElement("/^.+ird Th.+$/ in collection")).innerText).to.equal("Third Third");
});

test("get collection by collection extending", async function() {
    expect(await testPage.getElement("component2 > child component > child element").nth(1).innerText).to.equal("2");
    expect(await testPage.getElement("component2 > child component > child element").count).to.equal(3);
});

test("get part of collection", async function () {
    expect(await testPage.getElement("#2-3 of collection").count).to.equal(2);
});

test("get part of collection", async function () {
    expect(await testPage.getElement("#>1 of collection").count).to.equal(4);
});

test("get part of collection", async function () {
    expect(await testPage.getElement("#<3 of collection").count).to.equal(2);
});

test("get subset from collection by partial text", async function () {
    expect(await testPage.getElement("all #Third in collection").count).to.equal(2);
});

test("get subset from collection by exact text", async function () {
    expect(await testPage.getElement("all @Third in collection").count).to.equal(1);
});

test("get subset from collection by regexp", async function () {
    expect(await testPage.getElement("all /Third/ in collection").count).to.equal(2);
});

test("get subset from collection by partial text", async function () {
    expect(await testPage.getElement("all #Third in collection > #1 of this").innerText).to.equal("Third");
});

test("get subset from collection by exact text", async function () {
    expect(await testPage.getElement("all @Third in collection > #Third in this").innerText).to.equal("Third");
});

test("get subset from collection by regexp", async function () {
    expect(await testPage.getElement("all /Third/ in collection > all @Third in this").count).to.equal(1);
});

test("get single element with js selector", async function() {
    expect(await testPage.getElement("single element js").innerText).to.equal("text of single element");
});

test("verify did you mean feature", async function () {
    try {
        await testPage.getElement("component2 > children component > child element")
    } catch (e) {
        expect(e.message).to.equal("There is no such element: 'children component'\nDid you mean:\nchild component");
    }
});

