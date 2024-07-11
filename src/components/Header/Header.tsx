import style from "./Header.module.scss";


type HeaderProps = {
	title: string;
};

export default function Header(props: HeaderProps) {
	return (
		<div className={style.header}>

			<h1>{props.title}</h1>

			<div className={style.links}>
				<button>
					<img src="./img/info.svg" />
				</button>
				<a href="https://github.com/jlannoo/rollies" target="_blank" rel="noreferrer">
					<img src="./img/github.svg" />
				</a>
			</div>
		</div>
	);
}