import React, { useMemo } from "react";

interface Props {
    values: number[];
}

const DonationSum = ({ values }: Props): React.ReactElement => {
    const total = useMemo(
        () =>
            values
                .reduce((sum, value) => sum + value, 0)
                .toLocaleString("de", {
                    style: "currency",
                    currency: "EUR",
                }),
        [values],
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <span className={"donation-title"}>Aktueller Spendenstand:</span>
            <span className={"donation-sum"}>{total}</span>
        </div>
    );
};

export default DonationSum;
