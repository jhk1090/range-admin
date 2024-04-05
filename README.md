# Range Admin - Effectively Managing Range
![license](https://img.shields.io/github/license/jhk1090/range-admin
) 
![npm-version](https://img.shields.io/npm/v/range-admin)
![GitHub last commit](https://img.shields.io/github/last-commit/jhk1090/range-admin)

```js
import { Range } from "range-admin"

(new Range(1, 10)).isEqual(new Range(1, 10)) // true
(new Range(1, 10)).compare(new Range(5, 13)) // "OVERLAP"
(new Range(1, 10)).findCommon(new Range(5, 10)) // new Range(5, 10)
```

```sh
# npm
npm install range-admin

# yarn
yarn add range-admin
```
 * Github Repository: https://github.com/jhk1090/range-admin
 * NPM Library: https://npmjs.com/package/range-admin
---
 * [Feature](#feature)
    * [Range](#range)
    * [isEqual](#isequalranges-range)
    * [isDisjoint](#isdisjointranges-range)
    * [isSubset](#issubsetranges-range)
    * [isSuperset](#issupersetranges-range)
    * [makeRangeArray](#makerangearrayrange-range--number-number-step-number)
 * [Contribution](#contribution)

# Feature
## Range
```js
new Range(1, 10)
```
 * ```toString()``` - Returns string representation of the range: (start, end)
 * [```toArray(step: number)```](#toarraystep-number) - Returns array based on the range
 * ```isEqual(otherRange: Range)``` - Check if two ranges are equal
 * ```isDisjoint(otherRange: Range)``` - Check if two ranges are disjoint (no relationship)
 * ```isSubsetOf(otherRange: Range)``` - Check if range is subset of otherRange (range is contained in otherRange)
 * ```isOverlap(otherRange: Range)``` - Check if two ranges are overlapped with each other
 * ```isAdjacent(otherRange: Range)``` - Check if two ranges are adjacent
 * [```compare(otherRange: Range)```](#compareotherrange-range) - Compare relationship with other range.
 * [```findCommon(otherRange: Range)```](#findcommonotherrange-range) - Find common part of the range with other range.
### toArray(step: number)
```js
(new Range(1, 11)).toArray() // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
(new Range(0, 1001)).toArray(2) // [0, 2, 4, 6, ..., 998, 1000]
```

### compare(otherRange: Range)
```js
(new Range(3, 5)).compare(new Range(1, 4)) // "OVERLAP"
(new Range(3, 5)).compare(new Range(1, 5)) // "SUBSET"
```

The types of relationship are as follows: "equal", "subset", "superset", "disjoint", "overlap"

### findCommon(otherRange: Range)
```js
(new Range(3, 5)).compare(new Range(1, 4)) // new Range(3, 4)
(new Range(3, 5)).compare(new Range(9, 10)) // null
```

## isEqual(...ranges: Range[])
```js
const range1 = new Range(1, 3)
const range2 = new Range(2, 5)

isEqual(range1, range1, range1) // true
isEqual(range2, range1, range1) // false
```
Check if all the ranges are equal.

## isDisjoint(...ranges: Range[])
```js
const range1 = new Range(1, 3)
const range2 = new Range(3, 5)

isDisjoint(range1, range2, new Range(9, 10)) // true
isDisjoint(range1, range1, new Range(9, 10)) // false
```
Check if all the ranges are disjoint.

## isSubset(...ranges: Range[])
```js
isSubset(new Range(1, 3), new Range(1, 8)) // false (2nd range is superset of 1st range)
isSubset(new Range(1, 100), new Range(1, 10), new Range(1, 2)) // true
```
Check if the range is subset of its preceding range. (e.g. 2nd range should be subset of the 1st range)\
Opposite with [```isSuperset```](#issupersetranges-range).

## isSuperset(...ranges: Range[])
```js
isSuperset(new Range(1, 3), new Range(1, 8)) // false (2nd range is superset of 1st range)
isSuperset(new Range(1, 100), new Range(1, 10), new Range(1, 2)) // true
```
Check if the range is superset of its following range. (e.g. 2nd range should be superset of the 1st range)\
Opposite with [```isSubset```](#issubsetranges-range).

## makeRangeArray(range: Range | [number, number], step?: number)
```js
makeRangeArray([0, 11], 2) // [0, 2, 4, 6, 8, 10]
makeRangeArray(new Range(0, 11), 2) // [0, 2, 4, 6, 8, 10]
// equivalent of new Range(0, 11).toArray(2)
```

Make array of range.

# Contribution
```sh
# build
npm run build

# build (using nodemon)
npm run dev

# test (using jest)
npm test
```