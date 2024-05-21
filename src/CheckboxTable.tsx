import { useEffect, useState } from "react";
import { Button, Checkbox, Chip } from "@trail-ui/react";
import { ChevronDownIcon, CopyIcon } from "@trail-ui/icons";
import { Issues, IssueItems } from "./Extension";

interface CheckboxTableProps {
  data: Issues;
  issueType: "errors" | "warnings" | "pass" | "notices";
}

const CheckboxTable = ({ data, issueType }: CheckboxTableProps) => {
  const tableHeaders = ["Element", "Screenshot", "Code", "Action"];

  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [issueCount, setIssueCount] = useState<number>(0);
  const [activePopup, setActivePopup] = useState<string>("");

  useEffect(() => {
    // To count the total number of individual issues
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

  // To handle copy to clipboard functionality
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      console.log("Code copied successfully");
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
  const handleErrorClick = (id: string, parentIndex: number) => {
    const isSelected = selectedErrors.includes(id);

    if (isSelected) {
      setSelectedErrors(selectedErrors.filter((key) => key !== id));
      checkForTitleDeselection(parentIndex);
    } else {
      const updatedErrors = [...selectedErrors, id];
      setSelectedErrors(updatedErrors);
      checkForTitleSelection(parentIndex, updatedErrors);
    }
  };

  // To handle title checkbox click
  const handleTitleClick = (issues: IssueItems, titleId: string) => {
    const isSelected = selectedTitles.includes(titleId);

    const updatedTitles = isSelected
      ? selectedTitles.filter((key) => key !== titleId)
      : [...selectedTitles, titleId];

    let updatedErrors: string[] = [...selectedErrors];
    const allIssueIds = issues.issues.map((item) => item.id);

    if (isSelected) {
      updatedErrors = updatedErrors.filter((id) => !allIssueIds.includes(id));
    } else {
      updatedErrors = [...new Set([...updatedErrors, ...allIssueIds])];
    }

    setSelectedTitles(updatedTitles);
    setSelectedErrors(updatedErrors);
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
      } else {
        setSelectedTitles(data.issues[issueType].map((item) => item.id));
        setSelectedErrors(
          data.issues[issueType].flatMap((item) =>
            item.issues.map((issue) => issue.id)
          )
        );
      }
    }
  };

  // To focus on element functionality
  const focusElement = async (elementId: string) => {
    console.log("Focus Element ID :---", elementId);
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
          <div className="flex items-center justify-between py-4 border-t border-t-neutral-300">
            <span className="font-semibold text-base">
              Level A (Conformance Level)
            </span>
            <Chip
              variant="solid"
              color="purple"
              size="md"
              radius="full"
              children={`${issueCount} ${
                issueCount === 1 ? "Issue" : "Issues"
              }`}
              classNames={{
                base: "hover:bg-purple-100 active:bg-purple-100",
              }}
            />
          </div>
          <table className="table">
            <th className="table-header-group font-medium border border-neutral-300 bg-neutral-200 text-left">
              <td className="px-4 py-2 align-middle border border-neutral-300">
                <Checkbox
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
              {tableHeaders.map((item) => (
                <td className="table-cell p-1 h-10 border border-neutral-300 align-middle">
                  <p className="font-medium text-sm pl-1">{item}</p>
                </td>
              ))}
            </th>
            <tbody>
              {data.issues[issueType].map((issue, parentIndex) => (
                <>
                  <tr
                    className={`${
                      selectedTitles.includes(issue.id) ||
                      isAllErrorSelected(issue) === issue.issues.length
                        ? "bg-purple-50"
                        : "bg-neutral-50"
                    }`}
                  >
                    <td
                      key="selection"
                      className="px-4 py-2 border border-neutral-200"
                    >
                      <Checkbox
                        isSelected={
                          isAllErrorSelected(issue) === issue.issues.length
                        }
                        isIndeterminate={
                          isAllErrorSelected(issue) !== 0 &&
                          isAllErrorSelected(issue) !== issue.issues.length
                        }
                        onChange={() => handleTitleClick(issue, issue.id)}
                        aria-label={`${issue.failing_technique}`}
                      />
                    </td>
                    <td
                      className="table-cell p-2 border border-neutral-200"
                      colSpan={4}
                    >
                      <div className="flex gap-1 items-center justify-between">
                        <h2 className="font-bold">
                          {`${numberToAlphabet(parentIndex + 1)}. ${
                            issue.failing_technique
                          } (${issue.issues.length})`}
                        </h2>
                        <button
                          className="h-6 w-6 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1"
                          tabIndex={0}
                        >
                          <ChevronDownIcon
                            width={24}
                            height={24}
                            aria-label="Accordian"
                            aria-hidden="false"
                            role="img"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {issue.issues.map((issue, index) => (
                    <tr
                      key={issue.id}
                      className={`${
                        selectedErrors.includes(issue.id) ? "bg-purple-50" : ""
                      }`}
                    >
                      <td
                        key="selection"
                        className="border border-neutral-200 px-4 py-2 w-10"
                      >
                        <Checkbox
                          isSelected={selectedErrors.includes(issue.id)}
                          onChange={() =>
                            handleErrorClick(issue.id, parentIndex)
                          }
                          aria-label={`${index + 1} ${issue.elementTagName}`}
                        />
                      </td>
                      <td className="table-cell border border-neutral-200 p-2 w-[100px]">
                        {` ${index + 1}. <${issue.elementTagName}>`}
                      </td>
                      <td className="table-cell border border-neutral-200 p-2 w-40">
                        <img
                          src={`data:image/png;base64,${issue.clipBase64}`}
                          alt={`screenshot-${numberToAlphabet(
                            parentIndex + 1
                          )}${index + 1}`}
                        />
                      </td>
                      <td className="table-cell p-2 border border-neutral-200 w-[198px] relative font-sourceCode">
                        <section
                          className="h-20 w-52 overflow-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                          tabIndex={0}
                        >
                          {issue.context}
                        </section>
                        <button
                          className="absolute h-6 w-6 top-[1px] right-[1px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1"
                          onClick={() => handleCopy(issue.context, issue.id)}
                        >
                          <CopyIcon
                            width={24}
                            height={24}
                            className="text-neutral-600"
                            aria-label={`Copy ${index + 1} ${
                              issue.elementTagName
                            } code to clipboard`}
                            aria-hidden="false"
                            role="img"
                          />
                        </button>
                        {activePopup === issue.id && (
                          <div className="absolute -top-[50%] -right-[30%] bg-purple-100 shadow-md transition-all duration-500 ease-in-out border border-purple-600 text-purple-600 p-2.5 rounded">
                            Copied to Clipboard!
                          </div>
                        )}
                      </td>
                      <td className="table-cell p-2 border border-neutral-200 w-[198px] text-center">
                        <Button
                          appearance="link"
                          isDisabled={!issue.selector}
                          onPress={() => focusElement(issue.selector)}
                        >
                          Focus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
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
