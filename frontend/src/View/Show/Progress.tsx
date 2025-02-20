import React, {useCallback, useMemo} from "react";
import {District} from "@/requests/adminStore";
import ProgressDistrict from "@/View/Show/ProgressDistrict";
import {ProgressBar} from "react-bootstrap";

interface Props {
    districts: District[]
}

interface Part {
    value: number,
    total: number
}

const Progress = ({districts}: Props): React.ReactElement => {
    const calculateProgress = useCallback((filterFn: (district: District) => boolean): Part => {
        const filteredDistricts = districts.filter(filterFn);
        return {
            value: filteredDistricts.filter(d => (d.money ?? 0) > 0).length,
            total: filteredDistricts.length,
        };
    }, [districts]);

    const total = useMemo(() => calculateProgress(d => d.counting), [districts]);
    const bauernschaften = useMemo(() => calculateProgress(d => d.counting && d.bauernschaft == true), [districts]);
    const dorf = useMemo(() => calculateProgress(d => d.counting && !d.bauernschaft), [districts]);

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