import { BinaryExpression, Expression, NumberLiteral, Program, UnaryExpression } from "./parser";
import { Operator, TOKENS } from "./token";

class UnknownOperatorError extends Error {
	constructor(operator: Operator) {
		super(`Unknown operator: ${operator}`);
		this.name = "UnknownOperatorError";
	}
}

class EvaluatingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EvaluatingError";
	}
}

export type Die = {
	sides: number;
	roll: number;
	discarded?: boolean;
}

export type ExplodedDie = Die & {
	exploded: boolean;
	dice: Die[];
}

export interface RollResult {
	type: string;
	sum: number;
	dice: Die[] | ExplodedDie[];
	discarded?: Die[] | ExplodedDie[];
}

export interface NumberLiteralResult extends RollResult {
	type: "NumberLiteralResult";
}

export interface ArithmeticResult extends RollResult {
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
		let results: RollResult | null = null;

		while(this.position < this.program.length) {
			const node = this.program[this.position];
			results = this.evaluateNode(node);

			this.position++;
		}
		
		return results;
	}

	private evaluateNode(node: Expression): RollResult {
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

	private evaluateUnaryExpression(node: UnaryExpression): RollResult {
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

	private evaluateBinaryExpression(node: BinaryExpression): RollResult {
		if(!node.left || !node.right) {
			throw new EvaluatingError(`Invalid binary expression: ${node?.toString()}`);
		}
		
		const left = this.evaluateNode(node.left);
		const right = this.evaluateNode(node.right);

		switch (node.operator) {
		case TOKENS.PLUS:
		case TOKENS.MINUS:
			return this.evaluateArithmetic(node);
		case TOKENS.ROLL:
			return this.evaluateRoll(right.sum as number, left.sum as number);
		case TOKENS.KEEP:
		case TOKENS.KEEP_HIGHEST:
		case TOKENS.KEEP_LOWEST:
			return this.evaluateKeep(left.dice as Die[], right.sum as number, node.operator);
		case TOKENS.EXPLODE_AND_KEEP:
			return this.evaluateExplodeAndKeep(left.dice as Die[], right.sum as number);
		case TOKENS.EXPLODE:
			throw new Error(`${TOKENS.EXPLODE} operator not implemented`);
		default:
			throw new UnknownOperatorError(node.operator);
		}
	}

	private evaluateSort(operand: RollResult, operator: Operator): RollResult {
		if(!operand.dice.length) {
			throw new EvaluatingError(`Operand of ${operator} operator must be a roll result`);
		}

		switch (operator) {
		case "s":
			operand.dice.sort((a, b) => a.roll - b.roll);
			break;
		case "sl":
			operand.dice.sort((a, b) => b.roll - a.roll);
			break;
		default:
			throw new UnknownOperatorError(operator);
		}

		return {
			type: "Result",
			sum: operand.dice.reduce((acc, die) => acc + die.roll, 0),
			dice: operand.dice,
		};
	}

	private evaluateNumberExpression(node: NumberLiteral): NumberLiteralResult {
		return { 
			type: "NumberLiteralResult",
			sum: node.value,
			dice: [],
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
			type: "Result",
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

		switch (operator) {
		case TOKENS.KEEP:
		case TOKENS.KEEP_HIGHEST:
			dice.sort((a, b) => b.roll - a.roll);
			break;
		case TOKENS.KEEP_LOWEST:
			dice.sort((a, b) => a.roll - b.roll);
			break;
		default:
			throw new Error(`Unknown operator: ${operator}`);
		}
		
		const kept = dice.slice(0, count);

		return {
			type: "Result",
			sum: kept.reduce((acc, die) => acc + die.roll, 0),
			dice: kept,
			discarded: dice.slice(count).map((die) => { die.discarded = true; return die; }),
		};
	}

	private evaluateExplodeAndKeep(dice: Die[], count: number): RollResult {
		if(!dice?.length) {
			throw new EvaluatingError(`Left side of ${TOKENS.EXPLODE_AND_KEEP} operator must be a roll result`);
		}

		if (count <= 0) {
			throw new EvaluatingError(`Invalid explode count: ${count}`);
		}

		if (count > dice.length) {
			throw new EvaluatingError(`Cannot explode and keep ${count} highest dice from ${dice.length} dice`);
		}

		for(let i=0; i<dice.length; i++) {
			const die = dice[i];

			if(die.roll == die.sides) {
				let roll = die.roll;
				const newDice: Die[] = [ { sides: die.sides, roll } ];
			
				while(roll === die.sides) {
					roll = this.evaluateRoll(die.sides, 1).dice[0].roll;
					die.roll += roll;
					newDice.push({ sides: die.sides, roll });
				}

				const newDie = { sides: die.sides, roll: die.roll, exploded: true, dice: newDice };
				dice[i] = newDie;
			}
		}

		return this.evaluateKeep(dice, count, TOKENS.KEEP_HIGHEST);
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
			throw new UnknownOperatorError(node.operator);
		}

		return {
			type: "ArithmeticResult",
			sum: value,
			dice,
		} ;
	}
}