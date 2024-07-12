import { Operator, TOKENS, type Token } from "./token";

export class InvalidExpressionError extends Error {
	position: number;

	constructor(token: Token) {
		super(`Invalid expression: '${token.value}' at position ${token.position}`);
		this.name = "InvalidExpressionError";
		this.position = token.position;
	}
}

class EndOfInputError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EndOfInputError";
	}
}

export type Node = {
	type: string;
}

export interface Expression {
	type: string;
	toString: () => string;
}

export interface BinaryExpression extends Expression {
	type: "BinaryExpression";
	operator: Operator;
	left: Expression;
	right: Expression;
}

export interface UnaryExpression extends Expression {
	type: "UnaryExpression";
	operator: Operator;
	operand: Expression;
}

export interface NumberLiteral extends Expression {
	type: "NumberLiteral";
	value: number;
}

type PrefixParseFn = () => Expression;
type InfixParseFn = (left: Expression) => Expression;
type PostfixParseFn = (left: Expression) => Expression;

export type Program = Expression[];

const PRECEDENCE: { [key: string]: number } = {
	[TOKENS.SEPARATOR]: 1,
	[TOKENS.SORT]: 1,
	[TOKENS.SORT_ASC]: 1,

	[TOKENS.PLUS]: 2,
	[TOKENS.MINUS]: 2,

	[TOKENS.EXPLODE]: 3,
	[TOKENS.KEEP]: 3,
	[TOKENS.KEEP_HIGHEST]: 3,
	[TOKENS.KEEP_LOWEST]: 3,

	[TOKENS.ROLL]: 4,
};

export class Parser {
	errors: string[] = [];
	tokens: Token[] = [];

	program: Program = [];

	currentIndex = 0;
	currentToken: Token;
	peekToken: Token;

	prefixParseFns: { [key: string]: PrefixParseFn } = {};
	postfixParseFns: { [key: string]: PostfixParseFn } = {};
	infixParseFns: { [key: string]: InfixParseFn } = {};

	constructor(tokens: Token[]) {
		this.tokens = tokens;

		this.currentIndex = 0;

		this.prefixParseFns = {
			[TOKENS.NUMBER]: this.parseNumberExpression,
		};

		this.postfixParseFns = {
			[TOKENS.SORT]: this.parseSortExpression,
			[TOKENS.SORT_ASC]: this.parseSortExpression,
		};

		this.infixParseFns = {
			[TOKENS.ROLL]: this.parseBinaryExpression,
			[TOKENS.EXPLODE]: this.parseBinaryExpression,
			[TOKENS.KEEP]: this.parseBinaryExpression,
			[TOKENS.KEEP_HIGHEST]: this.parseBinaryExpression,
			[TOKENS.KEEP_LOWEST]: this.parseBinaryExpression,

			[TOKENS.PLUS]: this.parseBinaryExpression,
			[TOKENS.MINUS]: this.parseBinaryExpression,
			[TOKENS.SEPARATOR]: this.parseBinaryExpression,
		};

		this.currentToken = this.tokens[this.currentIndex];
		this.peekToken = this.tokens[this.currentIndex + 1];
	}

	private nextToken() {
		this.currentIndex++;
		this.currentToken = this.tokens[this.currentIndex];
		this.peekToken = this.tokens[this.currentIndex + 1];
	}

	private getPrecedence(token: Token) {
		if(token?.type in PRECEDENCE) {
			return PRECEDENCE[token.type];
		}

		return 0;
	}

	private parseNumberExpression(): NumberLiteral {
		const number = parseInt(this.currentToken.value as string);

		if (isNaN(number)) {
			throw new Error(`Could not parse ${this.currentToken.value} as number`);
		}

		return {
			type: "NumberLiteral",
			value: number,
			toString: () => number.toString(),
		};
	}

	private parseSortExpression(left: Expression): UnaryExpression {
		const operator = this.currentToken.type as Operator;
		this.nextToken(); // Consume operator

		return {
			type: "UnaryExpression",
			operator,
			operand: left,
			toString: () => `${left ? left.toString() : ""}${operator}`,
		};
	}

	private parseBinaryExpression(left: Expression): BinaryExpression {
		const operator = this.currentToken.type as Operator;
		const precedence = this.getPrecedence(this.currentToken);
		if(!this.peekToken) {
			throw new EndOfInputError("Unexpected end of input");
		}
		this.nextToken(); // Consume operator

		const right = this.parseExpression(precedence);

		return {
			type: "BinaryExpression",
			operator,
			left,
			right,
			toString: () => `${left ? left.toString() : ""}${operator}${right ? right.toString() : ""}`,
		};
	}

	parse(): Program {
		while (this.currentToken && this.currentToken.type !== TOKENS.EOF) {
			const expression = this.parseExpression(0);
			this.program.push(expression);
			this.nextToken();
		}

		return this.program;
	}

	private parseExpression(precedence: number): Expression {
		const prefixFn = this.prefixParseFns[this.currentToken.type as string];
		let leftExp = prefixFn?.call(this) || null;

		while(precedence < this.getPrecedence(this.peekToken)) {
			const infixFn = this.infixParseFns[this.peekToken.type as string];
			const postfixFn = this.postfixParseFns[this.peekToken.type as string];
			
			if(!infixFn && !postfixFn) {
				return leftExp;
			}

			this.nextToken();

			if(infixFn) {
				leftExp = infixFn.call(this, leftExp);
			}

			if(postfixFn) {
				leftExp = postfixFn.call(this, leftExp);
			}
		}


		if(!leftExp && this.currentToken.type !== TOKENS.EOF) {
			throw new InvalidExpressionError(this.currentToken);
		}

		return leftExp;
	}
}