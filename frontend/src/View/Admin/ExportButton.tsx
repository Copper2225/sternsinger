import React, {useCallback, useRef} from "react";
import {Button} from "react-bootstrap";

interface Props {
    values: any;
    name: string
}

const ExportButton = ({values, name}: Props): React.ReactElement => {

    const downloadDistrictData = useCallback(() => {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(values));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", name + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }, [values])

    return (<div>
        <Button onClick={downloadDistrictData}>Export</Button>
    </div>)
}

export default ExportButton;