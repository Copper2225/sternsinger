import React from "react";

interface Props {
    title: string,
    value: number,
    total: number
}

const ProgressDistrict = ({title, value, total}: Props): React.ReactElement => {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
            <span style={{fontSize: "3em"}}>{title}</span>
            <span style={{fontSize: "10em"}}>{value} / {total}</span>
        </div>
    );
}

export default ProgressDistrict;