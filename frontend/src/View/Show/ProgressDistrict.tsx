import React from "react";

interface Props {
    title: string;
    value: number;
    total: number;
}

const ProgressDistrict = ({
    title,
    value,
    total,
}: Props): React.ReactElement => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <span className={"progress-name"}>{title}</span>
            <span className={"progress-numbers"}>
                {value} / {total}
            </span>
        </div>
    );
};

export default ProgressDistrict;
