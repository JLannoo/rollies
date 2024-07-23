import { TOKENS, Token, WHITESPACE } from "./token";

export class IllegalTokenError extends Error {
	position: number;

	constructor(token: Token) {
		super(`Illegal token: '${token.value}' at position ${token.position}`);
		this.name = "IllegalTokenError";
		this.position = token.position;
	}
}

export class Lexer {
	input: string;
	position = 0;
	readPosition = 0;
	char: string | null = null;

	tokens: Token[] = [];

	constructor(input: string) {
		this.input = input;

		this.nextChar();
	}

	tokenize() {
		let token: Token;
		do {
			token = this.nextToken();
			this.tokens.push(token);
		} while (token.type !== TOKENS.EOF);

		return this.tokens;
	}

	private nextChar() {
		if(this.readPosition >= this.input.length) {
			this.char = null;
		} else {
			this.char = this.input[this.readPosition];
		}

		this.position = this.readPosition;
		this.readPosition++;

		this.consumeWhitespace();

		return this.char;
	}

	private nextToken(): Token {
		const char = this.char;
		let token: Token;

		switch (char) {
		case null:
			token = { position: this.position, type: TOKENS.EOF, value: "" };
			break;
		
		case TOKENS.ROLL:
			token = { position: this.position, type: TOKENS.ROLL, value: this.char };
			break;

		case TOKENS.EXPLODE_AND_KEEP:
			token = { position: this.position, type: TOKENS.EXPLODE_AND_KEEP, value: this.char };
			break;

		case TOKENS.KEEP:
			token = { position: this.position, type: TOKENS.KEEP, value: this.char };			

			switch (token.value+this.input[this.readPosition]) {
			case TOKENS.KEEP_HIGHEST:
				token = { position: this.position, type: TOKENS.KEEP_HIGHEST, value: TOKENS.KEEP_HIGHEST };
				this.nextChar();
				break;
			case TOKENS.KEEP_LOWEST:
				token = { position: this.position, type: TOKENS.KEEP_LOWEST, value: TOKENS.KEEP_LOWEST };
				this.nextChar();
				break;
			}
			break;
		
		case TOKENS.SORT:
			token = { position: this.position, type: TOKENS.SORT, value: this.char };

			switch (token.value+this.input[this.readPosition]) {
			case TOKENS.SORT_ASC:
				token = { position: this.position, type: TOKENS.SORT_ASC, value: TOKENS.SORT_ASC };
				this.nextChar();
				break;
			}
			break;

		case TOKENS.PLUS:
			token = { position: this.position, type: TOKENS.PLUS, value: this.char };
			break;

		case TOKENS.MINUS:
			token = { position: this.position, type: TOKENS.MINUS, value: this.char };
			break;

		case TOKENS.SEPARATOR:
			token = { position: this.position, type: TOKENS.SEPARATOR, value: this.char };
			break;

		default: {
			const start = this.position;
			if(this.isNumber(char)) {
				const number = this.readNumber();

				token = { position: start, type: TOKENS.NUMBER, value: number };
				return token;
			}
			
			token = { position: this.position, type: TOKENS.ILLEGAL, value: this.char };
			throw new IllegalTokenError(token);
		}
		}
		
		this.char = this.nextChar();

		return token;
	}

	private isNumber(char: string) {
		return char && !isNaN(Number(char));
	}

	private readNumber(): string {
		let string = this.char as string;
		let char = this.nextChar();

		
		while (this.isNumber(char as string)) {
			string += char as string;
			
			char = this.nextChar();
		}

		return string;
	}

	private consumeWhitespace() {
		while (WHITESPACE.includes(this.char as string)) {
			this.nextChar();
		}
	}
}