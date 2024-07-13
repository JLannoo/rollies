export type TokenType = string;

export type Token = {
    type: TokenType;
    value: string | null;
	position: number;
}

export const TOKENS = {
	// Control chars
	ILLEGAL: "ILLEGAL",
	EOF: "EOF",
	SEPARATOR: ";",

	// Operators
	ROLL: "d",
	EXPLODE_AND_KEEP: "K",
	EXPLODE: "e",
	KEEP: "k",
	KEEP_HIGHEST: "kh",
	KEEP_LOWEST: "kl",
	SORT: "s",
	SORT_ASC: "sl",

	PLUS: "+",
	MINUS: "-",

	// Types
	NUMBER: "NUMBER",
} as const;

export const WHITESPACE = [ " ", "\t", "\n", "\r" ];

export type Operator = 
	typeof TOKENS.ROLL | 
	typeof TOKENS.PLUS | 
	typeof TOKENS.MINUS | 
	typeof TOKENS.KEEP | 
	typeof TOKENS.EXPLODE_AND_KEEP |
	typeof TOKENS.EXPLODE |
	typeof TOKENS.KEEP_HIGHEST |
	typeof TOKENS.KEEP_LOWEST |
	typeof TOKENS.SORT |
	typeof TOKENS.SORT_ASC;