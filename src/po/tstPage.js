const Page = require('./Page.js');
const Component = require('./Component.js');
const parseTokens = require('./parseTokens.js');

class DeepComponent extends Component {

  constructor() {
    super({
      alias: 'Deep Component',
      selector: 'deep component'
    })
    this.defineElement({alias: 'Firstly Registered Deep Component Element', selector: '8888'});
    this.defineElement({alias: 'Deep Component Element', selector: '7777'});
  }

}

class SomeComponent extends Component {

  constructor() {
    super({
      alias: 'Some Component',
      selector: 'h1'
    })
    this.defineElement({alias: 'Another Deep Component Element', selector: '123321'});
    this.defineComponent({
      alias: 'Deep Component',
      component: new DeepComponent()
    })
  }

}

class SomePage extends Page {

  constructor() {
    super();
    this.defineElement({alias: 'Simple Element', selector: 'div1'});
    this.defineComponent({
      alias: 'Some Component',
      component: new SomeComponent()
    })
  }

}

const somePage = new SomePage();
const tokens = parseTokens('Some Component > Deep Component Element')
console.log(somePage.getElementList(tokens));