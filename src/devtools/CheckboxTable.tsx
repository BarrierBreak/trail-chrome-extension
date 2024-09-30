/* eslint-disable @typescript-eslint/no-explicit-any */
import {useCallback, useEffect, useState} from 'react'
import {Button, Checkbox, Chip} from '@trail-ui/react'
import {ChevronDownIcon, ChevronUpIcon} from '@trail-ui/icons'
import {Conformance, Instance, IssueTypes} from './Extension'
import {formatInput, getAltText} from './utils'

interface CheckboxTableProps {
  data: any
  rules: any
  isCheckboxVisible?: boolean
  sendDataToExtension: (data: IssueTypes[]) => void
  issueType: string
}

interface DropdownState {
  id: string
  isExpanded: boolean
}

const CheckboxTable = ({
  data,
  rules,
  isCheckboxVisible,
  sendDataToExtension,
  issueType,
}: CheckboxTableProps) => {
  const [selectedInstances, setSelectedInstances] = useState<string[]>([])
  const [selectedTitles, setSelectedTitles] = useState<string[]>([])
  const [selectedData, setSelectedData] = useState<IssueTypes[]>([])
  const [dropdownStates, setDropdownStates] = useState<DropdownState[]>([])
  const updatedStates: DropdownState[] = []

  const levelData: Conformance = {
    A: [],
    AA: [],
    AAA: [],
    BestPractice: [],
    Section508: [],
  }

  let nothingToDisplay
  switch (issueType) {
    case 'fail':
      nothingToDisplay =
        'Great news! No errors were found. Please review the Manual tab for further details.'
      break
    case 'manual':
      nothingToDisplay = 'No manual checks were found!'
      break
    case 'pass':
      nothingToDisplay =
        'No passes were detected! Please review the Fail and Manual tabs for potential issues.'
      break
    case 'best-practice':
      nothingToDisplay =
        'All best practices are in place! Be sure to check other tabs for additional information.'
      break

    default:
      break
  }

  // To count the total number of instances of issues
  const getTotalInstanceCount = (data: any) => {
    let count = 0
    data.forEach((element: any) => {
      count += element.issues.length
    })
    return count
  }

  const mergedData: any = []

  const mergeIssuesAndRulesets = () => {
    rules.forEach((rule: any, rule_index: number) => {
      data.forEach((issue: any, data_index: number) => {
        if (rule.ruleset_id === issue.code) {
          const format = {
            code: issue['code'],
            conformance_level: rule['conformance_level'],
            criteria_name: rule['wcag_criteria'],
            element: rule['element'],
            failing_issue_variable: rule['failing_issue_variable'],
            failing_technique: rule['failing_technique'],
            issues: [
              {
                clip: {x: 0, y: 0, width: 0, height: 0},
                clipBase64: '',
                code: issue['code'],
                context: issue['context'],
                elementTagName: issue['elementTagName'],
                id: `${rule_index}-${data_index}`,
                message: issue['message'],
                recurrence: issue['recurrence'],
                selector: issue['selector'],
                type: issue['type'],
                typeCode: issue['typeCode'],
              },
            ],
            message: issue['message'],
            occurences: 0,
            severity: rule['severity'],
          }

          const existingEntry = mergedData.find(
            (entry: any) => entry.code === issue.code
          )

          existingEntry
            ? existingEntry.issues.push(...format.issues)
            : mergedData.push(format)
        }
      })
    })

    // if (movedData) {
    //   mergedData.push(movedData);
    //   console.log("movedData", movedData);
    // }
    // console.log("mergedData", mergedData);

    mergedData.forEach((item: any) => {
      if (item.conformance_level === 'A') {
        levelData.A.push(item)
      } else if (item.conformance_level === 'AA') {
        levelData.AA.push(item)
      } else if (item.conformance_level === 'AAA') {
        levelData.AAA.push(item)
      } else if (item.conformance_level === 'Best Practices') {
        levelData.BestPractice.push(item)
      } else if (item.conformance_level === '508') {
        levelData.Section508.push(item)
      }
    })
  }

  mergeIssuesAndRulesets()

  // To assign initial state for dropdown
  useEffect(() => {
    Object.values(levelData)?.forEach((item) => {
      item?.forEach((issue) => {
        updatedStates.push({id: issue.code, isExpanded: true})
        setDropdownStates(updatedStates)
      })
    })
  }, [data])

  // To handle accordion dropdown click
  const handleDropdownClick = useCallback(
    (issue: IssueTypes, id: string) => {
      const currentDropdown = dropdownStates.find((item) => item.id === id)

      if (currentDropdown) {
        const updatedStates = dropdownStates.map((item) => {
          if (item.id === id) {
            return {...item, isExpanded: !item.isExpanded}
          }
          return item
        })
        setDropdownStates(updatedStates)
      }

      issue.issues.forEach((item) => {
        const issueRows = window.document.getElementById(item.id)
        if (issueRows) {
          currentDropdown?.isExpanded
            ? (issueRows.style.display = 'table-row')
            : (issueRows.style.display = 'none')
        }
      })
    },
    [dropdownStates]
  )

  // To check whether title checkbox should be selected
  const checkForTitleSelection = (
    issue: IssueTypes,
    updatedErrors: string[]
  ) => {
    const shouldParentBeSelected = issue.issues.some((checkbox) =>
      updatedErrors.includes(checkbox.id)
    )

    if (shouldParentBeSelected && !selectedTitles.includes(issue.code)) {
      setSelectedTitles((prev) => [...prev, issue.code])
    }
  }

  // To check whether title checkbox should be deselected
  const checkForTitleDeselection = (issue: IssueTypes) => {
    selectedData.forEach((item) => {
      if (item.issues.length === 0) {
        setSelectedTitles(selectedTitles.filter((item) => item !== issue.code))
      }
    })
  }

  // To handle individual error checkbox click
  const handleErrorClick = (
    id: string,
    instance: Instance,
    parentIssue: IssueTypes
  ) => {
    parentIssue.issues = parentIssue.issues.filter((issue) => issue.id === id)
    const isSelected = selectedInstances.includes(id)

    if (isSelected) {
      setSelectedInstances(selectedInstances.filter((key) => key !== id))
      selectedData.forEach((item) => {
        if (item.code === instance.code) {
          item.issues = item.issues.filter((issue) => issue.id !== id)
        }
        if (item.issues.length === 0) {
          setSelectedData(
            selectedData.filter((item) => item.code !== instance.code)
          )
        }
      })

      checkForTitleDeselection(parentIssue)
    } else {
      const updatedErrors = [...selectedInstances, id]
      setSelectedInstances(updatedErrors)

      if (selectedData.some((item) => item.code === instance.code)) {
        selectedData.forEach((item) => {
          if (item.code === instance.code) {
            item.issues = [...item.issues, instance]
          }
        })
      } else {
        const updatedErrorsData = [...selectedData, parentIssue]
        setSelectedData(updatedErrorsData)
      }

      checkForTitleSelection(parentIssue, updatedErrors)
    }
  }

  useEffect(() => {
    sendDataToExtension(selectedData)
  }, [selectedData])

  // To handle title checkbox click
  const handleTitleClick = (issues: IssueTypes, titleCode: string) => {
    const isSelected = selectedTitles.includes(titleCode)

    const updatedTitles = isSelected
      ? selectedTitles.filter((title) => title !== titleCode)
      : [...selectedTitles, titleCode]

    let updatedErrors: string[] = [...selectedInstances]
    let updatedErrorsData: IssueTypes[] = [...selectedData]
    const allIssueIds = issues.issues.map((item: Instance) => item.id)
    let newdata: IssueTypes[] = []

    if (isSelected) {
      updatedErrors = selectedInstances.filter(
        (id) => !allIssueIds.includes(id)
      )
      updatedErrorsData = selectedData.filter(
        (error) => error.code !== issues.code
      )
    } else {
      updatedErrors = [...new Set([...updatedErrors, ...allIssueIds])]
      newdata = [...newdata, issues]
      updatedErrorsData = [...selectedData, ...newdata]
    }

    setSelectedTitles(updatedTitles)
    setSelectedInstances(updatedErrors)
    setSelectedData(updatedErrorsData)
  }

  // To check whether all available errors are selected or not
  const isAllErrorSelected = (issues: IssueTypes): number => {
    return issues.issues.filter((item) => selectedInstances.includes(item.id))
      .length
  }

  // To handle table header checkbox click
  const handleHeaderClick = (level: IssueTypes[]) => {
    if (selectedTitles.length === level.length) {
      setSelectedTitles([])
      setSelectedInstances([])
      setSelectedData([])
    } else {
      setSelectedTitles(level.map((item) => item.code))
      setSelectedInstances(
        level.flatMap((item) => item.issues.map((issue) => issue.id))
      )

      let alldata: any = []
      level.forEach((item) => {
        alldata = [...alldata, item]
      })

      setSelectedData(alldata)
    }
  }

  // To check the selection state of checkbox
  const checkIsSelected = (level: IssueTypes[]) => {
    return level.every((item) => selectedTitles.includes(item.code))
  }

  // To check the indeterminate state of checkbox
  const checkIsIndeterminate = (level: IssueTypes[]) => {
    return (
      level.some((item) => selectedTitles.includes(item.code)) &&
      !checkIsSelected(level)
    )
  }

  // To focus on element functionality
  const focusElement = async (elementId: string) => {
    window.parent.postMessage('minimise-button-clicked', '*')

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    chrome.scripting.executeScript({
      target: {tabId: tab.id!},
      func: (elementId) => {
        const element = window.document.querySelector(elementId)
        const className = `focused-element-${Math.random()
          .toString(36)
          .substring(7)}`
        const styleElement = window.document.createElement('style')
        styleElement.innerText = `.${className} { outline: 4px solid red !important; outline-offset: 8px; }`
        window.document.body.appendChild(styleElement)

        chrome.runtime.sendMessage({
          type: 'INSPECT',
          payload: elementId,
        })

        /** @type {Element | null} */
        let lastFocusedElement = null
        if (element) {
          lastFocusedElement = element
          element.classList.add(className)
          element.scrollIntoView({behavior: 'smooth', block: 'center'})
        }

        // To keep the focus on the element for 2 seconds
        setTimeout(() => {
          if (lastFocusedElement) {
            lastFocusedElement.classList.remove(className)
          }
          styleElement.remove()
        }, 3000)
      },
      args: [elementId],
    })
  }

  const downloadScreenshot = (
    elementId: string,
    issue: string,
    failing_technique: string,
    index: number
  ) => {
    focusElement(elementId)
    const name = `${getAltText(issue)}-${failing_technique}-ID-${index + 1}`

    chrome.runtime.sendMessage(
      {
        type: 'capture-screenshot-node',
        payload: elementId,
      },
      (response) => {
        console.log(response)
      }
    )

    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tabId = tabs[0].id

        chrome.tabs.sendMessage(tabId as number, {
          type: 'CAPTURE_AREA',
          name: name,
          x: 0,
          y: 0,
          width: 3000,
          height: 1500,
        })
      })
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tabId = tabs[0].id

        chrome.tabs.sendMessage(tabId as number, {
          type: 'CAPTURE_AREA',
          name: name,
          x: 0,
          y: 0,
          width: 1400,
          height: 650,
        })
      })
    }
  }

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
                      className="flex items-center justify-between py-4 first:pt-0"
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
                            ? 'Instance'
                            : 'Instances'
                        }`}
                        classNames={{
                          content: 'font-medium',
                          base: 'hover:bg-purple-100 active:bg-purple-100',
                        }}
                      />
                    </div>
                    <div className="overflow-hidden rounded border border-neutral-200">
                      <table className="table table-fixed w-full min-w-[400px]">
                        <tr className="table-header-group h-10 font-medium border-b border-neutral-200 bg-neutral-100 text-left">
                          {isCheckboxVisible && (
                            <th className="p-0 w-10 align-middle border-r border-neutral-200">
                              <Checkbox
                                classNames={{control: 'm-3', base: 'p-0 m-0'}}
                                isSelected={checkIsSelected(item)}
                                isIndeterminate={checkIsIndeterminate(item)}
                                onChange={() => handleHeaderClick(item)}
                                aria-label={`Select All Issues in Conformance Level ${item[0]?.conformance_level}`}
                              />
                            </th>
                          )}

                          <th
                            id="id"
                            scope="col"
                            className="table-cell p-1 w-[80px] align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">ID</p>
                          </th>
                          <th
                            id="element"
                            scope="col"
                            className="table-cell p-1 w-[80px] align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">
                              Element
                            </p>
                          </th>
                          <th
                            id="screenshot"
                            scope="col"
                            className="table-cell p-1 min-w-[120px] w-[45%] align-middle border-r border-neutral-200"
                          >
                            <p className="font-medium text-base pl-1">
                              Screenshot
                            </p>
                          </th>
                          <th
                            id="attribute"
                            scope="col"
                            className="table-cell p-1 min-w-[120px] w-[45%] align-middle"
                          >
                            <p className="font-medium text-base pl-1">
                              Attribute
                            </p>
                          </th>
                        </tr>

                        {item.map((issue: any, parentIndex: any) => (
                          <>
                            <tr
                              className={`border-b border-neutral-200 ${
                                selectedTitles.includes(issue.code) ||
                                isAllErrorSelected(issue) ===
                                  issue.issues.length
                                  ? 'bg-purple-50'
                                  : ''
                              }`}
                            >
                              {isCheckboxVisible && (
                                <td className="p-0 w-10 border-r border-neutral-200">
                                  <Checkbox
                                    classNames={{
                                      control: 'm-3',
                                      base: 'p-0 m-0',
                                    }}
                                    isSelected={
                                      isAllErrorSelected(issue) ===
                                      issue.issues.length
                                    }
                                    isIndeterminate={
                                      isAllErrorSelected(issue) !== 0 &&
                                      isAllErrorSelected(issue) !==
                                        issue.issues.length
                                    }
                                    onChange={() =>
                                      handleTitleClick(issue, issue.code)
                                    }
                                    aria-label={`${issue.failing_technique} (${
                                      issue.issues.length
                                    } ${
                                      issue.issues.length === 1
                                        ? 'instance'
                                        : 'instances'
                                    })`}
                                  />
                                </td>
                              )}

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
                                          ? 'instance'
                                          : 'instances'
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
                            {issue.issues.map(
                              (instance: Instance, index: number) => (
                                <tr
                                  id={instance.id}
                                  className={`text-base border-b border-neutral-200 hidden last:border-none ${
                                    selectedInstances.includes(instance.id)
                                      ? 'bg-purple-50'
                                      : ''
                                  }`}
                                >
                                  {isCheckboxVisible && (
                                    <td className="border-r border-neutral-200 p-0">
                                      <Checkbox
                                        classNames={{
                                          control: 'm-3',
                                          base: 'p-0 m-0',
                                        }}
                                        isSelected={selectedInstances.includes(
                                          instance.id
                                        )}
                                        onChange={() =>
                                          handleErrorClick(
                                            instance.id,
                                            instance,
                                            issue
                                          )
                                        }
                                        aria-label={`${
                                          issue.failing_technique
                                        } ID-${index + 1}`}
                                      />
                                    </td>
                                  )}

                                  <td
                                    headers={`issue-${index + 1}-${
                                      parentIndex + 1
                                    } id`}
                                    className="border-r border-neutral-200 w-[80px] p-2"
                                  >
                                    <Button
                                      appearance="link"
                                      spacing="none"
                                      className="text-left"
                                      isDisabled={!instance.selector}
                                      onPress={() =>
                                        focusElement(instance.selector)
                                      }
                                    >
                                      ID-{index + 1}
                                    </Button>
                                  </td>
                                  <td
                                    headers={`issue-${index + 1}-${
                                      parentIndex + 1
                                    } element`}
                                    className="table-cell w-[80px] border-r border-neutral-200 text-sm p-2"
                                  >
                                    <p>{`<${instance.elementTagName}>`}</p>
                                  </td>
                                  <td
                                    headers={`issue-${index + 1}-${
                                      parentIndex + 1
                                    } screenshot`}
                                    className="table-cell min-w-[120px] w-[45%] text-sm text-center border-r border-neutral-200 p-2"
                                  >
                                    <Button
                                      appearance="link"
                                      spacing="none"
                                      aria-label={`Download ${
                                        issue.failing_technique
                                      } ID-${index + 1} Screenshot`}
                                      isDisabled={!instance.selector}
                                      onPress={() =>
                                        downloadScreenshot(
                                          instance.selector,
                                          instance.type,
                                          issue.failing_technique,
                                          index
                                        )
                                      }
                                    >
                                      Download
                                    </Button>
                                  </td>
                                  <td
                                    headers={`issue-${index + 1}-${
                                      parentIndex + 1
                                    } attribute`}
                                    className="table-cell min-w-[120px] w-[45%] p-2"
                                  >
                                    <section
                                      tabIndex={0}
                                      className="h-[62px] p-1 text-left font-poppins break-words text-sm overflow-y-scroll focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                                    >
                                      {issue.element === 'Contrast' &&
                                      issue.code !== 'BB10575' &&
                                      issue.code !== 'BB10615' ? (
                                        <div className="flex flex-col gap-1">
                                          <div>
                                            <span className="font-semibold">
                                              {
                                                formatInput(instance.message)
                                                  .ratio
                                              }{' '}
                                            </span>
                                            <span>
                                              -{' '}
                                              {
                                                formatInput(instance.message)
                                                  .fontsize
                                              }{' '}
                                              {
                                                formatInput(instance.message)
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
                                                  instance.message
                                                ).fg.substring(0, 7)}`,
                                              }}
                                            ></div>
                                            <span>
                                              {formatInput(instance.message).fg}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <div
                                              title="Background Color"
                                              className="w-3.5 h-3.5 inline-block border border-neutral-200"
                                              style={{
                                                backgroundColor: `${formatInput(
                                                  instance.message
                                                ).bg.substring(0, 7)}`,
                                              }}
                                            ></div>
                                            <span>
                                              {formatInput(instance.message).bg}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        instance.message?.toString()
                                      )}
                                    </section>
                                  </td>
                                </tr>
                              )
                            )}
                          </>
                        ))}
                      </table>
                    </div>
                  </>
                )}
              </>
            )
          })}
        </>
      ) : (
        <div className="flex justify-center pt-[150px]">
          <p className="text-base text-center font-poppins text-balance w-[400px]">
            {nothingToDisplay}
          </p>
        </div>
      )}
    </>
  )
}

export default CheckboxTable
