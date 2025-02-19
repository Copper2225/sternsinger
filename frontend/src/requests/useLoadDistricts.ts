import {bauernschaftenState, District, dorfBezirkeState, otherDistrictsState} from "@/requests/adminStore";
import {useRecoilValue} from "recoil";
import {useCallback} from "react";

export const useLoadDistricts = (): (() => District[]) => {
    const dorfBezirke = useRecoilValue(dorfBezirkeState);
    const bauernschaften = useRecoilValue(bauernschaftenState);
    const others = useRecoilValue(otherDistrictsState);

    return useCallback(
        () => {
            const newDistricts = Array.from({ length: dorfBezirke }, (_, index) => ({
                name: `Bezirk ${index + 1}`,
                counting: true,
            }));

            const newDistricts2 = bauernschaften.flatMap((b) => {
                return Array.from({ length: b.amount }, (_, index) => ({
                    name: `${b.name}${b.amount > 1 ? ` ${index + 1}` : ""}`,
                    counting: true,
                    bauernschaft: true
                }));
            });
            return ([...newDistricts, ...newDistricts2, ...others]);
        }, [bauernschaften, dorfBezirke, others]
    )
}