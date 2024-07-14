import { useEffect } from "react";
import styles from "./Info.module.scss";

import { loadShortMD } from "@/helpers/loadMD";

export default function Info() {
	const text = loadShortMD();

	useEffect(() => {
		const codeBlock = document.querySelectorAll(`.${styles.info} code`) as NodeListOf<HTMLElement>;
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
			{ text }
		</div>
	);
}

function copyFormulaToInput(formula: string) {
	const input = document.getElementById("input") as HTMLInputElement;
	input.value = formula;
	input.focus();
}