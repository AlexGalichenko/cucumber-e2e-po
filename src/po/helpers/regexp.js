module.exports = {
    TOKEN_SPLIT_REGEXP: /(?<=[^#])\s*>\s*/,
    // ELEMENT_OF_COLLECTION_REGEXP: /(all)?\s?([#@/])?(.+)?\s*(in|of)?\s*(.+)$/,
    ELEMENT_OF_COLLECTION_REGEXP: /(((?<modifier>all)?\s?(?<prefix>[#@/])(?<value>.+?))\/?\s+(?<type>in|of)\s+)?(?<elementName>.+)/,
    PARTIAL_ARRAY_REGEXP: /^\d+-\d+$/,
    PARTIAL_MORE_LESS_REGEXP: /^[><]\d+$/
};
