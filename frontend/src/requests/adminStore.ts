import {atom} from "recoil";

export interface District {
    name: string,
    money?: number;
    counting: boolean;
}

interface Bauernschaft {
    name: string,
    amount: number
}

export const dorfBezirkeState = atom<number>({
    key: 'dorfBezirke',
    default: 20,
});

export const bauernschaftenState = atom<Bauernschaft[]>({
    key: 'bauernschaften',
    default: [
        { name: 'Brock', amount: 3 },
        { name: 'Überwasser', amount: 1 }
    ],
})

export const districtsState = atom<District[]>({
    key: 'districts',
    default: []
});