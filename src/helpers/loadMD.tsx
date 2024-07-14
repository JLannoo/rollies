import { parse } from "marked";
import { ReactNode } from "react";

import styles from "../md/md.module.scss";

import short from "../md/Short.md?raw";
import long from "../md/Long.md?raw";

export function loadShortMD(): ReactNode {
	const html = parse(short);
	return <div className={styles.md} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function loadLongMD(): ReactNode {
	const html = parse(long);
	return <div className={styles.md} dangerouslySetInnerHTML={{ __html: html }} />;
}