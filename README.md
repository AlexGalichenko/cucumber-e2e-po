# Page Objects
Page map is the collection of defined pages which will be used in State object to easy switch beetween pages.
## Page Map
```javascript
const PageMap = require("@cucumber-e2e").PageMap;
const LoginPage = require("./LoginPage");

/**
* To define your own map just extend and apply page map on state object
**/
class CustomPageMap extends PageMap {
    constructor() {
        super();
        /**
        * methods pass alias to get page, RegExp that defines URL of page and object of Page
        **/
        this.definePage("Login", "^.+$", new LoginPage());
    }
}
```
### Methods
* definePage

| param | mandatory | description |
|--------|-----------|---------------------------------|
| alias | M | alias of the page |
| regexp | M | regexp of URL to determine page |
| page | M | page object |

## Page
PO model supports both Protractor and WebdriverIO.
```javascript
/**
* Recomended to define base page extended from AbstractPage
**/
const ProtractorPage = require("@cucumber-e2e/po").ProtractorPage;
const WebdriverIOPage = require("@cucumber-e2e/po").WebdriverIOPage;
const CustomComponent = require("./CustomComponent");

class CustomPage extends Page {
    constructor() {
        super();
        this.defineComponent({alias: "Custom Component", component: new CustomComponent()});
        // default selectorType is css
        this.defineElement({alias: "Custom Element", selector: "h3"});
        this.defineElement({
            alias: "CSS Containing Text Custom Element",
            selectorType: "cssContainingText",
            selector: "h3",
            text: "Your Text"
        });
        this.defineCollection({alias: "Custom Collection", selector: "h3.button"});
        this.defineCollection({
            alias: "XPath Custom Collection",
            selectorType: "xpath",
            selector: "//div/input"
        });
    }
}
```
## Component
```javascript
class CustomComponent extends Component {
    constructor() {
        super({
            alias: "Your Component",
            selector: "form:nth-child(1)",
            isCollection: false
        });
        this.defineComponent({alias: "Custom Component", component: new CustomComponent()});
        // default selectorType is css
        this.defineElement({alias: "Custom Element", selector: "h3"});
        this.defineElement({
            alias: "CSS Containing Text Custom Element",
            selectorType: "cssContainingText",
            selector: "h3",
            text: "Your Text"
        });
        this.defineCollection({alias: "Custom Collection", selector: "h3.button"});
        this.defineCollection({
            alias: "XPath Custom Collection",
            selectorType: "xpath",
            selector: "//div/input"
        });
    }
}
```
