/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Button, Chip, IconButton } from "@trail-ui/react";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from "@trail-ui/icons";
import { Issues, IssueItems } from "./Extension";
import { numberToAlphabet, getAltText, formatInput } from "./utils";

interface CheckboxTableProps {
  data: Issues;
  issueType: "errors" | "warnings" | "pass" | "notices";
}

interface DropdownState {
  id: string;
  isExpanded: boolean;
}

const CheckboxTable = ({ data, issueType }: CheckboxTableProps) => {
  const [issueCount, setIssueCount] = useState<number>(0);
  const [activePopup, setActivePopup] = useState<string>("");
  const [dropdownStates, setDropdownStates] = useState<DropdownState[]>([]);

  // To count the total number of individual issues
  useEffect(() => {
    const totalIssuesCount = () => {
      let count = 0;
      data.issues[issueType].forEach((item) => {
        count += item.issues.length;
      });
      setIssueCount(count);
    };

    totalIssuesCount();
  }, [data, issueType]);

  const updatedStates: DropdownState[] = [];

  // To assign initial state for dropdown
  useEffect(() => {
    data.issues[issueType].forEach((item) => {
      updatedStates.push({ id: item.id, isExpanded: true });
      setDropdownStates(updatedStates);
    });
  }, []);

  // To handle accordion dropdown click
  const handleDropdownClick = useCallback(
    (issue: IssueItems, id: string) => {
      const currentDropdown = dropdownStates.find((item) => item.id === id);

      setDropdownStates((prevStates) => {
        const updatedStates = prevStates.filter((state) => state.id !== id);
        updatedStates.push({ id, isExpanded: !currentDropdown?.isExpanded });
        return updatedStates;
      });

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
      // console.log("Code copied successfully");
      handleShowPopup(id);
    });
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
    // console.log("Focus Element ID :---", elementId);
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
        styleElement.innerText = `.${className} { outline: 2px solid red !important; background: yellow !important; }`;
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
        }, 2000);
      },
      args: [elementId],
    });
  };


  return (
    <>
      {data.issues[issueType].length ? (
        <>
          <div className="flex items-center justify-between py-4">
            <span className="font-semibold text-lg">
              Level A (Conformance Level)
            </span>
            <Chip
              variant="solid"
              color="purple"
              size="lg"
              radius="full"
              children={`${issueCount} ${
                issueCount === 1 ? "Instance" : "Instances"
              }`}
              classNames={{
                content: "font-medium",
                base: "hover:bg-purple-100 active:bg-purple-100",
              }}
            />
          </div>
          <div className="overflow-hidden rounded border border-neutral-300">
            <table className="table">
              <th className="table-header-group w-20 h-10 font-medium border-b border-neutral-300 bg-neutral-100 text-left">
                <td className="table-cell p-1 w-20 align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">ID</p>
                </td>
                <td className="table-cell p-1 w-20 align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">Element</p>
                </td>
                <td className="table-cell p-1 w-[120px] align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">Screenshot</p>
                </td>
                <td className="table-cell p-1 w-[160px] align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">Code</p>
                </td>
                <td className="table-cell p-1 w-[122px] align-middle">
                  <p className="font-medium text-base pl-1">Attribute</p>
                </td>
              </th>
              <tbody>
                {data.issues[issueType].map((issue, parentIndex) => (
                  <>
                    <tr className={`border-b border-neutral-300`}>
                      <td className="table-cell p-0" colSpan={5}>
                        <button
                          aria-expanded={
                            dropdownStates.find(
                              (item) => item.id === issue.id && item.isExpanded
                            )
                              ? false
                              : true
                          }
                          onClick={() => handleDropdownClick(issue, issue.id)}
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
                                  item.id === issue.id && item.isExpanded
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
                      </td>
                    </tr>
                    {issue.issues.map((issueItem, index) => (
                      <tr
                        id={issueItem.id}
                        className={`text-base border-b border-neutral-300 hidden last:border-none`}
                      >
                        <td className="border-r border-neutral-300 w-[80px] p-2">
                          <Button
                            appearance="link"
                            spacing="none"
                            className="text-left"
                            isDisabled={!issueItem.selector}
                            onPress={() => focusElement(issueItem.selector)}
                          >
                            <p className="w-[63.5px]">Id-{index + 1}</p>
                          </Button>
                        </td>
                        <td className="table-cell border-r border-neutral-300 text-sm p-2">
                          <p>
                            <span>{`<${issueItem.elementTagName}>`}</span>
                          </p>
                        </td>
                        <td className="table-cell w-[120.5px] text-sm border-r border-neutral-300 p-2">
                          {issueItem.clipBase64 === "" ? (
                            <p className="text-center">No Image</p>
                          ) : (
                            <img
                              className="h-10 w-full object-contain"
                              src={`data:image/png;base64,${issueItem.clipBase64}`}
                              alt={`${getAltText(issueType)}-${numberToAlphabet(
                                parentIndex + 1
                              )}${index + 1}`}
                            />
                          )}
                        </td>
                        <td className="table-cell p-2 pr-[1px] border-r border-neutral-300 relative font-sourceCode">
                          <section
                            className="h-14 w-[150px] text-sm pr-10 break-words overflow-y-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                            tabIndex={0}
                          >
                            {issueItem.context}
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
                            aria-label={`Copy ${index + 1} ${
                              issueItem.elementTagName
                            } code to clipboard`}
                          >
                            <CopyIcon
                              width={16}
                              height={16}
                              className="text-neutral-600"
                            />
                          </IconButton>

                          {activePopup === issueItem.id && (
                            <div className="absolute bottom-[110%] -right-[26%] bg-purple-600 text-sm font-poppins shadow-lg text-neutral-50 px-3 py-2.5 rounded">
                              Copied to Clipboard!
                            </div>
                          )}
                        </td>
                        <td className="table-cell p-2 ">
                          <section
                            className="w-[104px] h-[62px] text-left font-poppins break-words text-sm overflow-y-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                            tabIndex={0}
                          >
                            {issue.element === "Contrast" &&
                            issue.code !== "BB10575" &&
                            issue.code !== "BB10615" ? (
                              <div className="flex flex-col gap-1">
                                <div>
                                  <span className="font-semibold">
                                    {formatInput(issueItem.message).ratio}{" "}
                                  </span>
                                  <span>
                                    - {formatInput(issueItem.message).fontsize}{" "}
                                    {formatInput(issueItem.message).fontweight}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div
                                    title="Foreground Color"
                                    className="w-3.5 h-3.5 inline-block border border-neutral-300 bg-red"
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
                                    className="w-3.5 h-3.5 inline-block border border-neutral-300"
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
                              issueItem.message.toString()
                            )}
                          </section>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
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
