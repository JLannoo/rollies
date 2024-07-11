import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";


const root = createRoot(document.getElementById("app") || document.body);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);

document.addEventListener("keypress", () => {
	const input = document.getElementById("input") as HTMLInputElement;
	input.focus();
});