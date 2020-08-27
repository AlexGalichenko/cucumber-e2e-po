const Component = require("../src/po/Component.js");

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
    });
  }
}

class MyComponent2 extends Component {
  constructor() {
    super({
      alias: "component2",
      selector: ".list-components"
    });

    this.defineElement({
      alias: "first li",
      selector: "li:nth-child(1)"
    });

    this.defineComponent({
      alias: "child component",
      component: new ChildComponent()
    });
  }
}

/**
 * 
 * @param {Class} PageInterface 
 */
module.exports = function (PageInterface) {
  class TestPage extends PageInterface { }
  const testPage = new TestPage();

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

  return testPage
}