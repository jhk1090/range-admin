import { Range, isAdjacent, isDisjoint, isEqual, isSubset, isSuperset, makeRangeArray } from "./index"

describe("Test range class", () => {
    const targetRange: Range = new Range(3, 5)
    test("Check if two ranges are equal", () => {
        expect(targetRange.isEqual(new Range(3, 5))).toBe(true)
    })
    test("Check if two ranges are disjoint", () => {
        expect(targetRange.isDisjoint(new Range(1, 2))).toBe(true)
    })
    test("Check if range is subset of otherRange", () => {
        expect(targetRange.isSubsetOf(new Range(1, 5))).toBe(true)
    })
    test("Check if two ranges are overlapped with each other", () => {
        expect(targetRange.isOverlap(new Range(1, 4))).toBe(true)
    })
    test("Check if two ranges are adjacent", () => {
        expect(targetRange.isAdjacent(new Range(5, 6))).toBe(true)
    })
    test("Compare relationship with other range", () => {
        expect(targetRange.compare(new Range(3, 5))).toBe("EQUAL")
        expect(targetRange.compare(new Range(1, 5))).toBe("SUBSET")
        expect(targetRange.compare(new Range(1, 4))).toBe("OVERLAP")
        expect(targetRange.compare(new Range(1, 3))).toBe("DISJOINT")
        expect((new Range(1, 5)).compare(targetRange)).toBe("SUPERSET")
    })
    test("Find common part of the range with other range", () => {
        const target = targetRange.findCommon(new Range(1, 4)) // new Range(3, 4)
        if (target instanceof Range) {
            expect(target.toArray()).toEqual([3])
        } else {
            fail()
        }
    })
})

test("Check if all the (two or more) ranges are equal", () => {
    expect(isEqual(new Range(3, 5), new Range(3, 5))).toBe(true)
})

test("Check if all the (two or more) ranges are disjoint", () => {
    expect(isDisjoint(new Range(3, 5), new Range(7, 9))).toBe(true)
    expect(isDisjoint(new Range(3, 5), new Range(3, 5), new Range(7, 9))).toBe(false)
})

test("Check if the range is subset of its preceding range", () => {
    expect(isSubset(new Range(1, 3), new Range(1, 8))).toBe(false)
    expect(isSubset(new Range(1, 100), new Range(1, 10), new Range(1, 2))).toBe(true)
})

test("Check if the range is superset of its following range", () => {
    expect(isSuperset(new Range(1, 8), new Range(1, 3))).toBe(false)
    expect(isSuperset(new Range(1, 2), new Range(1, 10), new Range(1, 100))).toBe(true)
})

test("Check if all the (two or more) ranges are adjacent with each other", () => {
    expect(isAdjacent(new Range(1, 2), new Range(2, 3), new Range(3, 10))).toBe(true)
    expect(isAdjacent(new Range(1, 2), new Range(4, 5), new Range(5, 6))).toBe(false)
})

test("Make array of range", () => {
    expect(makeRangeArray([0, 11], 2)).toEqual([0, 2, 4, 6, 8, 10])
    expect(makeRangeArray(new Range(0, 11), 2)).toEqual([0, 2, 4, 6, 8, 10])
})