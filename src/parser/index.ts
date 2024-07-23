import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Evaluator } from "./evaluator";

export function roll(input: string) {
	const tokens = new Lexer(input).tokenize();
	const program = new Parser(tokens).parse();
	const result = new Evaluator(program).evaluate();

	return result;
}
