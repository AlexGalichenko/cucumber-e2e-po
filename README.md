# How to run

* `gulp test --env dev --tags "@debug"`

# Page Objects
##Page Map
```javascript
const AbstractPageMap = require("protractor-boilerplate").AbstractPageMap;
const LoginPage = require("./page/LoginPage");

class PageMap extends AbstractPageMap {

    constructor() {
        super();

        this.definePage("Login", "^.+))$", LoginPage);

    }

}
```
###Methods
* definePage

| param | mandatory | description |
|--------|-----------|---------------------------------|
| alias | M | alias of the page |
| regexp | M | regexp of URL to determine page |
| clazz | M | page class |

##Page
```javascript
const Page = require("protractor-boilerplate").AbstractPage;
const CustomComponent = require("./CustomComponent");

class CustomPage extends Page {

    constructor() {
        super();

        this.defineComponent("Custom Component", new CustomComponent());
        this.defineElement("Custom Element", "h3");
        this.defineCollection("Custom Collection", "h3.button");
    }

}
```
###Methods
* defineComponent

| param | mandatory | description |
|-----------|-----------|------------------------|
| alias | M | alias of the component |
| component | M | component object |

* defineElement

| param | mandatory | description |
|----------|-----------|-------------------------|
| alias | M | alias of the component |
| selector | M | css selector of element |

* defineCollection

| param | mandatory | description |
|----------|-----------|-------------------------|
| alias | M | alias of the component |
| selector | M | css selector of element |

##Component
```javascript
const Component = require("protractor-boilerplate").Component;

class CustomComponent extends Component {

    constructor(alias = "Dashboard", selector = ".div", isCollection = false) {
        super(alias, selector, isCollection);

        this.defineComponent("Custom Component", new CustomComponent());
        this.defineElement("Custom Element", "h3");
        this.defineCollection("Custom Collection", "h3.button");
    }

}
```
###Methods
* constructor

| param | mandatory | description |
|--------------|-----------|-------------------------|
| alias | M | alias of the component |
| selector | M | css selector of element |
| isCollection | M | isCollection flag |

* defineComponent

| param | mandatory | description |
|-----------|-----------|------------------------|
| alias | M | alias of the component |
| component | M | component object |

* defineElement

| param | mandatory | description |
|----------|-----------|-------------------------|
| alias | M | alias of the component |
| selector | M | css selector of element |

* defineCollection

| param | mandatory | description |
|----------|-----------|-------------------------|
| alias | M | alias of the component |
| selector | M | css selector of element |