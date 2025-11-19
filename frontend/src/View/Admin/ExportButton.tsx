import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import { District } from "src/requests/adminStore";

interface Props {
    values: District[];
    name: string;
}

const ExportButton = ({ values, name }: Props): React.ReactElement => {
    const downloadDistrictData = useCallback(() => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(
                JSON.stringify(
                    values.length > 1
                        ? values
                        : [
                              {
                                  name: "name",
                                  counting: "true/false",
                                  bauernschaft: "true/false",
                                  money: "?number",
                                  status: "?planned | walking | notPlanned | finished",
                              },
                          ],
                ),
            );
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute(
            "download",
            values.length > 1 ? name : "example" + ".json",
        );
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }, [name, values]);

    return (
        <div>
            <Button onClick={downloadDistrictData}>Export</Button>
        </div>
    );
};

export default ExportButton;
