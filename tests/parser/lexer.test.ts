import { describe, expect, test } from "vitest";
import { Lexer } from "@/parser/lexer";

describe("Lexer", () => {
	test("Roll Operator (d)", () => {
		let input = "1d20";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "EOF", value: "" },
		]);

		input = "1d20d10";
		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "d", value: "d" },
			{ position: 5, type: "NUMBER", value: "10" },
			{ position: 7, type: "EOF", value: "" },
		]);
	});

	test("Explode and Keep Operator (K)", () => {
		const input = "1d20K10";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "K", value: "K" },
			{ position: 5, type: "NUMBER", value: "10" },
			{ position: 7, type: "EOF", value: "" },
		]);
	});

	test("Keep Operators (k, kh, kl)", () => {
		let input = "1d20k10";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "k", value: "k" },
			{ position: 5, type: "NUMBER", value: "10" },
			{ position: 7, type: "EOF", value: "" },
		]);

		input = "1d20kh10";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "kh", value: "kh" },
			{ position: 6, type: "NUMBER", value: "10" },
			{ position: 8, type: "EOF", value: "" },
		]);
	});

	test("Sort Operators (s, sl)", () => {
		let input = "5d20s";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "5" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "s", value: "s" },
			{ position: 5, type: "EOF", value: "" },
		]);

		input = "5d20sl";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "5" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "sl", value: "sl" },
			{ position: 6, type: "EOF", value: "" },
		]);
	});

	test("Arithmetic Operators", () => {
		const input = "5 + 10 - 2";

		expect(new Lexer(input).tokenize()).toEqual([
			{ position: 0, type: "NUMBER", value: "5" },
			{ position: 2, type: "+", value: "+" },
			{ position: 4, type: "NUMBER", value: "10" },
			{ position: 7, type: "-", value: "-" },
			{ position: 9, type: "NUMBER", value: "2" },
			{ position: 10, type: "EOF", value: "" },
		]);
	});

	test("tokenize with whitespaces", () => {
		const input = "1 d \t\t 20 \n +5 ; 1d10";
		const lexer = new Lexer(input);
		const tokens = lexer.tokenize();

		expect(tokens).toEqual([
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 2, type: "d", value: "d" },
			{ position: 7, type: "NUMBER", value: "20" },
			{ position: 12, type: "+", value: "+" },
			{ position: 13, type: "NUMBER", value: "5" },
			{ position: 15, type: ";", value: ";" },
			{ position: 17, type: "NUMBER", value: "1" },
			{ position: 18, type: "d", value: "d" },
			{ position: 19, type: "NUMBER", value: "10" },
			{ position: 21, type: "EOF", value: "" },
		]);
	});
});