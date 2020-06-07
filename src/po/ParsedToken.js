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
            const value = parsedTokens[3];

            this.allModifier = parsedTokens[1];
            this.modifier = parsedTokens[2];

            /** parse of clause*/
            if (parsedTokens[4] === "of") {
                const extraOfCondition = (
                    value !== "FIRST" &&
                    value !== "LAST" &&
                    !regexp.PARTIAL_ARRAY_REGEXP.test(value) &&
                    !regexp.PARTIAL_MORE_LESS_REGEXP.test(value)
                );
                if (extraOfCondition) {
                    this.index = Number.parseInt(value);
                } else {
                    this.index = value;
                }
            } /** parse in clause*/
            else if (parsedTokens[4] === "in") {
                if (this.modifier !== "/") {
                    this.innerText = value;
                } else {
                    this.innerText = value.replace(/\/$/, "");
                }
            }
            this.alias = parsedTokens[5];
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

    /**
     * Check if token is exact match
     * @return {boolean}
     */
    isExactMatch() {
        return this.modifier === "@"
    }

    /**
     * Check if token is partial match
     * @return {boolean}
     */
    isPartialMatch() {
        return this.modifier === "#"
    }

    /**
     * Check if token is regexp
     * @return {boolean}
     */
    isRegexp() {
        return this.modifier === "/"
    }

    /**
     * Check if token has all modifier
     * @return {boolean}
     */
    hasAllModifier() {
        return !!this.allModifier
    }

    /**
     * Check if current token is pseudo component this
     * @return {boolean}
     */
    isThis() {
        return this.alias === "this"
    }

    /**
     * Get tokens array from alias
     * @param alias
     */
    static getTokens(alias) {
        return alias.split(regexp.TOKEN_SPLIT_REGEXP);
    }

}

module.exports = ParsedToken;
