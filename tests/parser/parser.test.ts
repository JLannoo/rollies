import { describe, expect, test } from "vitest";

import { Lexer } from "@/parser/lexer";
import { Parser } from "@/parser/parser";
import { TOKENS } from "@/parser/token";

describe("Parser", () => {
	test("parse", () => {
		const input = "1d10 + 10";
		const tokens = new Lexer(input).tokenize();
		const ast = new Parser(tokens).parse();

		expect(ast).toEqual([
			{
				type: "BinaryExpression",
				operator: TOKENS.PLUS,
				left: {
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 1,
					},
					right: {
						type: "NumberLiteral",
						value: 10,
					},
				},
				right: {
					type: "NumberLiteral",
					value: 10,
				},
			},
		]);
	});
});
