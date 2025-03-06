import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
`;

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
        <Wrapper>
            <span className={"progress-name"}>{title}</span>
            <span className={"progress-numbers"}>
                {value} / {total}
            </span>
        </Wrapper>
    );
};

export default ProgressDistrict;
