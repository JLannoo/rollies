import React, { useEffect } from "react";
import styles from "./Rolls.module.scss";

import { type Roll, useRollsStore } from "@/stores/rolls";
import Info from "../Info/Info";

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
				<p>{roll.result.dice?.map((die, index) => {
					const isCritical = die.roll === die.sides;
					const isFail = die.roll === 1;

					return (
						<React.Fragment key={index}>
							<span
								key={index}
								className={`
									${isCritical ? styles.critical : ""}
									${isFail ? styles.fail : ""}
								`.trim()}
							>
								{die.roll}
							</span>
							{index !== (roll.result.dice?.length ?? 0)  - 1 && ", "}
						</React.Fragment>
					);
				})
				}</p>
			</div>
		</div>
	);
}