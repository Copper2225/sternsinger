import { atom } from "recoil";

export enum DistrictStatusText {
    planned = "planned",
    walking = "walking",
    notPlanned = "notPlanned",
    finished = "finished",
}

export interface District {
    name: string;
    bauernschaft: boolean;
    counting: boolean;
    money?: number;
    status?: DistrictStatusText;
}

interface Bauernschaft {
    name: string;
    amount: number;
}

export const dorfBezirkeState = atom<number>({
    key: "dorfBezirke",
    default: 20,
});

export const bauernschaftenState = atom<Bauernschaft[]>({
    key: "bauernschaften",
    default: [
        { name: "Brock", amount: 3 },
        { name: "Schirl", amount: 3 },
        { name: "Überwasser", amount: 1 },
    ],
});

export const otherDistrictsState = atom<District[]>({
    key: "otherDistricts",
    default: [
        { name: "Neujahrsempfang", counting: false, bauernschaft: false },
        { name: "Sonstiges", counting: false, bauernschaft: false },
    ],
});

export const districtsState = atom<District[]>({
    key: "districts",
    default: [],
});
