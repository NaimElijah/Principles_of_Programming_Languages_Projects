"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeToSentence = exports.isPaired = exports.countVowels = void 0;
const R = require("ramda");
const stringToArray = R.split("");
/* Question 1 */
const vowels = ['a', 'e', 'i', 'o', 'u'];
const countVowels = input => stringToArray(input.toLowerCase()).filter(x => vowels.find((y) => x === y) !== undefined).length;
exports.countVowels = countVowels;
/* Question 2 */
const onlyAllParenthesis = (input) => stringToArray(input).
    filter(x => (x === '(' || x === ')' || x === '[' || x === ']' || x === '{' || x === '}')); // keeps only all of the parenthesis in the array.
const StrAsStackHelper = (parenthesisArr) => ((parenthesisArr.reduce((acc, curr) => ((curr === '(' || curr === '[' || curr === '{') ? (acc.concat(curr)) :
    (curr === ')' && acc !== '') ? (acc.charAt(acc.length - 1) === '(') ? acc.slice(0, -1) : acc :
        (curr === ']' && acc !== '') ? (acc.charAt(acc.length - 1) === '[') ? acc.slice(0, -1) : acc :
            (curr === '}' && acc !== '') ? (acc.charAt(acc.length - 1) === '{') ? acc.slice(0, -1) : acc : acc.concat(curr)), '')) === '');
const isPaired = (x) => (StrAsStackHelper(onlyAllParenthesis(x)));
exports.isPaired = isPaired;
console.log((0, exports.isPaired)("([{}])")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("This is ([some]) {text}.")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("No parens, no problems.")); //  <<<=====================  Testing     4 TRUE Cases.  DELETE TESTS LATER !!
console.log((0, exports.isPaired)("[](){}")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("(]")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("This is ]some[ }text{")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("(")); //  <<<=====================  Testing                           5 FALSE Cases.  DELETE TESTS LATER !!
console.log((0, exports.isPaired)(")(")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("())")); //  <<<=====================  Testing
console.log((0, exports.isPaired)("([)]")); //  <<<=====================  Testing   FALSE
console.log((0, exports.isPaired)("")); //  <<<=====================  Testing       TRUE     DELETE TESTS LATER !!
console.log((0, exports.isPaired)("([")); //  <<<=====================  Testing     FALSE
console.log((0, exports.isPaired)("([)]")); //  <<<=====================  Testing     FALSE
const treeToSentence = (tree) => tree.children.length === 0 ? tree.root :
    tree.root + tree.children.reduce((acc, currTree) => acc + ' ' + (0, exports.treeToSentence)(currTree), '');
exports.treeToSentence = treeToSentence;
//# sourceMappingURL=part2.js.map