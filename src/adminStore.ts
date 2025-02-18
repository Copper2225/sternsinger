import {atom} from "recoil";

export const dorfBezirkeState = atom<number>({
    key: 'dorfBezirke',
    default: 20,
});