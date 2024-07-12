import styles from "./Input.module.scss";

import { InvalidExpressionError } from "@/parser/parser";
import { IllegalTokenError } from "@/parser/lexer";
import { useEffect, useRef } from "react";

type InputProps = {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	cleanup: () => void;
	error?: InvalidExpressionError | IllegalTokenError;
};

export default function Input({ onSubmit, cleanup, error }: InputProps) {
	const inputRef = useRef<HTMLInputElement | null>(document.querySelector("#input"));

	useEffect(() => {
		inputRef.current = document.querySelector("#input") as HTMLInputElement;
	}, []);

	return (
		<div className={styles.input}>
			<form onSubmit={onSubmit}>
				<div className={styles.inputContainer} data-error-pos={error?.position} data-input={inputRef.current?.value}>
					<input type="text" id="input" name="input" autoComplete="off" onFocus={cleanup} onChange={cleanup} />

					{error &&
						<span className={styles.errorOverlay} onClick={cleanup}>
							{inputRef.current?.value.split("").map((c, i) => (
								<span key={i} className={error?.position === i ? styles.error : ""}>
									{c}
								</span>
							))}
						</span>
					}
				</div>
				<button type="submit"> ROLL </button>
			</form>
		</div>
	);
}