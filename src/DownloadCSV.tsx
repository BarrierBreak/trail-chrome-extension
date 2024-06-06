/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as XLSX from "xlsx";
import { DownloadIcon } from "@trail-ui/icons";
import { Button } from "@trail-ui/react";

//@ts-expect-error fix
const DownloadCSV = ({ csvdata }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
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

  // To remove unwanted characters from url
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

  // To handle popup functionality
  const handleShowPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // To download CSV file
  const downloadCSV = () => {
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

  // To handle download click
  const handleDownload = () => {
    csvdata.length === 0 ? handleShowPopup() : downloadCSV();
  };

  return (
    <div>
      <Button
        className="text-base text-neutral-800"
        appearance="default"
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
      {showPopup && (
        <div className="absolute top-[100%] right-[11%] bg-neutral-50 text-neutral-900 border border-neutral-300 text-sm font-medium font-poppins shadow-lg px-3 py-2.5 rounded">
          No Results Selected!
        </div>
      )}
    </div>
  );
};

export default DownloadCSV;
