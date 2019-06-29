function getAllElementsByCssExactText(cssSelector, searchText, using) {
    using = using || document;

    var elements = using.querySelectorAll(cssSelector);
    var matches = [];
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var elementText = element.textContent || element.innerText || '';
        var elementMatches = elementText === searchText ;

        if (elementMatches) {
            matches.push(element);
        }
    }
    return matches;
}

module.exports = {
    getAllElementsByCssExactText
};
