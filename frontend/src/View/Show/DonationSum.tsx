import React from "react";

interface Props {
    total: string
}

const DonationSum = ({total}: Props): React.ReactElement => {
    return (
        <div style={{display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <span style={{fontSize: "4em"}} >Aktueller Spendenstand:</span>
            <span style={{fontSize: "18em"}}>{total}</span>
        </div>
    );
}

export default DonationSum;