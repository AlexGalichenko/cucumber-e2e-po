const Token = require('./Token.js');
const regexp = require("./helpers/regexp");

function parseTokens(path) {
  const tokenList = path.split(regexp.TOKEN_SPLIT_REGEXP);
  return tokenList.map(token => new Token(token.match(regexp.ELEMENT_OF_COLLECTION_REGEXP).groups));
}

module.exports = parseTokens;