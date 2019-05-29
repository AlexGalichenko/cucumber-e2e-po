const regexp = require("./helpers/regexp");

/**
 * Class representing set of element of token
 * @type {ParsedToken}
 * @private
 */
class ParsedToken {

    /**
     * Define token
     * @param {string} token
     */
    constructor(token) {
        if (regexp.ELEMENT_OF_COLLECTION_REGEXP.test(token)) {
            const parsedTokens = token.match(regexp.ELEMENT_OF_COLLECTION_REGEXP);
            const value = parsedTokens[2];

            this.modifier = parsedTokens[1];
            this.index = parsedTokens[3] === "of"
                ? (
                    value !== "FIRST" &&
                    value !== "LAST" &&
                    !regexp.PARTIAL_ARRAY_REGEXP.test(value) &&
                    !regexp.PARTIAL_MORE_LESS_REGEXP.test(value)
                )
                    ? Number.parseInt(value)
                    : value : undefined;
            this.innerText = parsedTokens[3] === "in"
                ? this.modifier !== "/"
                    ? value
                    : new RegExp(value.replace(/\/$/, ""), "gmi")
                : undefined;
            this.alias = parsedTokens[4];
        } else {
            this.alias = token;
        }
    }

    /**
     * Check if token is element of collection
     * @return {boolean}
     * @public
     */
    isElementOfCollection() {
        return this.index !== undefined || this.innerText !== undefined
    }

    /**
     * Check if token is of
     * @return {boolean}
     * @public
     */
    hasTokenOf() {
        return this.index !== undefined
    }

    /**
     * Check if token is in
     * @return {boolean}
     * @public
     */
    hasTokenIn(){
        return this.innerText !== undefined
    }

    isExactMatch() {
        return this.modifier === "@"
    }

    isPartialMatch() {
        return this.modifier === "#"
    }

    isRegexp() {
        return this.modifier === "/"
    }

}

module.exports = ParsedToken;
