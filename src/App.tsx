import { FormEventHandler, useState } from "react";

import { IllegalTokenError } from "./parser/lexer";
import { InvalidExpressionError } from "./parser/parser";
import { roll } from "./parser";

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
		const string = object.input.toString();

		try {
			const values = roll(string);

			if (!values) {
				return toast.error("Invalid expression");
			}
			
			addResult({ formula: string, result: values });
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