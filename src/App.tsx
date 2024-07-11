import { FormEventHandler } from "react";

import { Lexer } from "./parser/lexer";
import { Parser } from "./parser/parser";
import { Evaluator } from "./parser/evaluator";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";
import Rolls from "./components/Rolls/Rolls";
import Input from "./components/Input/Input";

import { useRollsStore } from "./stores/rolls";

export default function App() {
	const addResult = useRollsStore((state) => state.addResult);

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const object = Object.fromEntries(formData);

		try {
			const tokens = new Lexer(object.input.toString()).tokenize();			
			const ast = new Parser(tokens).parse();
			console.log(ast);
			
			const values = new Evaluator(ast).evaluate();

			if (!values) {
				toast.error("Invalid expression");
				return;
			}
			
			addResult({
				formula: object.input.toString(),
				result: values,
			});
		} catch (error: any) {
			toast.error(error.message);
			return;
		}
	};

	return (
		<>
			<Header title="Rollies" />
			<Rolls />
			<Input onSubmit={submitHandler} />

			<ToastContainer
				position="top-right"
				theme="colored"
				hideProgressBar
			/>
		</>
	);
}