# Page Objects
## Page Map
Page map is collection of defined pages which will be used in State object to easy switch beetween pages.
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
|-|-|-|
| alias | M | alias of the page |
| regexp | M | regexp of URL to determine page |
| page | M | page object |

To use page map call setPageMap method of State class. Prepare hooks is a good place to do that.
```javascript
onPrepare: () => {
    State.setPageMap(new PageMap());
}
```
Set new page.
```javascript
State.setPage("YourName");
```
Get page. Returns one which was set.
```javascript
const page = State.getPage();
```
## Page
PO model supports both Protractor and WebdriverIO.
```javascript
/**
* Recomended to define base page extended from AbstractPage
**/
const ProtractorPage = require("@cucumber-e2e/po").ProtractorPage;
const WebdriverIOPage = require("@cucumber-e2e/po").WebdriverIOPage;
const CustomComponent = require("./CustomComponent");

class CustomPage extends ProtractorPage {
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
To get element from page call getElement method with alias of provided element.
```javascript
const page = State.getPage();
const element = page.getElement("Simple Element"); //get single element or collection
const elementOfComponent = page.getElement("Component > Element"); //get element or collection of component
const elementOfCollection = page.getElement("#1 of Collection"); //get element of collection by index
const firstElementOfCollection = page.getElement("#FIRST of Collection"); //get element of collection by index
const lastElementOfCollection = page.getElement("#LAST of Collection"); //get element of collection by index
const partOfCollection = page.getElement("#2-3 of Collection"); //get part of collection by start index and end index
const partOfByStartIndexCollection = page.getElement("#>2 of Collection"); //get part of collection by start index
const partOfByEndIndexCollection = page.getElement("#<4 of Collection"); //get part of collection by end index
//get element of collection by text (only visible text supported for webdriverIO)
const elementOfCollectionByText = page.getElement("#Text in Collection");
//get element of collection by exact text (only visible text supported for webdriverIO)
const elementOfCollectionByExactText = page.getElement("@Text in Collection");
//get element of collection by regexp text (only visible text supported for webdriverIO)
const elementOfCollectionByRegexp = page.getElement("/endwith$/ in Collection");
//get subset of collection by text (only visible text supported for webdriverIO)
const subsetOfCollectionByText = page.getElement("all #Text in Collection");
//get subset of collection by exact text (only visible text supported for webdriverIO)
const subsetOfCollectionByExactText = page.getElement("all @Text in Collection");
//get subset of collection by regexp text (only visible text supported for webdriverIO)
const subsetOfCollectionByRegexp = page.getElement("all /endwith$/ in Collection");
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
