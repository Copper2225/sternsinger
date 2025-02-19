import React, {useMemo} from "react";
import {District} from "@/requests/adminStore";
import ProgressDistrict from "@/View/Show/ProgressDistrict";
import {ProgressBar} from "react-bootstrap";

interface Props {
    values: number[],
    districts: District[]
}

interface Part {
    value: number,
    total: number
}

const Progress = ({values, districts}: Props): React.ReactElement => {
    const total = useMemo<Part>(() => {
        const value = districts.reduce(
            (sum, value, index) => values[index] > 0 && value.counting ? sum + 1 : sum, 0
        );
        const total = districts.reduce(
            (sum, value, index) => value.counting ? sum + 1 : sum, 0
        );
        return { value, total };
    }, [values, districts]);

    const bauernschaften = useMemo<Part>(() => {
        const value = districts.reduce(
            (sum, value, index) => values[index] > 0 && value.counting && value.bauernschaft == true ? sum + 1 : sum, 0
        );
        const total = districts.reduce(
            (sum, value, index) => value.counting && value.bauernschaft == true ? sum + 1 : sum, 0
        );
        return { value, total };
    }, [values, districts]);

    const dorf = useMemo<Part>(() => {
        const value = districts.reduce(
            (sum, value, index) => values[index] > 0 && value.counting && value.bauernschaft != true ? sum + 1 : sum, 0
        );
        const total = districts.reduce(
            (sum, value, index) => value.counting && value.bauernschaft != true ? sum + 1 : sum, 0
        );
        return { value, total };
    }, [values, districts]);

    return (
        <div style={{
            display: "flex",
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}>
            <span style={{fontSize: "4em", marginBottom: 30}}>Aktueller Fortschritt:</span>
            <div style={{display: "flex", justifyContent: "space-between", width: "80vW"}}>
                <ProgressDistrict title={"Gesamt"} value={total.value} total={total.total} />
                <ProgressDistrict title={"Bauernschaften"} value={bauernschaften.value} total={bauernschaften.total} />
                <ProgressDistrict title={"Dorf"} value={dorf.value} total={dorf.total} />
            </div>
            <ProgressBar now={total.value} max={total.total}/>
        </div>
    );
}

export default Progress;