import { RollResult } from "@/parser/evaluator";
import { create } from "zustand";

export type Roll = {
	formula: string;
	result: RollResult;
};

type RollsStore = {
	rolls: Roll[];
	setResults: (results: Roll[]) => void;
	addResult: (result: Roll) => void;
	deleteResult: (index: number) => void;
};

export const useRollsStore = create<RollsStore>((set) => ({
	rolls: [],
	setResults: (rolls) => set({ rolls: rolls }),
	addResult: (roll) => set((state) => ({ rolls: [ ...state.rolls, roll ] })),
	deleteResult: (index) => set((state) => ({ rolls: state.rolls.filter((_, i) => i !== index) })),
}));
