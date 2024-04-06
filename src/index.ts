type RangeRelationshipType = "EQUAL" | "DISJOINT" | "SUBSET" | "SUPERSET" | "OVERLAP";

export class Range {
    /**
     * Set a line of range
     * @param start start of range
     * @param end end of range (should be greater than start)
     */
    constructor(public start: number, public end: number) {
        if (start >= end) {
            throw new RangeError("start should be smaller than end");
        }
    }

    /**
     * Returns string representation of the range: start~end
     */
    toString() {
        return `${this.start}~${this.end}`
    }

    /**
     * Returns array based on the range
     * @param step step of range
     */
    toArray(step: number = 1) {
        return makeRangeArray(this, step)
    }

    /**
     * Check if two ranges are equal
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).isEqual(new Range(3, 5)) // true
     */
    isEqual(otherRange: Range) {
        return _isEqual(this, otherRange);
    }

    /**
     * Check if two ranges are disjoint (no relationship)
     * @param otherRange range to compare with
     * @alias isNone
     * @example
     * (new Range(3, 5)).isDisjoint(new Range(1, 2)) // true
     */
    isDisjoint(otherRange: Range) {
        return _isDisjoint(this, otherRange)
    }

    /**
     * Alias for {@link Range.isDisjoint|isDisjoint}
     */
    isNone(otherRange: Range) {
        return this.isDisjoint(otherRange)
    }

    /**
     * Check if range is subset of otherRange (range is contained in otherRange)
     * @param otherRange range to compare with
     * @alias isContainedIn
     * @example
     * (new Range(3, 5)).isSubsetOf(new Range(1, 5)) // true
     */
    isSubsetOf(otherRange: Range) {
        return _isSubsetOf(this, otherRange)
    }

    /**
     * Alias for {@link Range.isSubsetOf|isSubsetOf}
     */
    isContainedIn(otherRange: Range) {
        return this.isSubsetOf(otherRange)    
    }

    /**
     * Check if two ranges are overlapped with each other
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).isOverlap(new Range(1, 4)) // true
     */
    isOverlap(otherRange: Range) {
        return _isOverlap(this, otherRange)
    }

    /**
     * Check if two ranges are adjacent
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).isAdjacent(new Range(5, 6)) // true
     */
    isAdjacent(otherRange: Range) {
        return _isAdjacent(this, otherRange)
    }

    /**
     * Compare relationship with other range. The types of relationship are as follows: "equal", "subset", "superset", "disjoint", "overlap"
     * @returns relationship of two range.
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).compare(new Range(1, 5)) // "SUBSET"
     */
    compare(otherRange: Range): RangeRelationshipType {
        if (this.isEqual(otherRange)) {
            return "EQUAL"
        }

        if (this.isDisjoint(otherRange)) {
            return "DISJOINT"
        }

        if (this.isSubsetOf(otherRange)) {
            return "SUBSET"
        }

        if (otherRange.isSubsetOf(this)) {
            return "SUPERSET"
        }

        if (this.isOverlap(otherRange)) {
            return "OVERLAP"
        }

        // in case of fallthrough
        return "DISJOINT"
    }

    /**
     * Find common part of the range with other range.
     * @returns Common part of range, or null
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).compare(new Range(1, 4)) // new Range(3, 4)
     */
    findCommon(otherRange: Range): Range | null {
        if (this.isEqual(otherRange)) {
            return this;
        }

        if (this.isDisjoint(otherRange)) {
            return null;
        }

        if (this.isSubsetOf(otherRange)) {
            return this;
        }

        if (otherRange.isSubsetOf(this)) {
            return otherRange;
        }

        if (this.isOverlap(otherRange)) {
            const commonStart = Math.max(this.start, otherRange.start);
            const commonEnd = Math.min(this.end, otherRange.end);
            const commonRange = new Range(commonStart, commonEnd);
            return commonRange;
        }

        // in case of fallthrough
        return null;
    }
}

class RangeError extends Error {
    constructor(reason?: any) {
        super(reason)
    }
}

const _isEqual = (a: Range, b: Range) => a.start === b.start && a.end === b.end
const _isDisjoint = (a: Range, b: Range) => a.start > b.end || a.end < b.start
const _isSubsetOf = (a: Range, b: Range) => a.start >= b.start && a.end <= b.end
const _isOverlap = (a: Range, b: Range) => a.start < b.end && a.end > b.start
const _isAdjacent = (a: Range, b: Range) => a.end === b.start || a.start === b.end;

/**
 * Check if all the ranges are equal.
 * @param ranges ranges to be compared
 * @example
 * isEqual(new Range(3, 5), new Range(3, 5))
 */
export function isEqual(...ranges: Range[]) {
    for (let index = 1; index < ranges.length; index++) {
        if (!_isEqual(ranges[index - 1], ranges[index])) {
            return false;
        }
    }
    return true;
}

/**
 * Check if all the ranges are disjoint.
 * @param ranges ranges to be compared
 * @example
 * isDisjoint(new Range(3, 5)), new Range(7, 9)) // true
 */
export function isDisjoint(...ranges: Range[]) {
    let targetRanges: Range[] = [ranges[0]]
    for (let index = 1; index < ranges.length; index++) {
        for (const targetRange of targetRanges) {
            if (!_isDisjoint(targetRange, ranges[index])) {
                return false;
            }
        }
        targetRanges.push(ranges[index])
    }
    return true;
}

/**
 * Check if the range is subset of its preceding range
 * @param ranges ranges to be compared
 * @example
 * isSubset(new Range(1, 3), new Range(1, 8)) // false (2nd range is superset of 1st range)
 * isSubset(new Range(1, 100), new Range(1, 10), new Range(1, 2)) // true
 */
export function isSubset(...ranges: Range[]) {
    for (let index = 1; index < ranges.length; index++) {
        if (!ranges[index].isSubsetOf(ranges[index - 1])) {
            return false;
        }
    }
    return true;
}

/**
 * Check if the range is superset of its following range
 * @param ranges ranges to be compared
 * @example
 * isSuperset(new Range(1, 8), new Range(1, 3)) // false (2nd range is subset of 1st range)
 * isSuperset(new Range(1, 2), new Range(1, 10), new Range(1, 100)) // true
 */
export function isSuperset(...ranges: Range[]) {
    for (let index = 1; index < ranges.length; index++) {
        if (!ranges[index - 1].isSubsetOf(ranges[index])) {
            return false;
        }
    }
    return true;
}

/**
 * Check if all the ranges are adjacent with each other
 * @param ranges ranges to be compared
 * @example
 * isAdjacent(new Range(1, 2), new Range(2, 3), new Range(3, 10)) // true
 * isAdjacent(new Range(1, 2), new Range(4, 5), new Range(5, 6)) // false
 */
export function isAdjacent(...ranges: Range[]) {
    for (let index = 1; index < ranges.length; index++) {
        if (!ranges[index - 1].isAdjacent(ranges[index])) {
            return false;
        }
    }
    return true;
}   

/**
 * Make array of range
 * @param range start and end of range
 * @param step step of range (default=1)
 * @example
 * makeRangeArray([0, 11], 2) // [0, 2, 4, 6, 8, 10]
 * makeRangeArray(new Range(0, 11), 2) // [0, 2, 4, 6, 8, 10]
 * // equivalent of new Range(0, 11).toArray(2)
 */
export function makeRangeArray(range: Range | [number, number], step: number = 1): number[] {
    if (!(range instanceof Range)) {
        range = new Range(range[0], range[1])
    }

    let t = [];
    
    for (let x = range.start; (range.end - x) * step > 0; x += step) {
        t.push(x);
    }

    return t;
}