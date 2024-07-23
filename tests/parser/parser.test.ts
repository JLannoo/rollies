import { describe, expect, test } from "vitest";

import { Parser } from "@/parser/parser";
import { Token, TOKENS } from "@/parser/token";

describe("Parser", () => {
	test("Roll Operator (d)", () => {
		let input: Token[] = [
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					toString: expect.any(Function),
					left: {
						type: "NumberLiteral",
						value: 1,
						toString: expect.any(Function),
					},
					right: {
						type: "NumberLiteral",
						value: 20,
						toString: expect.any(Function),
					},
				},
			]);

		input = [
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "d", value: "d" },
			{ position: 5, type: "NUMBER", value: "10" },
			{ position: 7, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					toString: expect.any(Function),
					left: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 1,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
					right: {
						type: "NumberLiteral",
						value: 10,
						toString: expect.any(Function),
					},
				},
			]);
	});

	test("Explode and Keep Operator (K)", () => {
		const input: Token[] = [
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "K", value: "K" },
			{ position: 5, type: "NUMBER", value: "10" },
			{ position: 7, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "BinaryExpression",
					operator: TOKENS.EXPLODE_AND_KEEP,
					toString: expect.any(Function),
					left: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 1,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
					right: {
						type: "NumberLiteral",
						value: 10,
						toString: expect.any(Function),
					},
				},
			]);
	});

	test("Keep Operators (k, kh, kl)", () => {
		let input = [
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "k", value: "k" },
			{ position: 5, type: "NUMBER", value: "10" },
			{ position: 7, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "BinaryExpression",
					operator: TOKENS.KEEP,
					toString: expect.any(Function),
					left: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 1,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
					right: {
						type: "NumberLiteral",
						value: 10,
						toString: expect.any(Function),
					},
				},
			]);

		input = [
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "kh", value: "kh" },
			{ position: 6, type: "NUMBER", value: "10" },
			{ position: 8, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "BinaryExpression",
					operator: TOKENS.KEEP_HIGHEST,
					toString: expect.any(Function),
					left: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 1,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
					right: {
						type: "NumberLiteral",
						value: 10,
						toString: expect.any(Function),
					},
				},
			]);

		input = [
			{ position: 0, type: "NUMBER", value: "1" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "kl", value: "kl" },
			{ position: 6, type: "NUMBER", value: "10" },
			{ position: 8, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "BinaryExpression",
					operator: TOKENS.KEEP_LOWEST,
					toString: expect.any(Function),
					left: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 1,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
					right: {
						type: "NumberLiteral",
						value: 10,
						toString: expect.any(Function),
					},
				},
			]);
	});

	test("Sort Operators (s, sl)", () => {
		let input: Token[] = [
			{ position: 0, type: "NUMBER", value: "5" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "s", value: "s" },
			{ position: 5, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "UnaryExpression",
					operator: TOKENS.SORT,
					toString: expect.any(Function),
					operand: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 5,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
				},
			]);

		input = [
			{ position: 0, type: "NUMBER", value: "5" },
			{ position: 1, type: "d", value: "d" },
			{ position: 2, type: "NUMBER", value: "20" },
			{ position: 4, type: "sl", value: "sl" },
			{ position: 6, type: "EOF", value: "" },
		];

		expect(new Parser(input).parse())
			.toEqual([
				{
					type: "UnaryExpression",
					operator: TOKENS.SORT_ASC,
					toString: expect.any(Function),
					operand: {
						type: "BinaryExpression",
						operator: TOKENS.ROLL,
						toString: expect.any(Function),
						left: {
							type: "NumberLiteral",
							value: 5,
							toString: expect.any(Function),
						},
						right: {
							type: "NumberLiteral",
							value: 20,
							toString: expect.any(Function),
						},
					},
				},
			]);
	});
});
