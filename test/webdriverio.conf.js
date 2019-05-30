exports.config = {
    directConnect: true,
    runner: 'local',
    specs: ['./test/webdriverio.test.js'],
    framework: 'jasmine',
    services: ['selenium-standalone'],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: "chrome",
        "goog:chromeOptions": {
            args: ["--headless"]
        }
    }],
    bail: 0,
    reporters: ['spec'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 20000,
    },
    sync: false,
    logLevel: "trace",
};
