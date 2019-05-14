exports.config = {
    directConnect: true,
    specs: ['protractor.test.js'],
    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            args: ["--headless"]
        }
    }
};
