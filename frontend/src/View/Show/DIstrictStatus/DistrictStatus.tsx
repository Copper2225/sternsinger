import React, { ReactElement } from "react";
import { District } from "src/requests/adminStore";
import "./status.css";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";

interface Props {
    districts: District[];
}

const DistrictStatus = ({ districts }: Props): ReactElement => {

    return (
        <>
            <div className={"h-100 w-100 status-wrapper"}>
                <span className={"status-title"}>Bezirke Status:</span>
                <div
                    className={"status-grid h-100 w-100"}
                    style={{
                        gridTemplateColumns: `repeat(4, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${Math.ceil(districts.length / 4)}, minmax(0, 1fr))`,
                    }}
                >
                    {districts.filter(dist => dist.counting).map((district) => (
                        <div className={"d-flex flex-row align-items-center status-item"}>
                            <StatusIcon status={district.status} />
                            <div className={""}>{district.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DistrictStatus;
