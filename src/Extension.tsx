import {
  CloseIcon,
  DownloadIcon,
  ExportIcon,
  WarningIcon,
} from "@trail-ui/icons";
import {
  Button,
  Checkbox,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@trail-ui/react";
import { useEffect, useState } from "react";

interface IssueItems {
  issues: {
    clip: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    clipBase64: string;
    code: string;
    context: string;
    elementTagName: string;
    id: string;
    message: string;
    recurrence: number;
    selector: string;
    type: string;
    typeCode: number;
  }[];
}

interface Issues {
  issues: {
    errors: {
      code: string;
      conformance_level: string;
      criteria_name: string;
      element: string;
      failing_issue_variable: string;
      failing_technique: string;
      id: string;
      issues: {
        clip: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        clipBase64: string;
        code: string;
        context: string;
        elementTagName: string;
        id: string;
        message: string;
        recurrence: number;
        selector: string;
        type: string;
        typeCode: number;
      }[];
      message: string;
      occurences: string;
      rule_name: string;
      severity: string;
    }[];
    warnings: {
      code: string;
      conformance_level: string;
      criteria_name: string;
      element: string;
      failing_issue_variable: string;
      failing_technique: string;
      id: string;
      issues: {
        clip: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        clipBase64: string;
        code: string;
        context: string;
        elementTagName: string;
        id: string;
        message: string;
        recurrence: number;
        selector: string;
        type: string;
        typeCode: number;
      }[];
      message: string;
      occurences: string;
      rule_name: string;
      severity: string;
    }[];
  };
}

function Extension() {
  const [responseData, setResponseData] = useState<Issues>();
  const [isLoading, setIsLoading] = useState(false);

  const [html, setHtml] = useState("");
  const apiKey = localStorage.getItem("authtoken");

  const [failureErrors, setFailureErrors] = useState<string[]>([]);
  const [failureTitles, setFailureTitles] = useState<string[]>([]);
  const [warningErrors, setWarningErrors] = useState<string[]>([]);
  const [warningTitles, setWarningTitles] = useState<string[]>([]);

  useEffect(() => {
    async function getCurrentTabHtmlSource() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id! },
          func: () => {
            const html = document.documentElement.outerHTML;
            return html;
          },
        },
        (results) => {
          setHtml(results[0].result as string);
        }
      );
    }

    getCurrentTabHtmlSource();
  }, []);

  const postData = async () => {
    setIsLoading(true);

    // to get html structure of webpage
    const htmlDocument = new DOMParser().parseFromString(html, "text/html");

    // to remove html element having id as 'trail-btn' from DOM
    const element = htmlDocument.querySelector("#trail-btn");
    if (element) {
      element.remove();
    }

    // to fetch a11y results of webpage
    await fetch("https://trail-api.barrierbreak.com/api/test-html", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "User-Agent": "BarrierBreak Client (https://www.barrierbreak.com)",
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: htmlDocument.documentElement.outerHTML,
        element: "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setResponseData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClose = () => {
    window.parent.postMessage("close-button-clicked", "*");
  };

  const handleTestResults = () => {
    postData();
  };

  const numberToAlphabet = (num: number): string => {
    if (num < 1) {
      console.error("Number must be greater than or equal to 1");
    }

    let result = "";
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }

    return result;
  };

  const checkForFailureTitleSelection = (
    parentIndex: number,
    updatedErrors: string[]
  ) => {
    const shouldParentBeSelected = responseData?.issues.errors[
      parentIndex
    ].issues.every((checkbox) => updatedErrors.includes(checkbox.id));

    if (shouldParentBeSelected && responseData?.issues.errors[parentIndex].id)
      setFailureTitles((prev) => [
        ...prev,
        responseData?.issues.errors[parentIndex].id,
      ]);
  };

  const checkForWarningTitleSelection = (
    parentIndex: number,
    updatedErrors: string[]
  ) => {
    const shouldParentBeSelected = responseData?.issues.warnings[
      parentIndex
    ].issues.every((checkbox) => updatedErrors.includes(checkbox.id));

    if (shouldParentBeSelected && responseData?.issues.warnings[parentIndex].id)
      setWarningTitles((prev) => [
        ...prev,
        responseData?.issues.warnings[parentIndex].id,
      ]);
  };

  const checkForFailureTitleDeselection = (parentIndex: number) => {
    const id = responseData?.issues.errors[parentIndex].id;

    if (failureTitles.includes(id as string)) {
      setFailureTitles((prev) => prev.filter((item) => item !== id));
    }
  };

  const checkForWarningTitleDeselection = (parentIndex: number) => {
    const id = responseData?.issues.warnings[parentIndex].id;

    if (warningTitles.includes(id as string)) {
      setWarningTitles((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleFailureErrorClick = (id: string, parentIndex: number) => {
    const isSelected = failureErrors.includes(id);

    if (isSelected) {
      setFailureErrors(failureErrors.filter((key) => key !== id));
      checkForFailureTitleDeselection(parentIndex);
    } else {
      const updatedErrors = [...failureErrors, id];
      setFailureErrors(updatedErrors);
      checkForFailureTitleSelection(parentIndex, updatedErrors);
    }
  };

  const handleWarningErrorClick = (id: string, parentIndex: number) => {
    const isSelected = warningErrors.includes(id);

    if (isSelected) {
      setWarningErrors(warningErrors.filter((key) => key !== id));
      checkForWarningTitleDeselection(parentIndex);
    } else {
      const updatedErrors = [...warningErrors, id];
      setWarningErrors(updatedErrors);
      checkForWarningTitleSelection(parentIndex, updatedErrors);
    }
  };

  const handleFailureTitleClick = (issues: IssueItems, titleId: string) => {
    const isSelected = failureTitles.includes(titleId);

    const updatedTitles = isSelected
      ? failureTitles.filter((key) => key !== titleId)
      : [...failureTitles, titleId];

    let updatedErrors: string[] = [...failureErrors];
    const allIssueIds = issues.issues.map((item) => item.id);

    if (isSelected) {
      updatedErrors = updatedErrors.filter((id) => !allIssueIds.includes(id));
    } else {
      updatedErrors = [...new Set([...updatedErrors, ...allIssueIds])];
    }

    setFailureTitles(updatedTitles);
    setFailureErrors(updatedErrors);
  };

  const handleWarningTitleClick = (issues: IssueItems, titleId: string) => {
    const isSelected = warningTitles.includes(titleId);

    const updatedTitles = isSelected
      ? warningTitles.filter((key) => key !== titleId)
      : [...warningTitles, titleId];

    let updatedErrors: string[] = [...warningErrors];
    const allIssueIds = issues.issues.map((item) => item.id);

    if (isSelected) {
      updatedErrors = updatedErrors.filter((id) => !allIssueIds.includes(id));
    } else {
      updatedErrors = [...new Set([...updatedErrors, ...allIssueIds])];
    }

    setWarningTitles(updatedTitles);
    setWarningErrors(updatedErrors);
  };

  const isAllFailureErrorSelected = (issues: IssueItems): number => {
    return issues.issues.filter((item) => failureErrors.includes(item.id))
      .length;
  };

  const isAllWarningErrorSelected = (issues: IssueItems): number => {
    return issues.issues.filter((item) => warningErrors.includes(item.id))
      .length;
  };

  const handleFailureHeaderClick = () => {
    if (responseData) {
      if (failureTitles.length === responseData?.issues.errors.length) {
        setFailureTitles([]);
        setFailureErrors([]);
      } else {
        setFailureTitles(responseData.issues.errors.map((item) => item.id));
        setFailureErrors(
          responseData.issues.errors.flatMap((item) =>
            item.issues.map((issue) => issue.id)
          )
        );
      }
    }
  };

  const handleWarningHeaderClick = () => {
    if (responseData) {
      if (warningTitles.length === responseData?.issues.warnings.length) {
        setWarningTitles([]);
        setWarningErrors([]);
      } else {
        setWarningTitles(responseData.issues.warnings.map((item) => item.id));
        setWarningErrors(
          responseData.issues.warnings.flatMap((item) =>
            item.issues.map((issue) => issue.id)
          )
        );
      }
    }
  };

  return (
    <main>
      <div className="w-full">
        <div className="flex justify-between items-center border-b border-neutral-300 pt-[6px] pb-[6px] pl-6 pr-5">
          <div className="flex items-center">
            <svg
              className="mr-[6px]"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M18.5832 30.6917V33.8094H21.3669V30.6917C21.3669 26.9047 22.542 25.1239 33.2625 25.1239H39.3376C37.0734 33.6855 29.2761 40 20.0009 40C10.7256 40 2.86291 33.6321 0.634856 25.0189H18.0739V22.235H0.125593C0.0412887 21.5003 0 20.7536 0 20C0 19.2464 0.0412887 18.4997 0.125593 17.765H6.65662C12.2999 17.765 15.4931 17.3107 17.6816 16.201C20.1729 14.9363 21.3343 12.7787 21.3343 9.41329V6.29215H18.5504V9.41329C18.5504 13.1968 17.3754 14.9811 6.65662 14.9811H0.634856C2.86119 6.36442 10.6878 0 20.0009 0C29.3139 0 37.2025 6.41432 39.3909 15.0843H21.8435V17.8682H39.8864C39.9621 18.5702 40 19.2791 40 20C40 20.7932 39.9518 21.5726 39.8641 22.3417H33.2625C23.5261 22.3417 18.5832 23.6339 18.5832 30.6934V30.6917Z"
                fill="#5928ED"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="39"
              height="16"
              viewBox="0 0 39 16"
              fill="none"
            >
              <path
                d="M0.101074 3.62114V1.40676H10.387V3.62114H6.4481V15.3021H3.95768V3.62114H0.101074Z"
                fill="#302E38"
              />
              <path
                d="M10.4897 4.79113H12.4895L12.7348 6.29492C13.1835 5.12492 14.1834 4.47626 15.2034 4.47626C15.8151 4.47626 16.4486 4.62251 16.8368 4.87372L16.4083 6.94186C15.9999 6.73367 15.4908 6.56505 14.9597 6.56505C13.8574 6.56505 13.1432 7.46319 13.1028 8.67448V15.2987H10.6746V6.4601L10.4914 4.78769L10.4897 4.79113Z"
                fill="#302E38"
              />
              <path
                d="M17.2451 10.4966C17.2451 6.81796 19.0213 4.47798 22.5301 4.47798C23.2241 4.47798 24.7129 4.64488 26.1632 5.20923V13.2959L26.3666 15.3021H24.2643L24.1214 14.1941L24.0391 14.1734C23.488 14.989 22.5906 15.6153 21.2227 15.6153C18.1408 15.6153 17.2434 13.234 17.2434 10.4966H17.2451ZM23.7753 11.9797V6.56849C23.4694 6.42224 22.8561 6.27599 22.2242 6.27599C20.285 6.27599 19.633 8.15658 19.633 10.414C19.633 12.1277 20.0615 13.7777 21.7554 13.7777C23.0611 13.7777 23.7753 12.8796 23.7753 11.9814V11.9797Z"
                fill="#302E38"
              />
              <path
                d="M28.5088 1.76119C28.5088 1.0093 29.0599 0.381287 29.8968 0.381287C30.7337 0.381287 31.305 0.986933 31.305 1.76119C31.305 2.53545 30.7135 3.16174 29.8968 3.16174C29.0801 3.16174 28.5088 2.57675 28.5088 1.76119ZM31.1218 4.79113V15.3021H28.6936V4.79113H31.1218Z"
                fill="#302E38"
              />
              <path
                d="M33.6531 11.8952V0.778549H36.1014V11.8539C36.1014 13.1701 36.367 13.6502 37.2038 13.6502C37.592 13.6502 38.0406 13.5039 38.4692 13.3164L39.0002 14.9888C38.4289 15.3863 37.4492 15.6151 36.572 15.6151C33.8178 15.6151 33.6531 13.7758 33.6531 11.8952Z"
                fill="#302E38"
              />
            </svg>
          </div>
          <button onClick={handleClose}>
            <div className="w-8 h-8">
              <CloseIcon width={32} height={32} />
            </div>
          </button>
        </div>

        <div className="flex h-screen px-12 w-full">
          {responseData?.issues ? (
            <Tabs>
              <div className="flex items-center justify-between h-12">
                <TabList aria-label="History of Ancient Rome">
                  <Tab id="ERRORS">
                    <div className="flex items-center gap-[2px] font-medium text-sm h-12">
                      <CloseIcon
                        width={24}
                        height={24}
                        className="text-red-700"
                      />
                      <p>Failures ({responseData.issues.errors.length})</p>
                    </div>
                  </Tab>
                  <Tab id="WARNINGS">
                    <div className="flex items-center gap-[2px] font-medium text-sm h-12">
                      <WarningIcon
                        width={24}
                        height={24}
                        className="text-yellow-800"
                      />
                      <p>Warnings ({responseData.issues.warnings.length})</p>
                    </div>
                  </Tab>
                </TabList>
                <div className="flex gap-2">
                  <Button
                    className="font-medium"
                    appearance="text"
                    endContent={<DownloadIcon width={24} height={24} />}
                  >
                    CSV
                  </Button>
                  <Button
                    className="font-medium"
                    appearance="primary"
                    endContent={<ExportIcon width={24} height={24} />}
                  >
                    Export
                  </Button>
                </div>
              </div>
              <TabPanel id="ERRORS">
                <table className="table border">
                  <th className="table-header-group border border-neutral-200 bg-neutral-100 align-middle">
                    <td className="px-4 py-2">
                      <Checkbox
                        isSelected={
                          failureTitles.length ===
                          responseData.issues.errors.length
                        }
                        isIndeterminate={
                          failureTitles.length > 0 &&
                          failureTitles.length !==
                            responseData.issues.errors.length
                        }
                        onChange={() => handleFailureHeaderClick()}
                      />
                    </td>
                    <td className="table-cell p-1 h-10 border border-neutral-200">
                      <p className="font-medium text-sm">Element</p>
                    </td>
                    <td className="table-cell p-1 h-10 border border-neutral-200">
                      <p className="font-medium text-sm">Screenshot</p>
                    </td>
                    <td className="table-cell p-1 h-10 border border-neutral-200">
                      <p className="font-medium text-sm">Code</p>
                    </td>
                  </th>
                  <tbody>
                    {responseData?.issues.errors.map((issue, parentIndex) => (
                      <>
                        <tr
                          className={`${
                            failureTitles.includes(issue.id) ||
                            isAllFailureErrorSelected(issue) ===
                              issue.issues.length
                              ? "bg-neutral-100"
                              : "bg-neutral-50"
                          }`}
                        >
                          <td key="selection" className="px-4 py-2">
                            <Checkbox
                              isSelected={
                                isAllFailureErrorSelected(issue) ===
                                issue.issues.length
                              }
                              isIndeterminate={
                                isAllFailureErrorSelected(issue) !== 0 &&
                                isAllFailureErrorSelected(issue) !==
                                  issue.issues.length
                              }
                              onChange={() =>
                                handleFailureTitleClick(issue, issue.id)
                              }
                            />
                          </td>
                          <td className="table-cell p-2 border" colSpan={3}>
                            <h2 className="font-semibold">
                              {`${numberToAlphabet(parentIndex + 1)}. ${
                                issue.failing_technique
                              }`}
                            </h2>
                          </td>
                        </tr>

                        {issue.issues.map((issue, index) => (
                          <tr
                            key={issue.id}
                            className={`${
                              failureErrors.includes(issue.id)
                                ? "bg-neutral-100"
                                : ""
                            }`}
                          >
                            <td
                              key="selection"
                              className="border px-4 py-2 w-10"
                            >
                              <Checkbox
                                isSelected={failureErrors.includes(issue.id)}
                                onChange={() =>
                                  handleFailureErrorClick(issue.id, parentIndex)
                                }
                              />
                            </td>
                            <td className="table-cell border p-2 w-[100px]">
                              {` ${index + 1}. <${issue.elementTagName}>`}
                            </td>
                            <td className="table-cell border p-2 w-40">
                              <img
                                src={`data:image/png;base64,${issue.clipBase64}`}
                                alt="screenshot"
                              />
                            </td>
                            <td className="table-cell p-2 border w-[198px]">
                              <div className="h-20 w-52 overflow-y-scroll">
                                {issue.context}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel id="WARNINGS">
                <table className="table border">
                  <th className="table-header-group border border-neutral-200 bg-neutral-100 align-middle">
                    <td className="px-4 py-2">
                      <Checkbox
                        isSelected={
                          warningTitles.length ===
                          responseData.issues.warnings.length
                        }
                        isIndeterminate={
                          warningTitles.length > 0 &&
                          warningTitles.length !==
                            responseData.issues.warnings.length
                        }
                        onChange={() => handleWarningHeaderClick()}
                      />
                    </td>
                    <td className="table-cell p-1 h-10 border border-neutral-200">
                      <p className="font-medium text-sm">Element</p>
                    </td>
                    <td className="table-cell p-1 h-10 border border-neutral-200">
                      <p className="font-medium text-sm">Screenshot</p>
                    </td>
                    <td className="table-cell p-1 h-10 border border-neutral-200">
                      <p className="font-medium text-sm">Code</p>
                    </td>
                  </th>
                  <tbody>
                    {responseData?.issues.warnings.map((issue, parentIndex) => (
                      <>
                        <tr
                          className={`${
                            warningTitles.includes(issue.id) ||
                            isAllWarningErrorSelected(issue) ===
                              issue.issues.length
                              ? "bg-neutral-100"
                              : "bg-neutral-50"
                          }`}
                        >
                          <td key="selection" className="px-4 py-2">
                            <Checkbox
                              isSelected={
                                isAllWarningErrorSelected(issue) ===
                                issue.issues.length
                              }
                              isIndeterminate={
                                isAllWarningErrorSelected(issue) !== 0 &&
                                isAllWarningErrorSelected(issue) !==
                                  issue.issues.length
                              }
                              onChange={() =>
                                handleWarningTitleClick(issue, issue.id)
                              }
                            />
                          </td>
                          <td className="table-cell p-2 border" colSpan={3}>
                            <h2 className="font-semibold">
                              {`${numberToAlphabet(parentIndex + 1)}. ${
                                issue.failing_technique
                              }`}
                            </h2>
                          </td>
                        </tr>

                        {issue.issues.map((issue, index) => (
                          <tr
                            key={issue.id}
                            className={`${
                              warningErrors.includes(issue.id)
                                ? "bg-neutral-100"
                                : ""
                            }`}
                          >
                            <td
                              key="selection"
                              className="border px-4 py-2 w-10"
                            >
                              <Checkbox
                                isSelected={warningErrors.includes(issue.id)}
                                onChange={() =>
                                  handleWarningErrorClick(issue.id, parentIndex)
                                }
                              />
                            </td>
                            <td className="table-cell border p-2 w-[100px]">
                              {` ${index + 1}. <${issue.elementTagName}>`}
                            </td>
                            <td className="table-cell border p-2 w-40">
                              <img
                                src={`data:image/png;base64,${issue.clipBase64}`}
                                alt="screenshot"
                              />
                            </td>
                            <td className="table-cell p-2 border w-[198px]">
                              <div className="h-20 w-52 overflow-y-scroll">
                                {issue.context}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Button
                appearance="primary"
                onPress={handleTestResults}
                isLoading={isLoading}
              >
                Test Website
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Extension;
