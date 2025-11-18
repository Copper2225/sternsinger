import {
    bauernschaftenState,
    District,
    dorfBezirkeState,
    otherDistrictsState,
} from "src/requests/adminStore";
import { useRecoilValue } from "recoil";
import { useCallback } from "react";

const skipped: number[] = [];

export const useLoadDistricts = (): (() => District[]) => {
    const dorfBezirke = useRecoilValue(dorfBezirkeState);
    const bauernschaften = useRecoilValue(bauernschaftenState);
    const others = useRecoilValue(otherDistrictsState);

    return useCallback(() => {
        const newDistricts = Array.from(
            { length: dorfBezirke - skipped.length },
            (_, index) => {
                // Find the correct district number by accounting for skipped ones.
                let districtNumber = index + 1;
                let skippedCount = 0;

                // This loop increments the district number for each skipped district it passes.
                while (
                    skippedCount < skipped.length &&
                    skipped[skippedCount] <= districtNumber
                ) {
                    districtNumber++;
                    skippedCount++;
                }

                return {
                    name: `Bezirk ${districtNumber}`,
                    counting: true,
                    bauernschaft: false,
                    money: null,
                };
            },
        );

        const newDistricts2 = bauernschaften.flatMap((b) => {
            return Array.from({ length: b.amount }, (_, index) => ({
                name: `${b.name}${b.amount > 1 ? ` ${index + 1}` : ""}`,
                counting: true,
                bauernschaft: true,
                money: null,
            }));
        });
        return [...newDistricts, ...newDistricts2, ...others];
    }, [bauernschaften, dorfBezirke, others]);
};
