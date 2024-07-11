import styles from "./Input.module.scss";

type InputProps = {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function Input({ onSubmit }: InputProps) {
	return (
		<div className={styles.input}>
			<form onSubmit={onSubmit}>
				<input type="text" id="input" name="input" autoComplete="off" />
				<button type="submit"> ROLL </button>
			</form>
		</div>
	);
}