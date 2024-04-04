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

    toString() {
        return `Range(${this.start}, ${this.end})`
    }

    toArray(step: number = 1) {
        let t = [];
  
        for (let x = this.start; (this.end - x) * step > 0; x += step) {
            t.push(x);
        }
    
        return t;
    }

    /**
     * Check if two ranges are equal
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).isDisjoint(new Range(3, 5)) // true
     */
    isEqual(otherRange: Range) {
        return this.start === otherRange.start && this.end === otherRange.end;
    }

    /**
     * Check if two ranges are disjoint (no relationship)
     * @param otherRange range to compare with
     * @alias isNone
     * @example
     * (new Range(3, 5)).isDisjoint(new Range(1, 2)) // true
     */
    isDisjoint(otherRange: Range) {
        return this.start >= otherRange.end || this.end <= otherRange.start
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
        return this.start >= otherRange.start && this.end <= otherRange.end
    }

    /**
     * Alias for {@link Range.isContainedIn|isContainedIn}
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
        return this.start < otherRange.end && this.end > otherRange.start
    }

    /**
     * CHeck if two ranges are adjacent
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).isAdjacent(new Range(5, 6)) // true
     */
    isAdjacent(otherRange: Range) {
        return this.end === otherRange.start || this.start === otherRange.end;
    }

    /**
     * Compare with other range. The types of relationship are as follows: "equal", "subset", "superset", "disjoint", "overlap"
     * @returns relationship of two range and common part of them.
     * @param otherRange range to compare with
     * @example
     * (new Range(3, 5)).compare(new Range(1, 4)) // { relationship: "SUBSET", common: new Range(3, 4) }
     */
    compare(otherRange: Range): { relationship: RangeRelationshipType; common: Range | null } {
        if (this.isEqual(otherRange)) {
            return { relationship: "EQUAL", common: this };
        }

        if (this.isDisjoint(otherRange)) {
            return { relationship: "DISJOINT", common: null };
        }

        if (this.isSubsetOf(otherRange)) {
            return { relationship: "SUBSET", common: this };
        }

        if (otherRange.isSubsetOf(this)) {
            return { relationship: "SUPERSET", common: otherRange };
        }

        if (this.isOverlap(otherRange)) {
            const commonStart = Math.max(this.start, otherRange.start);
            const commonEnd = Math.min(this.end, otherRange.end);
            const commonRange = new Range(commonStart, commonEnd);
            return { relationship: "OVERLAP", common: commonRange };
        }

        // in case of fallthrough
        return { relationship: "DISJOINT", common: null };
    }
}

class RangeError extends Error {
    constructor(reason?: any) {
        super(reason)
    }
}

/**
 * Check if all the ranges are eqaul.
 * @param ranges ranges to be compared
 * @example
 * isEqual(new Range(3, 5), new Range(3, 5))
 */
export function isEqual(...ranges: Range[]) {
    const _isEqual = (a: Range, b: Range) => a.start === b.start && a.end === b.end
    let targetRange = ranges[0]
    for (let index = 1; index < ranges.length; index++) {
        if (_isEqual(targetRange, ranges[index])) {
            targetRange = ranges[index]
        } else {
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
    const _isDisjoint = (a: Range, b: Range) => a.start > b.end || a.end < b.start
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