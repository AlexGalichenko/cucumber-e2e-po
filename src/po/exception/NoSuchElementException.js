class NoSuchElementException extends Error {

    /**
     * https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance
     * @private
     * @param {string} s1 - string 1
     * @param {string} s2 - string 2
     * @param {object} [costs] operation weight { [replace], [replaceCase], [insert], [remove] }
     * @return {number} Levenshtein distance
     */
    static levenshtein(s1, s2, costs) {
        let i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
        l1 = s1.length;
        l2 = s2.length;

        costs = costs || {};
        const cr = costs.replace || 1;
        const cri = costs.replaceCase || costs.replace || 1;
        const ci = costs.insert || 1;
        const cd = costs.remove || 1;

        cutHalf = flip = Math.max(l1, l2);

        const minCost = Math.min(cd, ci, cr);
        const minD = Math.max(minCost, (l1 - l2) * cd);
        const minI = Math.max(minCost, (l2 - l1) * ci);
        const buf = new Array((cutHalf * 2) - 1);

        for (i = 0; i <= l2; ++i) {
            buf[i] = i * minD;
        }

        for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
            ch = s1[i];
            chl = ch.toLowerCase();

            buf[flip] = (i + 1) * minI;

            ii = flip;
            ii2 = cutHalf - flip;

            for (j = 0; j < l2; ++j, ++ii, ++ii2) {
                cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
                buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
            }
        }
        return buf[l2 + cutHalf - flip];
    }

    /**
     * @private
     */
    static levenshteinComparator(comparable) {
        return function(a, b) {
            return NoSuchElementException.levenshtein(comparable, a) - NoSuchElementException.levenshtein(comparable, b)
        }
    }


    constructor(alias, currentComponent) {
        const comparator = NoSuchElementException.levenshteinComparator(alias);
        const message = `There is no such element: '${alias}'\nDid you mean:\n`
            + Array.from(currentComponent.elements.keys()).sort(comparator).slice(0, 3).join("\n");
        super(message);
    }

}

module.exports = NoSuchElementException;
