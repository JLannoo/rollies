import styles from "./Dialog.module.scss";

import { create } from "zustand";
import { type ReactNode } from "react";

import { loadLongMD } from "@/helpers/loadMD";

type DialogState = {
	open: boolean;
	content: ReactNode;
};

const initialState: DialogState = {
	open: false,
	content: null,
};

interface DialogStore extends DialogState {
	close: () => void;
	dialog: (content: ReactNode) => void;
	openInfo: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
	open: initialState.open,
	content: initialState.content,
	close: () => set(() => initialState),
	dialog: (content) => set(() => ({ open: true, content })),
	openInfo: () => set(() => ({ open: true, content: loadLongMD() })),
}));

export default function Dialog() {
	const state = useDialogStore((state) => state);
	const close = useDialogStore((state) => state.close);

	if(!state.open) return null;	

	return (
		<div className={styles.dialog_container}>
			<div className={styles.dialog_backdrop} onClick={close}></div>

			<div className={styles.dialog}>
				<div className={styles.dialog_content}>
					{state.content}
				</div>
			</div>
		</div>
	);
}