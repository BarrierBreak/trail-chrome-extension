/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Button, Chip, IconButton } from "@trail-ui/react";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from "@trail-ui/icons";
import { Conformance, IssueTypes } from "./Extension";
import { formatInput, getAltText } from "./utils";

interface CheckboxTableProps {
  data: any;
  rules: any;
}

interface DropdownState {
  id: string;
  isExpanded: boolean;
}

const CheckboxTable = ({ data, rules }: CheckboxTableProps) => {
  const [activePopup, setActivePopup] = useState<string>("");
  const [dropdownStates, setDropdownStates] = useState<DropdownState[]>([]);
  const updatedStates: DropdownState[] = [];

  const levelData: Conformance = {
    A: [],
    AA: [],
    AAA: [],
    BestPractice: [],
    Section508: [],
  };

  // To count the total number of instances of issues
  const getTotalInstanceCount = (data: any) => {
    let count = 0;
    data.forEach((element: any) => {
      count += element.issues.length;
    });
    return count;
  };

  const mergedData: any = [];

  const mergeIssuesAndRulesets = () => {
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

    mergedData.forEach((item: any) => {
      if (item.conformance_level === "A") {
        levelData.A.push(item);
      } else if (item.conformance_level === "AA") {
        levelData.AA.push(item);
      } else if (item.conformance_level === "AAA") {
        levelData.AAA.push(item);
      } else if (item.conformance_level === "Best Practices") {
        levelData.BestPractice.push(item);
      } else if (item.conformance_level === "508") {
        levelData.Section508.push(item);
      }
    });
  };

  mergeIssuesAndRulesets();

  // To assign initial state for dropdown
  useEffect(() => {
    Object.values(levelData)?.forEach((item) => {
      item?.forEach((issue) => {
        updatedStates.push({ id: issue.code, isExpanded: true });
        setDropdownStates(updatedStates);
      });
    });
  }, [data]);

  // To handle accordion dropdown click
  const handleDropdownClick = useCallback(
    (issue: IssueTypes, id: string) => {
      const currentDropdown = dropdownStates.find((item) => item.id === id);

      if (currentDropdown) {
        const updatedStates = dropdownStates.map((item) => {
          if (item.id === id) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          return item;
        });
        setDropdownStates(updatedStates);
      }

      issue.issues.forEach((item) => {
        const issueRows = document.getElementById(item.id);
        if (issueRows) {
          currentDropdown?.isExpanded
            ? (issueRows.style.display = "table-row")
            : (issueRows.style.display = "none");
        }
      });
    },
    [dropdownStates]
  );

  // To handle copy to clipboard functionality
  const handleCopyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      handleShowPopup(id);
    });

    setTimeout(() => {
      const copyElement = document.querySelector(".copy");
      if (copyElement) {
        copyElement.textContent = "Copied to Clipboard!";
      }
    }, 100);
  };

  // To handle displaying of copied to clipboard popup
  const handleShowPopup = (id: string) => {
    setActivePopup(id);
    setTimeout(() => {
      setActivePopup("");
    }, 3000);
  };

  // To focus on element functionality
  const focusElement = async (elementId: string) => {
    window.parent.postMessage("minimise-button-clicked", "*");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (elementId) => {
        const element = document.querySelector(elementId);
        const className = `focused-element-${Math.random()
          .toString(36)
          .substring(7)}`;
        const styleElement = document.createElement("style");
        styleElement.innerText = `.${className} { outline: 4px solid red !important; outline-offset: 8px; }`;
        document.body.appendChild(styleElement);

        /** @type {Element | null} */
        let lastFocusedElement = null;
        if (element) {
          lastFocusedElement = element;
          element.classList.add(className);
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // To keep the focus on the element for 2 seconds
        setTimeout(() => {
          if (lastFocusedElement) {
            lastFocusedElement.classList.remove(className);
          }
          styleElement.remove();
        }, 3000);
      },
      args: [elementId],
    });
  };

  const downloadScreenshot = (
    elementId: string,
    issue: string,
    failing_technique: string,
    index: number
  ) => {
    focusElement(elementId);
    const name = `${getAltText(issue)}-${failing_technique}-ID-${index + 1}`;

    setTimeout(() => {
      if (navigator.userAgent.indexOf("Mac OS X") != -1) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;

          chrome.tabs.sendMessage(tabId as number, {
            type: "CAPTURE_AREA",
            name: name,
            x: 0,
            y: 0,
            width: 3000,
            height: 1500,
          });
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;

          chrome.tabs.sendMessage(tabId as number, {
            type: "CAPTURE_AREA",
            name: name,
            x: 0,
            y: 0,
            width: 1400,
            height: 650,
          });
        });
      }
    }, 1000);
  };

  return (
    <>
      {data.length > 0 ? (
        <>
          {Object.values(levelData).map((item, index) => {
            return (
              <>
                {item.length > 0 && (
                  <>
                    <div
                      role="heading"
                      aria-level={2}
                      className="flex items-center justify-between py-4"
                    >
                      <span className="font-semibold text-lg">
                        Level {item[0]?.conformance_level} (Conformance Level)
                      </span>
                      <Chip
                        variant="solid"
                        color="purple"
                        size="lg"
                        radius="full"
                        children={`${getTotalInstanceCount(item)} ${
                          getTotalInstanceCount(item) === 1
                            ? "Instance"
                            : "Instances"
                        }`}
                        classNames={{
                          content: "font-medium",
                          base: "hover:bg-purple-100 active:bg-purple-100",
                        }}
                      />
                    </div>
                    <div className="overflow-hidden rounded border border-neutral-200">
                      <table className="table">
                        <tr className="table-header-group w-20 h-10 font-medium border-b border-neutral-200 bg-neutral-100 text-left">
                          <th
                            id="id"
                            scope="col"
                            className="table-cell p-1 w-20 align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">ID</p>
                          </th>
                          <th
                            id="element"
                            scope="col"
                            className="table-cell p-1 w-20 align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">
                              Element
                            </p>
                          </th>
                          <th
                            id="screenshot"
                            scope="col"
                            className="table-cell p-1 w-[120px] align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">
                              Screenshot
                            </p>
                          </th>
                          <th
                            id="code"
                            scope="col"
                            className="table-cell p-1 w-[160px] align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">Code</p>
                          </th>
                          <th
                            id="attribute"
                            scope="col"
                            className="table-cell p-1 w-[122px] align-middle"
                          >
                            <p className="font-medium text-base pl-1">
                              Attribute
                            </p>
                          </th>
                        </tr>

                        {item.map((issue: any, parentIndex: any) => (
                          <>
                            <tr className={`border-b border-neutral-200`}>
                              <th
                                id={`issue-${index + 1}-${parentIndex + 1}`}
                                scope="colgroup"
                                colSpan={5}
                                className="table-cell p-0"
                              >
                                <button
                                  aria-expanded={
                                    dropdownStates.find(
                                      (item) =>
                                        item.id === issue.code &&
                                        item.isExpanded
                                    )
                                      ? false
                                      : true
                                  }
                                  onClick={() =>
                                    handleDropdownClick(issue, issue.code)
                                  }
                                  className="p-2 pl-4 w-full focus-visible:outline-focus"
                                >
                                  <div className="flex gap-1 items-center justify-between">
                                    <p className="text-start font-semibold text-base">
                                      {`${parentIndex + 1}. ${
                                        issue.failing_technique
                                      } (${issue.issues.length} ${
                                        issue.issues.length === 1
                                          ? "instance"
                                          : "instances"
                                      })`}
                                    </p>
                                    <div className="h-6 w-6">
                                      {dropdownStates.find(
                                        (item) =>
                                          item.id === issue.code &&
                                          item.isExpanded
                                      ) ? (
                                        <ChevronDownIcon
                                          width={24}
                                          height={24}
                                          className="text-neutral-900"
                                        />
                                      ) : (
                                        <ChevronUpIcon
                                          width={24}
                                          height={24}
                                          className="text-neutral-900"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              </th>
                            </tr>
                            {issue.issues.map((issueItem: any, index: any) => (
                              <tr
                                id={issueItem.id}
                                className={`text-base border-b border-neutral-200 hidden last:border-none`}
                              >
                                <td
                                  headers="issue id"
                                  className="border-r border-neutral-200 w-[80px] p-2"
                                >
                                  <Button
                                    appearance="link"
                                    spacing="none"
                                    className="text-left"
                                    isDisabled={!issueItem.selector}
                                    onPress={() =>
                                      focusElement(issueItem.selector)
                                    }
                                  >
                                    <p className="w-[63.5px]">ID-{index + 1}</p>
                                  </Button>
                                </td>
                                <td
                                  headers="issue element"
                                  className="table-cell border-r border-neutral-200 text-sm p-2"
                                >
                                  <p>
                                    <span>{`<${issueItem.elementTagName}>`}</span>
                                  </p>
                                </td>
                                <td
                                  headers="issue screenshot"
                                  className="table-cell w-[120.5px] text-sm text-center border-r border-neutral-200 p-2"
                                >
                                  <Button
                                    appearance="link"
                                    spacing="none"
                                    aria-label={`Download ${
                                      issue.failing_technique
                                    } ID-${index + 1} Screenshot`}
                                    isDisabled={!issueItem.selector}
                                    onPress={() =>
                                      downloadScreenshot(
                                        issueItem.selector,
                                        issueItem.type,
                                        issue.failing_technique,
                                        index
                                      )
                                    }
                                  >
                                    Download
                                  </Button>
                                </td>
                                <td
                                  headers="issue code"
                                  className="table-cell p-2 pr-[1px] border-r border-neutral-200 relative font-sourceCode"
                                >
                                  <section
                                    tabIndex={0}
                                    className="h-14 w-[150px] text-sm pr-10 break-words overflow-y-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                                  >
                                    {issueItem.context?.length > 300
                                      ? issueItem.context?.split(">")[0] +
                                        "> . . . </" +
                                        issueItem.context
                                          ?.slice(1)
                                          .split(" ")[0]
                                          .split(">")[0] +
                                        ">"
                                      : issueItem.context}
                                  </section>
                                  <IconButton
                                    className="absolute top-0.5 right-4"
                                    onPress={() =>
                                      handleCopyToClipboard(
                                        issueItem.context,
                                        issueItem.id
                                      )
                                    }
                                    isIconOnly={true}
                                    spacing="compact"
                                    aria-label={`Copy ${
                                      issue.failing_technique
                                    } ID-${index + 1} code to clipboard`}
                                  >
                                    <CopyIcon
                                      width={16}
                                      height={16}
                                      className="text-neutral-600"
                                    />
                                  </IconButton>
                                  {activePopup === issueItem.id && (
                                    <span
                                      aria-live="polite"
                                      className="copy absolute bottom-[110%] -right-[28%] bg-purple-600 text-sm font-poppins shadow-lg text-neutral-50 px-3 py-2.5 rounded"
                                    ></span>
                                  )}
                                </td>
                                <td
                                  headers="issue attribute"
                                  className="table-cell p-2 "
                                >
                                  <section
                                    tabIndex={0}
                                    className="w-[104px] h-[62px] text-left font-poppins break-words text-sm overflow-y-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                                  >
                                    {issue.element === "Contrast" &&
                                    issue.code !== "BB10575" &&
                                    issue.code !== "BB10615" ? (
                                      <div className="flex flex-col gap-1">
                                        <div>
                                          <span className="font-semibold">
                                            {
                                              formatInput(issueItem.message)
                                                .ratio
                                            }{" "}
                                          </span>
                                          <span>
                                            -{" "}
                                            {
                                              formatInput(issueItem.message)
                                                .fontsize
                                            }{" "}
                                            {
                                              formatInput(issueItem.message)
                                                .fontweight
                                            }
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <div
                                            title="Foreground Color"
                                            className="w-3.5 h-3.5 inline-block border border-neutral-200 bg-red"
                                            style={{
                                              backgroundColor: `${formatInput(
                                                issueItem.message
                                              ).fg.substring(0, 7)}`,
                                            }}
                                          ></div>
                                          <span>
                                            {formatInput(issueItem.message).fg}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <div
                                            title="Background Color"
                                            className="w-3.5 h-3.5 inline-block border border-neutral-200"
                                            style={{
                                              backgroundColor: `${formatInput(
                                                issueItem.message
                                              ).bg.substring(0, 7)}`,
                                            }}
                                          ></div>
                                          <span>
                                            {formatInput(issueItem.message).bg}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      issueItem.message?.toString()
                                    )}
                                  </section>
                                </td>
                              </tr>
                            ))}
                          </>
                        ))}
                      </table>
                    </div>
                  </>
                )}
              </>
            );
          })}
        </>
      ) : (
        <div className="h-[600px] flex items-center justify-center">
          <p className="text-base">Nothing to display!</p>
        </div>
      )}
    </>
  );
};

export default CheckboxTable;
