/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from 'react'
import {
  Button,
  Checkbox,
  Chip,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@trail-ui/react'
import {
  ExportIcon,
  TrailIcon,
  TrailAMSVerticalIcon,
  MinusIcon,
} from '@trail-ui/icons'
import WebsiteLandmarks from './WebsiteLandmarks'
import CheckboxTable from './CheckboxTable'
import DownloadCSV from './DownloadCSV'

export interface IssueItems {
  issues: {
    clip: {
      x: number
      y: number
      width: number
      height: number
    }
    clipBase64: string
    code: string
    context: string
    elementTagName: string
    id: string
    message: string
    recurrence: number
    selector: string
    type: string
    typeCode: number
  }[]
}

export interface Issues {
  issues: {
    errors: {
      code: string
      conformance_level: string
      criteria_name: string
      element: string
      failing_issue_variable: string
      failing_technique: string
      id: string
      issues: {
        clip: {
          x: number
          y: number
          width: number
          height: number
        }
        clipBase64: string
        code: string
        context: string
        elementTagName: string
        id: string
        message: string
        recurrence: number
        selector: string
        type: string
        typeCode: number
      }[]
      message: string
      occurences: string
      rule_name: string
      severity: string
    }[]
    warnings: {
      code: string
      conformance_level: string
      criteria_name: string
      element: string
      failing_issue_variable: string
      failing_technique: string
      id: string
      issues: {
        clip: {
          x: number
          y: number
          width: number
          height: number
        }
        clipBase64: string
        code: string
        context: string
        elementTagName: string
        id: string
        message: string
        recurrence: number
        selector: string
        type: string
        typeCode: number
      }[]
      message: string
      occurences: string
      rule_name: string
      severity: string
    }[]
    pass: {
      code: string
      conformance_level: string
      criteria_name: string
      element: string
      failing_issue_variable: string
      failing_technique: string
      id: string
      issues: {
        clip: {
          x: number
          y: number
          width: number
          height: number
        }
        clipBase64: string
        code: string
        context: string
        elementTagName: string
        id: string
        message: string
        recurrence: number
        selector: string
        type: string
        typeCode: number
      }[]
      message: string
      occurences: string
      rule_name: string
      severity: string
    }[]
    notices: {
      code: string
      conformance_level: string
      criteria_name: string
      element: string
      failing_issue_variable: string
      failing_technique: string
      id: string
      issues: {
        clip: {
          x: number
          y: number
          width: number
          height: number
        }
        clipBase64: string
        code: string
        context: string
        elementTagName: string
        id: string
        message: string
        recurrence: number
        selector: string
        type: string
        typeCode: number
      }[]
      message: string
      occurences: string
      rule_name: string
      severity: string
    }[]
  }
}

const Extension = () => {
  const [responseData, setResponseData] = useState<Issues>()
  const [isLoading, setIsLoading] = useState(false)
  const [isToggleSelected, setIsToggleSelected] = useState<boolean>(false)
  const [isCheckboxSelected, setIsCheckboxSelected] = useState<boolean>(false)
  const [isHeadingSelected, setIsHeadingSelected] = useState<boolean>(false)
  const [isListToggleSelected, setIsListToggleSelected] =
    useState<boolean>(false)
  const [isLandmarksSelected, setIsLandmarksSelected] = useState<boolean>(false)
  const [isAltTextSelected, setIsAltTextSelected] = useState<boolean>(false)

  const [html, setHtml] = useState('')
  const apiKey = localStorage.getItem('authtoken')
  const [dataFromChild, setDataFromChild] = useState({})

  const tabData = [
    {id: 'FAIL', label: 'Fail', issues: responseData?.issues.errors.length},
    {
      id: 'MANUAL',
      label: 'Manual',
      issues: responseData?.issues.warnings.length,
    },
    {id: 'PASS', label: 'Pass', issues: responseData?.issues.pass.length},
    {
      id: 'BEST-PRACTICE',
      label: 'BP',
      issues: responseData?.issues.notices.length,
    },
  ]

  // To scrape HTML source code from current tab of webpage
  useEffect(() => {
    async function getCurrentTabHtmlSource() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      chrome.scripting.executeScript(
        {
          target: {tabId: tab.id!},
          func: () => {
            const html = document.documentElement.outerHTML
            return html
          },
        },
        (results) => {
          setHtml(results[0].result as string)
        }
      )
    }

    getCurrentTabHtmlSource()
  }, [])

  const postURL = () => {
    setIsLoading(true)

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      async function (tabs) {
        const tabURL = tabs[0].url
        await fetch('https://trail-api.barrierbreak.com/api/audit', {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'User-Agent': 'BarrierBreak Client (https://www.barrierbreak.com)',
            'x-api-key': `${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: tabURL,
            element: 'all',
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('URL:', data)
            setResponseData(data)
            setIsLoading(false)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
    )
  }

  const postData = async () => {
    setIsLoading(true)

    // To get html structure of webpage
    const htmlDocument = new DOMParser().parseFromString(html, 'text/html')

    // To remove html element having id as 'trail-btn' from DOM
    const element = htmlDocument.querySelector('#trail-btn')
    if (element) {
      element.remove()
    }

    // To fetch accesibility results of webpage from Scally
    await fetch('https://trail-api.barrierbreak.com/api/test-html', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'User-Agent': 'BarrierBreak Client (https://www.barrierbreak.com)',
        'x-api-key': `${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlDocument.documentElement.outerHTML,
        element: '',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
        setResponseData(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  // To handle tab order
  const handleTabOrder = () => {
    let msg: string
    setIsToggleSelected(!isToggleSelected)
    isToggleSelected ? (msg = 'hide-tab-order') : (msg = 'show-tab-order')
    window.parent.postMessage(msg, '*')
  }

  const handleListToggle = () => {
    let msg: string
    setIsListToggleSelected(!isListToggleSelected)
    isListToggleSelected ? (msg = 'hide-list-tags') : (msg = 'show-list-tags')
    window.parent.postMessage(msg, '*')
  }

  const handleLandmarks = () => {
    let msg: string
    setIsLandmarksSelected(!isLandmarksSelected)
    isLandmarksSelected ? (msg = 'hide-landmarks') : (msg = 'show-landmarks')
    window.parent.postMessage(msg, '*')
  }

  const handleAltText = () => {
    let msg: string
    setIsAltTextSelected(!isAltTextSelected)
    isAltTextSelected ? (msg = 'hide-alt-text') : (msg = 'show-alt-text')
    window.parent.postMessage(msg, '*')
  }

  const handleShowHeading = () => {
    let msg: string
    setIsHeadingSelected(!isHeadingSelected)
    isHeadingSelected ? (msg = 'hide-headings') : (msg = 'show-headings')
    window.parent.postMessage(msg, '*')
  }

  // To handle minimise functionality
  const handleMinimise = () => {
    window.parent.postMessage('minimise-button-clicked', '*')
  }

  // API call
  const handleTestResults = () => {
    isCheckboxSelected ? postData() : postURL()
  }

  const handleDataFromChild = (
    data: {
      id: string
      data: IssueItems
    }[]
  ) => {
    setDataFromChild(data)
  }

  return (
    <main className="font-poppins">
      <div className="w-full" aria-label="Trail" role="modal">
        <div className="flex justify-between items-center sticky bg-white top-0 z-[1] border-b border-neutral-300 h-14 pl-6 pr-5 py-2">
          <div className="flex items-center gap-1">
            <TrailIcon
              width={40}
              height={40}
              className="text-purple-600"
              aria-label="Trail AMS"
              aria-hidden="false"
              role="img"
            />
            <TrailAMSVerticalIcon
              width={36}
              height={32}
              className="text-neutral-800"
            />
          </div>
          <div className="flex gap-4">
            {
              <div className="flex items-center gap-2">
                <div>
                  <Checkbox
                    isSelected={isToggleSelected}
                    onChange={handleTabOrder}
                  >
                    Tab Order
                  </Checkbox>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isHeadingSelected}
                    onChange={handleShowHeading}
                  >
                    Headings
                  </Checkbox>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isListToggleSelected}
                    onChange={handleListToggle}
                  >
                    Lists
                  </Checkbox>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isLandmarksSelected}
                    onChange={handleLandmarks}
                  >
                    Landmarks
                  </Checkbox>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isAltTextSelected}
                    onChange={handleAltText}
                  >
                    Alt Text
                  </Checkbox>
                </div>
              </div>
            }
            <IconButton
              appearance="default"
              isIconOnly={true}
              onPress={handleMinimise}
              aria-label="Minimise"
            >
              <MinusIcon width={24} height={24} />
            </IconButton>
          </div>
        </div>

        <div className="flex h-full px-6 pb-6">
          {responseData?.issues ? (
            <div
              className="before:content-[''] before:h-[1px] before:w-6 before:bg-neutral-300 before:left-0 before:top-[103px] before:fixed
                        after:content-[''] after:h-[1px] after:w-6 after:bg-neutral-300 after:right-0 after:top-[103px] after:fixed"
            >
              <Tabs color="purple" classNames={{tab: 'border-0 py-0 pr-1.5'}}>
                <div className="flex items-center justify-between h-12 w-[564px] border-b border-neutral-300 sticky z-[1] bg-white top-14">
                  <TabList>
                    {tabData.map((tab) => (
                      <Tab id={tab.id}>
                        <div className="flex items-center gap-1 text-base h-12">
                          <p>{tab.label}</p>
                          <Chip
                            variant="solid"
                            color="purple"
                            size="md"
                            radius="full"
                            children={`${tab.issues}`}
                            classNames={{
                              base: 'p-0 h-[18px] min-w-7 hover:bg-purple-100 active:bg-purple-100',
                              content: 'text-xs text-center px-2 py-0',
                            }}
                          />
                        </div>
                      </Tab>
                    ))}
                    <Tab id="STRUCTURE">
                      <div className="flex items-center text-base h-12">
                        <p>Structure</p>
                      </div>
                    </Tab>
                  </TabList>
                  <div className="flex gap-2">
                    <DownloadCSV csvdata={dataFromChild} />
                    <Button
                      className="text-base"
                      appearance="primary"
                      endContent={<ExportIcon width={24} height={24} />}
                    >
                      Export
                    </Button>
                  </div>
                </div>
                <TabPanel id="FAIL">
                  <CheckboxTable
                    sendDataToParent={handleDataFromChild}
                    data={responseData}
                    issueType="errors"
                  />
                </TabPanel>
                <TabPanel id="MANUAL">
                  <CheckboxTable
                    sendDataToParent={handleDataFromChild}
                    data={responseData}
                    issueType="warnings"
                  />
                </TabPanel>
                <TabPanel id="PASS">
                  <CheckboxTable
                    sendDataToParent={handleDataFromChild}
                    data={responseData}
                    issueType="pass"
                  />
                </TabPanel>
                <TabPanel id="BEST-PRACTICE">
                  <CheckboxTable
                    sendDataToParent={handleDataFromChild}
                    data={responseData}
                    issueType="notices"
                  />
                </TabPanel>
                <TabPanel id="STRUCTURE">
                  <WebsiteLandmarks html={html} />
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
              <Checkbox
                isSelected={isCheckboxSelected}
                onChange={setIsCheckboxSelected}
              >
                Does this page have a login?
              </Checkbox>
              <Button
                appearance="primary"
                onPress={handleTestResults}
                isLoading={isLoading}
              >
                <span className="text-base">Test Website</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Extension
