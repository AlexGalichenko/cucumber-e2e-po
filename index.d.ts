interface ElementDefinition {
  alias: string,
  selector: string|object,
  selectorType?: string,
  text?: string
}

interface ComponentDefinition extends ElementDefinition {
  isCollection: boolean
}

export class State {
  static setPageMap(pageMap: PageMap): void;
  static setPage(pageName: string): void;
  static getPage(): ProtractorPage|WebdriverIOPage|SeleniumPage;
}

export class Collection {
  constructor(collection: ElementDefinition)
}

export class Element {
  constructor(element: ElementDefinition)
}

export class Page {
  defineElement(element: Element): void;
  defineCollection(collection: Collection): void;
  defineComponent(component: Component): void;
  getElement(key: string): Object;
}

export class Component extends Page {
  constructor(component: ComponentDefinition)
}

export class ProtractorPage extends Page {}
export class WebdriverIOPage extends Page {}
export class SeleniumPage extends Page {}

export class PageMap {
  definePage(alias: string, selector: string|RegExp, pageObject: Page): void;
  getPage(alias: string): Page;
}