import React, { useEffect } from "react";
import styles from "./Rolls.module.scss";

import { type Roll, useRollsStore } from "@/stores/rolls";
import Info from "../Info/Info";
import { type Die } from "@/parser/evaluator";

export default function Rolls() {
	const rolls = useRollsStore((state) => state.rolls);

	useEffect(() => {
		const element = document.getElementById("rolls");
		if (element) {
			element.scrollTop = element.scrollHeight;
		}
	}, [ rolls ]);

	if(rolls.length === 0) return <Info />;

	return (
		<div id="rolls" className={styles.rolls}>
			{rolls.map((roll, index) => (
				<Roll key={index} roll={roll} index={index} />
			))}			
		</div>
	);
}

type RollProps = {
	roll: Roll;
	index: number;
};

function Roll({ roll, index }: RollProps) {
	const del = useRollsStore((state) => state.deleteResult);

	return (
		<div className={styles.roll}>
			<div className={styles.total}>
				<h2>{roll.result.sum}</h2>
			</div>

			<div className={styles.info}>
				<sub>{roll.formula}</sub>	
				<p>{
					<>
						{roll.result.dice.map((die, index) =>
							<React.Fragment key={index}>
								<Die die={die} />
								{index !== (roll.result.dice.length ?? 0)  - 1 && ", "}
							</React.Fragment>)
						}
						&nbsp;
						<span className={styles.discarded} title="Discarded dice">
							{roll.result.discarded?.map((die, index) =>
								<React.Fragment key={index}>
									<Die die={die} />
									{index !== (roll.result.discarded?.length ?? 0) - 1 && ", "}
								</React.Fragment>)
							}
						</span>
					</>
				}</p>
			</div>

			<div className={styles.actions}>
				<button onClick={() => del(index)} title="Delete roll" className={styles.delete}>
					<img src="./img/trash.svg" alt="Delete Roll" />
				</button>
			</div>
		</div>
	);
}

function Die({ die }: { die: Roll["result"]["dice"][number] }) {
	const isCritical = die.roll === die.sides;
	const isFail = die.roll === 1;
	const isExploded = "exploded" in die;
	const isDiscarded = die.discarded;

	const dice = "dice" in die ? die.dice : undefined;

	const title = [
		isCritical ? "Critical" : "",
		isFail ? "Fail" : "",
		isExploded ? "Exploded" : "",
		isDiscarded ? "Discarded" : "",
	].filter((t) => t).join(", ");

	return (
		<span
			className={`
				${isCritical ? styles.critical : ""}
				${isFail ? styles.fail : ""}
				${isExploded ? styles.exploded : ""}
				${isDiscarded ? styles.discarded : ""}
			`.trim()}
			title={title}
		>
			<span>{die.roll}</span>
			&nbsp;

			{dice ? 
				<span>
					({dice?.map((die, index) => 
						<React.Fragment key={index}>
							{die.roll}
							{index !== (dice?.length - 1) && ", "}
						</React.Fragment>)
					})
				</span>
				: ""
			}
		</span>
	);
}