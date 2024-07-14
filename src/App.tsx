import { FormEventHandler, useState } from "react";

import { IllegalTokenError, Lexer } from "./parser/lexer";
import { InvalidExpressionError, Parser } from "./parser/parser";
import { Evaluator } from "./parser/evaluator";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";
import Rolls from "./components/Rolls/Rolls";
import Input from "./components/Input/Input";

import Dialog from "./components/Dialog/Dialog";

import { useRollsStore } from "./stores/rolls";

export default function App() {
	const [ error, setError ] = useState<InvalidExpressionError|IllegalTokenError>();

	const addResult = useRollsStore((state) => state.addResult);

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const object = Object.fromEntries(formData);

		try {
			const tokens = new Lexer(object.input.toString()).tokenize();
			const ast = new Parser(tokens).parse();
			const values = new Evaluator(ast).evaluate();

			if (!values) {
				toast.error("Invalid expression");
				return;
			}
			
			addResult({
				formula: object.input.toString(),
				result: values,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				if(error instanceof InvalidExpressionError) {
					setError(error);
				} else if(error instanceof IllegalTokenError) {
					setError(error);
				}
				toast.error(error.message);
			}
		}
	};

	return (
		<>
			<Header title="Rollies" />
			<Rolls />
			<Input onSubmit={submitHandler} error={error} cleanup={() => setError(undefined)}/>

			<ToastContainer
				position="top-right"
				theme="colored"
				hideProgressBar
			/>
			
			<Dialog />
		</>
	);
}