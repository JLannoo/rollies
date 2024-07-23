import { describe, expect, test } from "vitest";
import { Die, Evaluator, ExplodedDie } from "@/parser/evaluator";
import { TOKENS } from "@/parser/token";

describe("Evaluator", () => {
	test("Roll Operator (d)", () => {
		let input = [ 
			{
				type: "BinaryExpression",
				operator: TOKENS.ROLL,
				left: {
					type: "NumberLiteral",
					value: 1,
				},
				right: {
					type: "NumberLiteral",
					value: 20,
				},
			}, 
		];
	
		let result = new Evaluator(input).evaluate();

		expect(result?.dice).toHaveLength(1);
		expect(result?.sum).toBeGreaterThanOrEqual(1);
		expect(result?.sum).toBeLessThanOrEqual(20);
		expect(result?.discarded).toBeUndefined();
		
		input = [
			{
				type: "BinaryExpression",
				operator: TOKENS.ROLL,
				left: {
					type: "BinaryExpression",
					// @ts-expect-error - Testing invalid input
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 1,
					},
					right: {
						type: "NumberLiteral",
						value: 20,
					},
				},
				right: {
					type: "NumberLiteral",
					value: 10,
				},
			},
		];
		result = new Evaluator(input).evaluate();

		expect(result?.dice.length).toBeGreaterThanOrEqual(1);
		expect(result?.dice.length).toBeLessThanOrEqual(20);
		expect(result?.sum).toBeGreaterThanOrEqual(1);
		expect(result?.sum).toBeLessThanOrEqual(200);
		expect(result?.discarded).toBeUndefined();
	});
	
	test("Explode and Keep Operator (K)", () => {
		const input = [
			{
				type: "BinaryExpression",
				operator: TOKENS.EXPLODE_AND_KEEP,
				left: {
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 4,
					},
					right: {
						type: "NumberLiteral",
						value: 20,
					},
				},
				right: {
					type: "NumberLiteral",
					value: 2,
				},
			},
		];

		const result = new Evaluator(input).evaluate();
		if(!result) throw new Error("Result is undefined");

		expect(result.dice.length).toBe(2);
		expect(result.sum).toBeGreaterThanOrEqual(2);
		
		for(const die of result.dice)
			if("exploded" in die) {
				expect(die.exploded).toBeTypeOf("boolean");
				
				if(die.exploded) {
					expect(die.roll).toBeGreaterThan(20);
					expect(die.dice.length).toBeGreaterThanOrEqual(1);
				} else {
					expect(die.roll).toBeLessThanOrEqual(20);
				}
			} 
	});
	
	test("Keep Operators (k, kh, kl)", () => {
		let input = [
			{
				type: "BinaryExpression",
				operator: TOKENS.KEEP,
				left: {
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 3,
					},
					right: {
						type: "NumberLiteral",
						value: 20,
					},
				},
				right: {
					type: "NumberLiteral",
					value: 2,
				},
			},
		];

		let result = new Evaluator(input).evaluate();
		if(!result) throw new Error("Result is undefined");

		expect(result.dice.length).toBe(2);
		expect(result.sum).toBeGreaterThanOrEqual(2);
		expect(result.sum).toBeLessThanOrEqual(40);
		expect(result.discarded).toHaveLength(1);

		input = [
			{
				type: "BinaryExpression",
				// @ts-expect-error - Changing operator
				operator: TOKENS.KEEP_HIGHEST,
				left: {
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 6,
					},
					right: {
						type: "NumberLiteral",
						value: 6,
					},
				},
				right: {
					type: "NumberLiteral",
					value: 4,
				},
			},
		];

		result = new Evaluator(input).evaluate();
		if(!result) throw new Error("Result is undefined");

		expect(result.dice.length).toBe(4);
		expect(result.sum).toBeGreaterThanOrEqual(4);
		expect(result.sum).toBeLessThanOrEqual(24);
		expect(result.discarded).toHaveLength(2);
	});

	test("Sort Operators (s, sl)", () => {
		let input = [
			{
				type: "UnaryExpression",
				operator: TOKENS.SORT,
				operand: {
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 5,
					},
					right: {
						type: "NumberLiteral",
						value: 20,
					},
				},
			},
		];

		let result = new Evaluator(input).evaluate();
		if(!result) throw new Error("Result is undefined");

		expect(result.dice).toHaveLength(5);
		expect(result.sum).toBeGreaterThanOrEqual(5);
		expect(result.sum).toBeLessThanOrEqual(100);
		for(let i = 0; i < result.dice.length - 1; i++) {
			expect(result.dice[i].roll).toBeLessThanOrEqual(result.dice[i + 1].roll);
		}

		input = [
			{
				type: "UnaryExpression",
				// @ts-expect-error - Changing operator
				operator: TOKENS.SORT_ASC,
				operand: {
					type: "BinaryExpression",
					operator: TOKENS.ROLL,
					left: {
						type: "NumberLiteral",
						value: 5,
					},
					right: {
						type: "NumberLiteral",
						value: 20,
					},
				},
			},
		];

		result = new Evaluator(input).evaluate();
		if(!result) throw new Error("Result is undefined");

		expect(result.dice).toHaveLength(5);
		expect(result.sum).toBeGreaterThanOrEqual(5);
		expect(result.sum).toBeLessThanOrEqual(100);
		for(let i = 0; i < result.dice.length - 1; i++) {
			expect(result.dice[i].roll).toBeGreaterThanOrEqual(result.dice[i + 1].roll);
		}
	});
});