import {
  ProtractorPage,
  WebdriverIOPage,
  SeleniumPage,
  Component,
  Element,
  Collection,
  PageMap,
  State
} from "../index.js";

const element = new Element({
  alias: "element",
  selector: ".class-name",
})

const collection = new Collection({
  alias: "collection",
  selector: ".class-name"
})

const component = new Component({
  alias: "component",
  selector: ".class-name",
  isCollection: false
})

class TestProtractorPage extends ProtractorPage {
  constructor() {
    super();
    this.defineElement(element);
    this.defineCollection(collection);
    this.defineComponent(component);
    const page = this.getElement("component > element");
  }
}

class TestWDIOPage extends WebdriverIOPage {
  constructor() {
    super();
    this.defineElement(element);
    this.defineCollection(collection);
    this.defineComponent(component);
    const page = this.getElement("component > element");
  }
}

class TestSeleniumPage extends SeleniumPage {
  constructor() {
    super();
    this.defineElement(element);
    this.defineCollection(collection);
    this.defineComponent(component);
    const page = this.getElement("component > element");
  }
}

class Pages extends PageMap {
  constructor() {
    super()
    this.definePage("protractor page", /.+protractor.+/, new TestProtractorPage());
    this.definePage("wdio page", /.+wdio.+/, new TestWDIOPage());
    this.definePage("selenium page", /.+selenium.+/, new TestSeleniumPage());
  }
}

State.setPageMap(new Pages());
State.setPage("protractor page");
const page = State.getPage();