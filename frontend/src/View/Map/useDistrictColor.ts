import {useRecoilValue} from "recoil";
import {districtsState} from "src/requests/adminStore";

export function useDistrictColor() {
    const districts = useRecoilValue(districtsState);

    return (districtName: string): string => {
        const index = districts.findIndex(d => d.name === districtName);

        switch (index%31) {
            case 0: return "#e6194b";    // red
            case 1: return "#3cb44b";    // green
            case 2: return "#ffe119";    // yellow
            case 3: return "#4363d8";    // blue
            case 4: return "#f58231";    // orange
            case 5: return "#911eb4";    // purple
            case 6: return "#46f0f0";    // cyan
            case 7: return "#f032e6";    // magenta
            case 8: return "#bcf60c";    // lime
            case 9: return "#fabebe";    // pink
            case 10: return "#008080";   // teal
            case 11: return "#e6beff";   // lavender
            case 12: return "#9a6324";   // brown
            case 13: return "#fffac8";   // light yellow
            case 14: return "#800000";   // maroon
            case 15: return "#aaffc3";   // mint
            case 16: return "#808000";   // olive
            case 17: return "#ffd8b1";   // peach
            case 18: return "#000075";   // navy
            case 19: return "#808080";   // gray
            case 20: return "#ff4500";   // orange red
            case 21: return "#32cd32";   // lime green
            case 22: return "#1e90ff";   // dodger blue
            case 23: return "#ff1493";   // deep pink
            case 24: return "#00ced1";   // dark turquoise
            case 25: return "#ffd700";   // gold
            case 26: return "#adff2f";   // green yellow
            case 27: return "#ff69b4";   // hot pink
            case 28: return "#4b0082";   // indigo
            case 29: return "#00ff7f";   // spring green
            default: return "#3FB1CE";   // fallback color
        }
    };
}
