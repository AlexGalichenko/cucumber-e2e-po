module.exports = {
    TOKEN_SPLIT_REGEXP: /(?<=[^#])\s*>\s*/,
    ELEMENT_OF_COLLECTION_REGEXP: /([#@/])([!\$]?.+)\s+(in|of)\s+(.+)/,
    PARTIAL_ARRAY_REGEXP: /^\d+-\d+$/,
    PARTIAL_MORE_LESS_REGEXP: /^[><]\d+$/
};
