import { describe, expect, test } from "vitest";
import { Lexer } from "@/parser/lexer";

describe("Lexer", () => {
	test("tokenize", () => {
		const input = "1 d \t\t 20 \n +5 ; 1d10";
		const lexer = new Lexer(input);
		const tokens = lexer.tokenize();

		expect(tokens).toEqual([
			{ type: "NUMBER", value: "1" },
			{ type: "d", value: "d" },
			{ type: "NUMBER", value: "20" },
			{ type: "+", value: "+" },
			{ type: "NUMBER", value: "5" },
			{ type: ";", value: ";" },
			{ type: "NUMBER", value: "1" },
			{ type: "d", value: "d" },
			{ type: "NUMBER", value: "10" },
			{ type: "EOF", value: "" },
		]);
	});
});