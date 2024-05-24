/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";

import { DownloadIcon } from "@trail-ui/icons";
import { Button } from "@trail-ui/react";

//@ts-expect-error fix
const DownloadCSV = ({ csvdata }) => {
  const excelData: string[][] = [["SR NO.", "ISSUE NAME", "ELEMENT", "CODE"]];
  const handleDownload = () => {

    let data;
    csvdata.forEach((element: any, index: any) => {
      data = element.data.issues.find(
        (item: any) => item.id === csvdata[index].id
      );

      const dataformat = [
        index + 1,
        element.data.failing_technique,
        data.elementTagName,
        data.context,
      ];

      excelData.push(dataformat);
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "yessss.xlsx");
  };
  return (
    <div>
      <Button
        className="font-medium"
        appearance="text"
        onPress={handleDownload}
        endContent={
          <DownloadIcon width={24} height={24} aria-label="Download" />
        }
      >
        CSV
      </Button>
    </div>
  );
};

export { DownloadCSV };
