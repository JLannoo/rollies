import { BinaryExpression, Expression, NumberLiteral, Program, UnaryExpression } from "./parser";
import { Operator } from "./token";

class EvaluatingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EvaluatingError";
	}
}

export type Die = {
	sides: number;
	roll: number;
}

export interface Result {
	type: string;
	sum: number;
	dice?: Die[];
}

export interface RollResult extends Result {
	type: "RollResult";
	sum: number;
	dice: Die[];
}

export interface ArithmeticResult extends Result {
	type: "ArithmeticResult";
	sum: number;
}

export class Evaluator {
	position = 0;

	program: Program;
	errors: string[] = [];

	constructor(program: Program) {
		this.program = program;
	}

	evaluate() {
		let results: Result | null = null;

		while(this.position < this.program.length) {
			const node = this.program[this.position];
			results = this.evaluateNode(node);

			this.position++;
		}
		
		return results;
	}

	private evaluateNode(node: Expression): Result {
		switch (node.type) {
		case "UnaryExpression":
			return this.evaluateUnaryExpression(node as UnaryExpression);
		case "BinaryExpression":
			return this.evaluateBinaryExpression(node as BinaryExpression);
		case "NumberLiteral":
			return this.evaluateNumberExpression(node as NumberLiteral);
		default:
			throw new Error(`Unknown node type: ${node.type}`);
		}
	}

	private evaluateUnaryExpression(node: UnaryExpression): Result {
		if(!node.operand) {
			throw new EvaluatingError(`Invalid unary expression: ${node?.toString()}`);
		}

		const operand = this.evaluateNode(node.operand);

		switch (node.operator) {
		case "s":
		case "sl":
			return this.evaluateSort(operand, node.operator);
		default:
			throw new Error(`Unknown operator: ${node.operator}`);
		}
	}

	private evaluateBinaryExpression(node: BinaryExpression): Result {
		if(!node.left || !node.right) {
			throw new EvaluatingError(`Invalid binary expression: ${node?.toString()}`);
		}
		
		const left = this.evaluateNode(node.left);
		const right = this.evaluateNode(node.right);

		switch (node.operator) {
		case "+":
		case "-":
			return this.evaluateArithmetic(node);
		case "d":
			return this.evaluateRoll(right.sum as number, left.sum as number);
		case "k":
		case "kh":
		case "kl":
			return this.evaluateKeep(left.dice as Die[], right.sum as number, node.operator);
		case "K":
			throw new Error("'K' operator not implemented");
		default:
			throw new Error(`Unknown operator: ${node.operator}`);
		}
	}

	private evaluateSort(operand: Result, operator: Operator): Result {
		if(!operand.dice?.length) {
			throw new EvaluatingError(`Operand of ${operator} operator must be a roll result`);
		}

		let sorted;
		switch (operator) {
		case "s":
			sorted = operand.dice.sort((a, b) => a.roll - b.roll);
			break;
		case "sl":
			sorted = operand.dice.sort((a, b) => b.roll - a.roll);
			break;
		default:
			throw new Error(`Unknown operator: ${operator}`);
		}

		return {
			type: "RollResult",
			sum: sorted.reduce((acc, die) => acc + die.roll, 0),
			dice: sorted,
		};
	}

	private evaluateNumberExpression(node: NumberLiteral): Result {
		return { 
			type: "NumberLiteral",
			sum: node.value,
		};
	}

	private evaluateRoll(sides: number, count: number): RollResult {
		const dice: Die[] = [];

		if(sides <= 1) {
			throw new EvaluatingError(`Invalid dice sides: ${sides}`);
		}

		if(count <= 0) {
			throw new EvaluatingError(`Invalid dice count: ${count}`);
		}

		for (let i = 0; i < count; i++) {
			dice.push({
				sides,
				roll: Math.floor(Math.random() * sides) + 1,
			});
		}

		return { 
			type: "RollResult",
			sum: dice.reduce((acc, die) => acc + die.roll, 0),
			dice, 
		};
	}

	private evaluateKeep(dice: Die[], count: number, operator: Operator): RollResult {
		if(!dice?.length) {
			throw new EvaluatingError(`Left side of ${operator} operator must be a roll result`);
		}

		if (count > dice.length) {
			throw new EvaluatingError(`Cannot keep ${count} highest dice from ${dice.length} dice`);
		}

		let sorted;

		switch (operator) {
		case "k":
		case "kh":
			sorted = dice.sort((a, b) => b.roll - a.roll);
			break;
		case "kl":
			sorted = dice.sort((a, b) => a.roll - b.roll);
			break;
		default:
			throw new Error(`Unknown operator: ${operator}`);
		}
		
		const kept = sorted.slice(0, count);

		return {
			type: "RollResult",
			sum: kept.reduce((acc, die) => acc + die.roll, 0),
			dice: kept,
		};
	}

	private evaluateArithmetic(node: BinaryExpression): ArithmeticResult {
		const left = this.evaluateNode(node.left);
		const right = this.evaluateNode(node.right);

		const dice = [
			...("dice" in left  ? (left as RollResult).dice : []),
			...("dice" in right ? (right as RollResult).dice : []),
		];

		let value = 0;
		switch (node.operator) {
		case "+":
			value = (left.sum as number) + (right.sum as number);
			break;
		case "-":
			value = (left.sum as number) - (right.sum as number);
			break;
		default:
			throw new Error(`Unknown operator: ${node.operator}`);
		}

		return {
			type: "ArithmeticResult",
			sum: value,
			dice,
		} ;
	}
}