exports.config = {
    chromeDriver: require("../node_modules/webdriver-manager-replacement/downloads/chromedriver.config.json").last,
    directConnect: true,
    specs: ['protractor.test.js'],
    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            args: ["--headless"]
        }
    }
};
