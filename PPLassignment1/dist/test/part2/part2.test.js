"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const part2_1 = require("../../src/part2/part2");
describe("Assignment 1 Part 2", () => {
    describe("countVowels", () => {
        it("counts letters", () => {
            expect((0, part2_1.countVowels)("aaabbbb")).toEqual({ "a": 3, "b": 4 });
        });
        it("counts letters", () => {
            expect((0, part2_1.countVowels)("AaaBbbb")).toEqual({ "a": 3, "b": 4 });
        });
        it("counts letters", () => {
            expect((0, part2_1.countVowels)("ABbbaab")).toEqual({ "a": 3, "b": 4 });
        });
        it("counts letters", () => {
            expect((0, part2_1.countVowels)("I am robot")).toEqual({ "i": 1, "a": 1, "m": 1, "r": 1, "o": 2, "b": 1, "t": 1 });
        });
        it("counts letters", () => {
            expect((0, part2_1.countVowels)("abcABCaabbcc d")).toEqual({ "a": 4, "b": 4, "c": 4, "d": 1 });
        });
    });
    describe("isPaired", () => {
        it("returns true for a string with paired parens", () => {
            expect((0, part2_1.isPaired)("([{}])")).toBe(true);
        });
        it("returns true for a string with paired parens", () => {
            expect((0, part2_1.isPaired)("This is ([some]) {text}.")).toBe(true);
        });
        it("returns true for a string with paired parens", () => {
            expect((0, part2_1.isPaired)("No parens, no problems.")).toBe(true);
        });
        it("returns true for a string with paired parens", () => {
            expect((0, part2_1.isPaired)("[](){}")).toBe(true);
        });
        it("returns false when the parens are not paired", () => {
            expect((0, part2_1.isPaired)("(]")).toBe(false);
            expect((0, part2_1.isPaired)("This is ]some[ }text{")).toBe(false);
            expect((0, part2_1.isPaired)("(")).toBe(false);
            expect((0, part2_1.isPaired)(")(")).toBe(false);
            expect((0, part2_1.isPaired)("())")).toBe(false);
        });
    });
    describe("treeToSentence", () => {
        it("Represents a tree as a sentence", () => {
            const t1 = { root: "hello", children: [{ root: "world", children: [] }] };
            expect((0, part2_1.treeToSentence)(t1)).toBe("hello world");
        });
        it("Represents a tree as a sentence", () => {
            const t2 = { root: "hello", children: [{ root: "there", children: [] }, { root: "!", children: [] }] };
            expect((0, part2_1.treeToSentence)(t2)).toBe("hello there !");
        });
        it("Represents a tree as a sentence", () => {
            const t3 = { root: "hello", children: [{ root: "there", children: [{ root: "!", children: [] }] }] };
            expect((0, part2_1.treeToSentence)(t3)).toBe("hello there !");
        });
        it("Represents a tree as a sentence", () => {
            const t4 = { root: "hello", children: [] };
            expect((0, part2_1.treeToSentence)(t4)).toBe("hello");
        });
        it("Represents a tree as a sentence", () => {
            const t5 = { root: "", children: [] };
            expect((0, part2_1.treeToSentence)(t5)).toBe("");
        });
    });
});
//# sourceMappingURL=part2.test.js.map