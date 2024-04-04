# Range Admin - Effectively Managing Range
```js
import { Range } from "range-admin"

(new Range(1, 10)).isEqual(new Range(1, 10)) // true
(new Range(1, 10)).compare(new Range(5, 13)) // { relationship: "OVERLAP", common: new Range(5, 10) }
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
    * [isEqual](#isequalrange-range)
    * [isDisjoint](#isdisjointrange-range)
 * [Contribution](#contribution)

# Feature
## Range
```js
new Range(1, 10)
```
 * ```toString()``` - returns stringified range
 * [```toArray(step: number)```](#toarraystep-number) - returns array that is from start to end
 * ```isEqual(otherRange: Range)``` - check if two ranges are equal
 * ```isDisjoint(otherRange: Range)``` - check if two ranges are disjoint
 * ```isSubsetOf(otherRange: Range)``` - check if range is subset of otherRange
 * ```isOverlap(otherRange: Range)``` - check if two ranges are overlapped with each other
 * ```isAdjacent(otherRange: Range)``` - check if two ranges are adjacent
 * [```compare(otherRange: Range)```](#compareotherrange-range) - compare two ranges, return relationship and common part of range
### toArray(step: number)
```js
(new Range(1, 11)).toArray() // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
(new Range(0, 1001)).toArray(2) // [0, 2, 4, 6, ..., 998, 1000]
```

### compare(otherRange: Range)
```js
(new Range(3, 5)).compare(new Range(1, 4)) // { relationship: "SUBSET", common: new Range(3, 4) }
(new Range(3, 5)).compare(new Range(4, 9)) // { relationship: "OVERLAP", common: new Range(4, 5) }
```

## isEqual(...range: Range[])
```js
const range1 = new Range(1, 3)
const range2 = new Range(2, 5)

isEqual(range1, range1, range1) // true
isEqual(range2, range1, range1) // false
```
Check if all the ranges are equal.

## isDisjoint(...range: Range[])
```js
const range1 = new Range(1, 3)
const range2 = new Range(3, 5)

isDisjoint(range1, range2, new Range(9, 10)) // true
isDisjoint(range1, range1, new Range(9, 10)) // false
```
Check if all the ranges are disjoint.

# Contribution
```sh
# build
npm run build

# build (using nodemon)
npm run dev
```