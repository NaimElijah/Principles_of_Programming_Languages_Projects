import * as R from "ramda";

const stringToArray = R.split("");


/* Question 1 */
const vowels: string[] = ['a','e','i','o','u'];
export const countVowels: (input:string) => number = input => stringToArray(input.toLowerCase()).filter(x => vowels.find((y) => x === y)!==undefined).length;





/* Question 2 */

const onlyAllParenthesis: (input: string) => string[] = (input) => stringToArray(input).
filter(x => (x === '(' || x === ')' || x === '[' || x === ']' || x === '{' || x === '}'));  // keeps only all of the parenthesis in the array.

const StrAsStackHelper: (AllparenthesesString: string[]) => (boolean) = (parenthesisArr) => ( (
    parenthesisArr.reduce((acc,curr) => (
        (curr === '(' || curr === '[' || curr === '{') ? (acc.concat(curr)) : 
        (curr === ')' && acc !== '') ? (acc.charAt(acc.length-1) === '(') ? acc.slice(0,-1) : acc : 
        (curr === ']' && acc !== '') ? (acc.charAt(acc.length-1) === '[') ? acc.slice(0,-1) : acc :
        (curr === '}' && acc !== '') ? (acc.charAt(acc.length-1) === '{') ? acc.slice(0,-1) : acc : acc.concat(curr)
    ) , '')
) === '');

export const isPaired: (x: string) => (boolean) = (x) => (StrAsStackHelper(onlyAllParenthesis(x)));


/* Question 3 */
export type WordTree = {
    root: string;
    children: WordTree[];
}

export const treeToSentence : (tree : WordTree) => string = (tree) => tree.children.length === 0?  tree.root :
 tree.root + tree.children.reduce((acc, currTree) => acc + ' ' + treeToSentence(currTree),'');
