/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { DownloadIcon } from "@trail-ui/icons";
import { Button } from "@trail-ui/react";

//@ts-expect-error fix
const DownloadCSV = ({ csvdata }) => {
  const getCleanUrl = (callback: any) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        const tabURL = tabs[0].url;
        const cleanURL = tabURL?.replace(/^(https?:\/\/)?(www\.)?/, "");
        callback(cleanURL);
      }
    );
  };

  let currentURL: string;
  getCleanUrl((cleanURL: string) => {
    currentURL = cleanURL;
  });

  const excelData: string[][] = [
    [
      "ISSUE VARIABLE",
      "ELEMENT",
      "SCREENSHOT",
      "CODE",
      "CONFORMANCE LEVEL",
      "CRITERIA",
      "SEVERITY",
    ],
  ];
  const handleDownload = () => {
    let data;

    csvdata.forEach((element: any, index: any) => {
      data = element.data.issues.find(
        (item: any) => item.id === csvdata[index].id
      );

      const dataformat = [
        element.data.failing_technique,
        data.elementTagName,
        element.alt,
        data.context.substring(0, 300),
        element.data.conformance_level,
        element.data.criteria_name,
        element.data.severity,
      ];

      excelData.push(dataformat);
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    XLSX.writeFile(workbook, `${currentURL} Report.xlsx`);
  };
  return (
    <div>
      <Button
        className="font-medium text-base text-neutral-800"
        appearance="text"
        onPress={handleDownload}
        endContent={
          <DownloadIcon
            width={24}
            height={24}
            aria-label="Download"
            className="text-neutral-800"
          />
        }
      >
        CSV
      </Button>
    </div>
  );
};

export default DownloadCSV;
