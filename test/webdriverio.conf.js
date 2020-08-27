exports.config = {
    directConnect: true,
    runner: 'local',
    specs: ['./test/webdriverio.test.js'],
    framework: 'jasmine',
    services: ['chromedriver'],
    hostname: 'localhost',
    port: 4444,
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless']
        }
    }],
    bail: 0,
    reporters: ['spec'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 20000,
    },
    sync: false,
    logLevel: 'trace',
};
