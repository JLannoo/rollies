import React, { useEffect } from "react";
import styles from "./Rolls.module.scss";

import { type Roll, useRollsStore } from "@/stores/rolls";
import Info from "../Info/Info";
import { ExplodedDie, type Die } from "@/parser/evaluator";

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

function Roll({ roll }: RollProps) {
	return (
		<div className={styles.roll}>
			<div className={styles.total}>
				<h2>{roll.result.sum}</h2>
			</div>

			<div className={styles.info}>
				<sub>{roll.formula}</sub>	
				<p>{
					roll.result.dice?.map((die, index) => 
						<React.Fragment key={index}>
							<Die die={die} />
							{index !== (roll.result.dice?.length ?? 0)  - 1 && ", "}
						</React.Fragment>)
				}</p>
			</div>
		</div>
	);
}

function Die({ die }: { die: Die | ExplodedDie }) {
	const isCritical = die.roll === die.sides;
	const isFail = die.roll === 1;

	const dice = "dice" in die ? die.dice : undefined;

	return (
		<span
			className={`
				${isCritical ? styles.critical : ""}
				${isFail ? styles.fail : ""}
				${"exploded" in die ? styles.exploded : ""}
			`.trim()}
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