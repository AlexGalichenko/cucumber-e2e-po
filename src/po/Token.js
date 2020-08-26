const TEXT_TYPE = 'in';
const INDEX_TYPE = 'of';
const HASH_PREFIX = '#';
const EXACT_PREFIX = '@';
const REGEXP_PREFIX = '/';

const ALLOWED_MODIFIERS = ['all'];
const ALLOWED_PREFIXES = [HASH_PREFIX, EXACT_PREFIX, REGEXP_PREFIX];
const ALLOWED_TYPES = [TEXT_TYPE, INDEX_TYPE];

class Token {
  /**
   * construct token object
   * @constructor
   * @param {string} param.modifier - all modifier
   * @param {string} param.prefix - prefix value
   * @param {string} param.value - filter value
   * @param {string} param.type - filter type
   * @param {string} param.elementName - element name
   */
  constructor({ modifier, prefix, value, type, elementName}) {
    this.modifier = this.validateModifier(modifier);
    this.prefix = this.validatePrefix(prefix);
    this.type = this.validateType(type);
    this.value = this.setValue(value, type, prefix);
    this.elementName = elementName;
  }

  validateModifier(modifier) {
    if (!modifier) return null;
    if (ALLOWED_MODIFIERS.includes(modifier)) return modifier;
    throw new Error(`Filter modifier '${modifier}' is not allowed`);
  }

  validatePrefix(prefix) {
    if (!prefix) return null;
    if (ALLOWED_PREFIXES.includes(prefix)) return prefix;
    throw new Error(`Filter prefix '${prefix}' is not allowed`);
  }

  validateType(type) {
    if (!type) return null;
    if (ALLOWED_TYPES.includes(type)) return type;
    throw new Error(`Filter type '${type}' is not allowed`);
  }

  setValue(value, type, prefix) {
    if (!value) return null;
    if (type === INDEX_TYPE) {
      switch (true) {
        case value === 'FIRST': return 1;
        case value === 'LAST': return 'LAST';
        case value.includes('>'): return {startIndex: parseInt(value.slice(1))};
        case value.includes('<'): return {endIndex: parseInt(value.slice(1))};
        case value.includes('-'): {
          const indexes = value.split('-');
          return {
            startIndex: parseInt(indexes[0]),
            endIndex: parseInt(indexes[1])
          }
        }
        default: return parseInt(value);
      }
    }
    if (type === TEXT_TYPE) {
      if (prefix === '/') return new RegExp(value, 'gmi');
      return value
    }
  }

  get isThis() {
    return this.elementName === 'this'
  }

  get byIndex() {
    return this.type === INDEX_TYPE 
  }

  get byText() {
    return this.type === TEXT_TYPE 
  }

  get hasAllModifier() {
    return this.modifier === 'all'
  }

  get byExactIndex() {
    return this.byIndex && /(\d+|FIRST|LAST)/.test(this.value)
  }

  get byRangeBetween() {
    return this.byIndex && this.value.startIndex !== undefined && this.value.endIndex !== undefined
  }

  get byRangeGreater() {
    return this.byIndex && this.value.startIndex !== undefined && this.value.endIndex === undefined
  }

  get byRangeLess() {
    return this.byIndex && this.value.startIndex === undefined && this.value.endIndex !== undefined 
  }

  get byPartialText() {
    return this.byText && this.prefix === HASH_PREFIX
  }

  get byExactText() {
    return this.byText && this.prefix === EXACT_PREFIX
  }

  get byRegExp() {
    return this.byText && this.prefix === REGEXP_PREFIX
  }

}

module.exports = Token;

