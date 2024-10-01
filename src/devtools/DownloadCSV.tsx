/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { DownloadIcon } from "@trail-ui/icons";
import { IconButton } from "@trail-ui/react";
import { rgbaToHex } from "./utils";

//@ts-expect-error fix
const DownloadCSV = ({ csvData, rules }) => {
  const issueType = {
    Fails: csvData.errorType,
    Manual: csvData.warningType,
    Pass: csvData.passType,
    "Best Practice": csvData.noticeType,
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
  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();

    const conformanceOrder: { [key: string]: number } = {
      A: 1,
      AA: 2,
      AAA: 3,
      Section508: 4,
      "Best Practice": 5,
    };

    Object.values(issueType)?.forEach((data: any, index: number) => {
      const excelData: string[][] = [
        [
          "ISSUE VARIABLE",
          "ELEMENT",
          "CODE",
          "ATTRIBUTE",
          "CONFORMANCE LEVEL",
          "CRITERIA",
          "SEVERITY",
        ],
      ];

      const mergedData: any = [];
      rules.forEach((rule: any, rule_index: number) => {
        data.forEach((issue: any, data_index: number) => {
          if (rule.ruleset_id === issue.code) {
            const format = {
              code: issue["code"],
              conformance_level: rule["conformance_level"],
              criteria_name: rule["wcag_criteria"],
              element: rule["element"],
              failing_issue_variable: rule["failing_issue_variable"],
              failing_technique: rule["failing_technique"],
              issues: [
                {
                  clip: { x: 0, y: 0, width: 0, height: 0 },
                  clipBase64: "",
                  code: issue["code"],
                  context: issue["context"],
                  elementTagName: issue["elementTagName"],
                  id: `${rule_index}-${data_index}`,
                  message: issue["message"],
                  recurrence: issue["recurrence"],
                  selector: issue["selector"],
                  type: issue["type"],
                  typeCode: issue["typeCode"],
                },
              ],
              message: issue["message"],
              occurences: 0,
              severity: rule["severity"],
            };

            const existingEntry = mergedData.find(
              (entry: any) => entry.code === issue.code
            );
            if (existingEntry) {
              existingEntry.issues.push(...format.issues);
            } else {
              mergedData.push(format);
            }
          }
        });
      });

      mergedData.sort((a: any, b: any) => {
        return (
          conformanceOrder[a.conformance_level] -
          conformanceOrder[b.conformance_level]
        );
      });

      mergedData?.forEach((issue: any) => {
        issue.issues?.forEach((item: any) => {
          const formattedParts: {
            FontSize?: string;
            FontWeight?: string;
            Foreground?: string;
            Background?: string;
            Ratio?: string;
          } = {};

          const regex = /(\w+)--([^=]+)/g;
          let match;

          while ((match = regex.exec(issue.message)) !== null) {
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
                  parseFloat(parseFloat(value.slice(0, -2)).toFixed(2)) + ":1";
                break;
              default:
                break;
            }
          }

          const attribute =
            issue.code !== "BB10575" &&
            issue.code !== "BB10615" &&
            issue.element === "Contrast"
              ? `Font-size: ${formattedParts["FontSize"]}, Font-weight: ${formattedParts["FontWeight"]}, Foreground Color: ${formattedParts["Foreground"]}, Background Color: ${formattedParts["Background"]}, Ratio: ${formattedParts["Ratio"]}`
              : item.message;

          const codeSnippet =
            item.context?.length > 300
              ? item.context?.split(">")[0] + "> . . . </" + item.context?.slice(1).split(" ")[0].split(">")[0] + ">"
              : item.context;

          const dataformat = [
            issue.failing_technique,
            item.elementTagName,
            codeSnippet,
            attribute,
            issue.conformance_level,
            issue.criteria_name,
            issue.severity,
          ];

          excelData.push(dataformat);
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

  return (
    <div>
      <IconButton
        appearance="textLink"
        isIconOnly={true}
        onPress={handleDownload}
        aria-label="Download CSV"
      >
        <DownloadIcon width={24} height={24} className="text-neutral-800" />
      </IconButton>
    </div>
  );
};

export default DownloadCSV;
