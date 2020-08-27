const { by } = require('protractor');
const byCssExactText = require('./byCssExactText.js');

by.addLocator('cssExactText', byCssExactText);

module.exports = by;