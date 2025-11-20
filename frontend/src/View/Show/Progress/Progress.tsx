import React, { useCallback, useMemo } from "react";
import { District } from "src/requests/adminStore";
import ProgressDistrict from "src/View/Show/Progress/ProgressDistrict";
import { ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import "./progress.css";

const ProgressContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 90vw;

    @media screen and (orientation: portrait) {
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2em;
    }
`;

interface Props {
    districts: District[];
}

interface Part {
    value: number;
    total: number;
}

const Progress = ({ districts }: Props): React.ReactElement => {
    const calculateProgress = useCallback(
        (filterFn: (district: District) => boolean): Part => {
            const filteredDistricts = districts.filter(filterFn);
            return {
                value: filteredDistricts.filter((d) => (d.money ?? 0) > 0)
                    .length,
                total: filteredDistricts.length,
            };
        },
        [districts],
    );

    const withProgressText = useMemo(() => {
        return new URLSearchParams(window.location.search).get("value") !== null;
    }, []);

    const total = useMemo(
        () => calculateProgress((d) => d.counting),
        [calculateProgress],
    );
    const bauernschaften = useMemo(
        () => calculateProgress((d) => d.counting && d.bauernschaft),
        [calculateProgress],
    );
    const dorf = useMemo(
        () => calculateProgress((d) => d.counting && !d.bauernschaft),
        [calculateProgress],
    );

    return (

            <div className={"progress-wrapper"}><span className={"progress-title"}>Aktueller Fortschritt:</span>
                <ProgressContainer>
                    <ProgressDistrict
                        title={"Dorf"}
                        value={dorf.value}
                        total={dorf.total}
                    />
                    <ProgressDistrict
                        title={"Bauernschaften"}
                        value={bauernschaften.value}
                        total={bauernschaften.total}
                    />
                    <ProgressDistrict
                        title={"Gesamt"}
                        value={total.value}
                        total={total.total}
                    />
                </ProgressContainer>
                <div className={"progress-div"}>
                    <ProgressBar now={total.value} max={total.total} />
                    {withProgressText && <span className={"progress-value"}>{(total.value/total.total*100).toFixed(1)} %</span>}
                </div></div>

    );
};

export default Progress;
