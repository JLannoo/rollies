import { useEffect } from "react";
import styles from "./Info.module.scss";
import text from "./Short.md?raw";

import { parse } from "marked";

export default function Info() {
	useEffect(() => {
		const codeBlock = document.querySelectorAll("code");
		codeBlock.forEach((block) => {
			block.style.cursor = "pointer";
			block.addEventListener("click", () => {
				const formula = block.textContent as string;
				copyFormulaToInput(formula);
			});
		});
	}, [ text ]);

	return (
		<div className={styles.info}>
			<div
				dangerouslySetInnerHTML={{
					__html: parse(text),
				}}
			/>
		</div>
	);
}

function copyFormulaToInput(formula: string) {
	const input = document.getElementById("input") as HTMLInputElement;
	input.value = formula;
	input.focus();
}