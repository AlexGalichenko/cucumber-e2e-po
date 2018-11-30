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
        const ELEMENT_OF_COLLECTION_REGEXP = /#([!\$]?.+)\s+(in|of)\s+(.+)/;
        if (ELEMENT_OF_COLLECTION_REGEXP.test(token)) {
            const parsedTokens = token.match(ELEMENT_OF_COLLECTION_REGEXP);
            const value = parsedTokens[1];

            this.index = parsedTokens[2] === "of" ? Number.parseInt(value) : undefined;
            this.innerText = parsedTokens[2] === "in" ? value : undefined;
            this.alias = parsedTokens[3];
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

}

module.exports = ParsedToken;