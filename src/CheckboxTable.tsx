/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Chip, IconButton } from "@trail-ui/react";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from "@trail-ui/icons";
import { Issues, IssueItems } from "./Extension";

interface CheckboxTableProps {
  data: Issues;
  issueType: "errors" | "warnings" | "pass" | "notices";
  sendDataToParent: (
    data: {
      id: string;
      data: IssueItems;
    }[]
  ) => void;
}

interface DropdownState {
  id: string;
  isExpanded: boolean;
}

// To convert rgb to hex with opacity
export const rgbToHexWithOpacity = (rgb: string): string => {
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  const opacity = Math.round(0.05 * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}${opacity}`;
};

const CheckboxTable = ({
  data,
  issueType,
  sendDataToParent,
}: CheckboxTableProps) => {
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const [selectedErrorsData, setSelectedErrorsData] = useState<
    { id: string; alt: string; data: IssueItems }[]
  >([]);

  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
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

  // To get corresponding alphabet character for from number
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

  // To get screenshot alt text
  const getAltText = (issueType: string) => {
    switch (issueType) {
      case "errors":
        return "Fail";
      case "warnings":
        return "Manual";
      case "pass":
        return "Pass";
      case "notices":
        return "BP";
      default:
        break;
    }
  };

  const updatedStates: DropdownState[] = [];

  // To assign initial state for dropdown
  useEffect(() => {
    data.issues[issueType].forEach((item) => {
      updatedStates.push({ id: item.id, isExpanded: false });
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

  // To check whether title checkbox should be selected
  const checkForTitleSelection = (
    parentIndex: number,
    updatedErrors: string[]
  ) => {
    const shouldParentBeSelected = data?.issues[issueType][
      parentIndex
    ].issues.every((checkbox) => updatedErrors.includes(checkbox.id));

    if (shouldParentBeSelected && data?.issues[issueType][parentIndex].id)
      setSelectedTitles((prev) => [
        ...prev,
        data?.issues[issueType][parentIndex].id,
      ]);
  };

  // To check whether title checkbox should be deselected
  const checkForTitleDeselection = (parentIndex: number) => {
    const id = data?.issues[issueType][parentIndex].id;

    if (selectedTitles.includes(id as string)) {
      setSelectedTitles((prev) => prev.filter((item) => item !== id));
    }
  };

  // To handle individual error checkbox click
  const handleErrorClick = (id: string, index: number, parentIndex: number) => {
    const isSelected = selectedErrors.includes(id);

    if (isSelected) {
      setSelectedErrors(selectedErrors.filter((key) => key !== id));

      setSelectedErrorsData(
        selectedErrorsData.filter((error) => error.id !== id)
      );

      checkForTitleDeselection(parentIndex);
    } else {
      const updatedErrors = [...selectedErrors, id];
      setSelectedErrors(updatedErrors);

      const updatedErrorsData = [
        ...selectedErrorsData,
        {
          id: id,
          alt: `${getAltText(issueType)}-${numberToAlphabet(parentIndex + 1)}${
            index + 1
          }`,
          data: data.issues[issueType][parentIndex],
        },
      ];
      setSelectedErrorsData(updatedErrorsData);

      checkForTitleSelection(parentIndex, updatedErrors);
    }
  };

  useEffect(() => {
    handleClick(selectedErrorsData);
  }, [selectedErrorsData]);

  // To handle title checkbox click
  const handleTitleClick = (
    issues: IssueItems,
    titleId: string,
    parentIndex: number
  ) => {
    const isSelected = selectedTitles.includes(titleId);

    const updatedTitles = isSelected
      ? selectedTitles.filter((key) => key !== titleId)
      : [...selectedTitles, titleId];

    let updatedErrors: string[] = [...selectedErrors];
    let updatedErrorsData: { id: string; alt: string; data: IssueItems }[] = [
      ...selectedErrorsData,
    ];
    const allIssueIds = issues.issues.map((item) => item.id);
    let newdata: { id: string; alt: string; data: IssueItems }[] = [];

    if (isSelected) {
      updatedErrors = updatedErrors.filter((id) => !allIssueIds.includes(id));
      updatedErrorsData = selectedErrorsData.filter(
        (error) => !allIssueIds.includes(error.id)
      );
    } else {
      updatedErrors = [...new Set([...updatedErrors, ...allIssueIds])];

      data.issues[issueType][parentIndex].issues.forEach((item, index) => {
        newdata = [
          ...newdata,
          {
            id: item.id,
            alt: `${getAltText(issueType)}-${numberToAlphabet(
              parentIndex + 1
            )}${index + 1}`,
            data: data.issues[issueType][parentIndex],
          },
        ];
      });

      const combinedArray = [...selectedErrorsData, ...newdata];
      const uniqueItems: any = {};

      combinedArray.forEach((item) => {
        uniqueItems[item.id] = item;
      });

      updatedErrorsData = Object.values(uniqueItems);
    }

    setSelectedTitles(updatedTitles);
    setSelectedErrors(updatedErrors);
    setSelectedErrorsData(updatedErrorsData);
  };

  // To check whether all available errors are selected or not
  const isAllErrorSelected = (issues: IssueItems): number => {
    return issues.issues.filter((item) => selectedErrors.includes(item.id))
      .length;
  };

  // To handle table header checkbox click
  const handleHeaderClick = () => {
    if (data) {
      if (selectedTitles.length === data?.issues[issueType].length) {
        setSelectedTitles([]);
        setSelectedErrors([]);
        setSelectedErrorsData([]);
      } else {
        setSelectedTitles(data.issues[issueType].map((item) => item.id));
        setSelectedErrors(
          data.issues[issueType].flatMap((item) =>
            item.issues.map((issue) => issue.id)
          )
        );

        let alldata: any = [];

        data.issues[issueType].forEach((item, index) => {
          item.issues.forEach((issue, issueIndex) => {
            alldata = [
              ...alldata,
              {
                id: issue.id,
                alt: `${getAltText(issueType)}-${numberToAlphabet(index + 1)}${
                  issueIndex + 1
                }`,
                data: item,
              },
            ];
          });
        });

        setSelectedErrorsData(alldata);
      }
    }
  };

  // To format value for Attribute column
  const formatAttributes = (input: string): any => {
    const parts = input.split("==");

    const formattedParts: {
      FontSize?: string;
      FontWeight?: string;
      Foreground?: string;
      Background?: string;
      Ratio?: string;
    } = {};

    parts.forEach((part) => {
      const [key, value] = part.split("-");
      switch (key) {
        case "fontsize":
          formattedParts["FontSize"] = `${parseInt(value)}px`;
          break;
        case "fontweight":
          formattedParts["FontWeight"] = parseInt(value) >= 700 ? "Bold" : "";
          break;
        case "forec":
          formattedParts["Foreground"] = rgbToHexWithOpacity(value);
          break;
        case "backc":
          formattedParts["Background"] = rgbToHexWithOpacity(value);
          break;
        case "ratio":
          formattedParts["Ratio"] =
            parseFloat(parseFloat(value.slice(0, -2)).toFixed(2)) + ":1";
          break;
        default:
          break;
      }
    });

    const fontSize = formattedParts["FontSize"];
    const fontWeight = formattedParts["FontWeight"];
    const fg = formattedParts["Foreground"];
    const bg = formattedParts["Background"];
    const ratio = formattedParts["Ratio"];

    return { fontSize, fontWeight, fg, bg, ratio };
  };

  // To focus on element functionality
  const focusElement = async (elementId: string) => {
    // console.log("Focus Element ID :---", elementId);
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

  const handleClick = (
    childData: {
      id: string;
      data: IssueItems;
    }[]
  ) => {
    sendDataToParent(childData);
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
                issueCount === 1 ? "Issue" : "Issues"
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
                <td className="p-0 w-10 align-middle border-r border-neutral-300">
                  <Checkbox
                    classNames={{ control: "m-3", base: "p-0 m-0" }}
                    isSelected={
                      selectedTitles.length === data.issues[issueType].length
                    }
                    isIndeterminate={
                      selectedTitles.length > 0 &&
                      selectedTitles.length !== data.issues[issueType].length
                    }
                    onChange={() => handleHeaderClick()}
                    aria-label="Select All"
                  />
                </td>
                <td className="table-cell p-1 w-20 align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">Element</p>
                </td>
                <td className="table-cell p-1 w-[140px] align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">Screenshot</p>
                </td>
                <td className="table-cell p-1 w-[177px] align-middle border-r border-neutral-300">
                  <p className="font-medium text-base pl-1">Code</p>
                </td>
                <td className="table-cell p-1 w-[125px] align-middle">
                  <p className="font-medium text-base pl-1">Attribute</p>
                </td>
              </th>
              <tbody>
                {data.issues[issueType].map((issue, parentIndex) => (
                  <>
                    <tr
                      className={`border-b border-neutral-300 ${
                        selectedTitles.includes(issue.id) ||
                        isAllErrorSelected(issue) === issue.issues.length
                          ? "bg-purple-50"
                          : "bg-neutral-50"
                      }`}
                    >
                      <td
                        key="selection"
                        className="p-0 w-10 border-r border-b border-neutral-300"
                      >
                        <Checkbox
                          classNames={{ control: "m-3", base: "p-0 m-0" }}
                          isSelected={
                            isAllErrorSelected(issue) === issue.issues.length
                          }
                          isIndeterminate={
                            isAllErrorSelected(issue) !== 0 &&
                            isAllErrorSelected(issue) !== issue.issues.length
                          }
                          onChange={() =>
                            handleTitleClick(issue, issue.id, parentIndex)
                          }
                          aria-label={`${issue.failing_technique}`}
                        />
                      </td>
                      <td className="table-cell p-0" colSpan={4}>
                        <button
                          aria-expanded={
                            dropdownStates.find(
                              (item) => item.id === issue.id && item.isExpanded
                            )
                              ? false
                              : true
                          }
                          onClick={() => handleDropdownClick(issue, issue.id)}
                          className="p-2 w-full focus-visible:outline-focus"
                        >
                          <div className="flex gap-1 items-center justify-between">
                            <p className="text-start font-semibold text-base">
                              {`${numberToAlphabet(parentIndex + 1)}. ${
                                issue.failing_technique
                              } (${issue.issues.length} ${
                                issue.issues.length === 1
                                  ? "Instance"
                                  : "Instances"
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
                        className={`text-base border-b border-neutral-300 last:border-none ${
                          selectedErrors.includes(issueItem.id)
                            ? "bg-purple-50"
                            : ""
                        }`}
                      >
                        <td
                          key="selection"
                          className="border-r border-neutral-300 p-0"
                        >
                          <Checkbox
                            classNames={{ control: "m-3", base: "p-0 m-0" }}
                            isSelected={selectedErrors.includes(issueItem.id)}
                            onChange={() =>
                              handleErrorClick(issueItem.id, index, parentIndex)
                            }
                            aria-label={`${index + 1} ${
                              issueItem.elementTagName
                            }`}
                          />
                        </td>
                        <td className="table-cell border-r border-neutral-300 text-sm p-2">
                          <p className="w-[63px]">
                            {`${index + 1}. `}
                            <Button
                              appearance="link"
                              spacing="none"
                              isDisabled={!issueItem.selector}
                              onPress={() => focusElement(issueItem.selector)}
                            >
                              <span>{`<${issueItem.elementTagName}>`}</span>
                            </Button>
                          </p>
                        </td>
                        <td className="table-cell text-sm border-r border-neutral-300 p-2">
                          <img
                            className="h-10 w-[123px] object-contain"
                            src={`data:image/png;base64,${issueItem.clipBase64}`}
                            alt={`${getAltText(issueType)}-${numberToAlphabet(
                              parentIndex + 1
                            )}${index + 1}`}
                          />
                        </td>
                        <td className="table-cell p-2 pr-[1px] border-r border-neutral-300 relative font-sourceCode">
                          <section
                            className="h-14 w-[167px] text-sm pr-10 break-words overflow-y-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
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
                          <p className="text-sm w-[108px] text-left font-poppins break-words">
                            <p>
                              {issueItem.message.split("==").length === 1 ? (
                                issueItem.message
                              ) : (
                                <div className="flex flex-col gap-1">
                                  <div>
                                    <span className="font-semibold">
                                      {
                                        formatAttributes(issueItem.message)
                                          .ratio
                                      }{" "}
                                    </span>
                                    <span>
                                      -{" "}
                                      {
                                        formatAttributes(issueItem.message)
                                          .fontSize
                                      }{" "}
                                      {
                                        formatAttributes(issueItem.message)
                                          .fontWeight
                                      }
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div
                                      title="Foreground Color"
                                      className="w-3.5 h-3.5 inline-block border border-neutral-300"
                                      style={{
                                        backgroundColor: `${formatAttributes(
                                          issueItem.message
                                        ).fg.slice(0, 7)}`,
                                      }}
                                    ></div>
                                    <span>
                                      {formatAttributes(issueItem.message).fg}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div
                                      title="Background Color"
                                      className="w-3.5 h-3.5 inline-block border border-neutral-300"
                                      style={{
                                        backgroundColor: `${formatAttributes(
                                          issueItem.message
                                        ).bg.slice(0, 7)}`,
                                      }}
                                    ></div>
                                    <span>
                                      {formatAttributes(issueItem.message).bg}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </p>
                          </p>
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
