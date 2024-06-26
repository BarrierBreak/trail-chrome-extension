/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { DownloadIcon } from "@trail-ui/icons";
import { IconButton } from "@trail-ui/react";
import { rgbaToHex } from "./utils";

//@ts-expect-error fix
const DownloadCSV = ({ csvdata }) => {
  const issueType = {
    Fails: csvdata.issues.errors,
    Manual: csvdata.issues.warnings,
    Pass: csvdata.issues.pass,
    "Best Practice": csvdata.issues.notices,
  };

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

  // To download CSV file
  const downloadCSV = () => {
    const workbook = XLSX.utils.book_new();

    Object.values(issueType).forEach((data: any, index: number) => {
      const excelData: string[][] = [
        [
          "ISSUE VARIABLE",
          "ELEMENT",
          "SCREENSHOT",
          "CODE",
          "ATTRIBUTE",
          "CONFORMANCE LEVEL",
          "CRITERIA",
          "SEVERITY",
        ],
      ];

      Object.values(data).forEach((level: any) => {
        level.forEach((issue: any) => {
          issue.issues.forEach((item: any) => {
            const formattedParts: {
              FontSize?: string;
              FontWeight?: string;
              Foreground?: string;
              Background?: string;
              Ratio?: string;
            } = {};

            const regex = /(\w+)--([^=]+)/g;
            let match;

            while ((match = regex.exec(item.message)) !== null) {
              const key = match[1];
              const value = match[2];

              switch (key) {
                case "fontsize":
                  formattedParts["FontSize"] = `${parseInt(value)}px`;
                  break;
                case "fontweight":
                  formattedParts["FontWeight"] =
                    parseInt(value) >= 700 ? "Bold" : "Normal";
                  break;
                case "forec":
                  formattedParts["Foreground"] = rgbaToHex(value);
                  break;
                case "backc":
                  formattedParts["Background"] = rgbaToHex(value);
                  break;
                case "ratio":
                  formattedParts["Ratio"] =
                    parseFloat(parseFloat(value.slice(0, -2)).toFixed(2)) +
                    ":1";
                  break;
                default:
                  break;
              }
            }

            const attribute =
              item.code !== "BB10575" &&
              item.code !== "BB10615" &&
              issue.element === "Contrast"
                ? `Font-size: ${formattedParts["FontSize"]}, Font-weight: ${formattedParts["FontWeight"]}, Foreground Color: ${formattedParts["Foreground"]}, Background Color: ${formattedParts["Background"]}, Ratio: ${formattedParts["Ratio"]}`
                : item.message;

            const dataformat = [
              issue.failing_technique,
              item.elementTagName,
              item.code,
              item.context?.substring(0, 300),
              attribute,
              issue.conformance_level,
              issue.criteria_name,
              issue.severity,
            ];

            excelData.push(dataformat);
          });
        });
      });

      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${Object.keys(issueType)[index]}`
      );
    });

    XLSX.writeFile(workbook, `${currentURL} Report.xlsx`);
  };

  // To handle download click
  const handleDownload = () => {
    downloadCSV();
  };

  return (
    <div>
      <IconButton
        appearance="text"
        isIconOnly={true}
        onPress={handleDownload}
        aria-label="Download"
      >
        <DownloadIcon width={24} height={24} className="text-neutral-800" />
      </IconButton>
    </div>
  );
};

export default DownloadCSV;
