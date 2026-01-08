import { atom } from "recoil";

export enum DistrictStatusText {
    notPlanned = "notPlanned",
    planned = "planned",
    walking = "walking",
    calculating = "calculating",
    finished = "finished",
}

export interface DistrictMarker {
    notes: string;
    done: boolean;
    lat: number;
    lng: number;
}

export interface District {
    name: string;
    bauernschaft: boolean;
    counting: boolean;
    money?: number;
    status?: DistrictStatusText;
    contact?: string;
    markers?: Map<string, DistrictMarker> | Record<string, DistrictMarker>;
}

interface Bauernschaft {
    name: string;
    amount: number;
}

export const dorfBezirkeState = atom<number>({
    key: "dorfBezirke",
    default: 29,
});

export const bauernschaftenState = atom<Bauernschaft[]>({
    key: "bauernschaften",
    default: [
        { name: "Brock", amount: 2 },
        { name: "Loburg", amount: 2 },
        { name: "Schirl", amount: 3 },
        { name: "Überwasser", amount: 1 },
        { name: "Eichendorff", amount: 1 },
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

export const authState = atom<boolean>({
    key: "auth",
    default: false,
});
