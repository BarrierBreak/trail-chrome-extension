/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from 'react'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Selection,
} from '@trail-ui/react'
import {
  TrailIcon,
  TrailAMSVerticalIcon,
  MinusIcon,
  ChevronDownIcon,
} from '@trail-ui/icons'
// import WebsiteLandmarks from "./WebsiteLandmarks";
// import DownloadCSV from "./DownloadCSV";

export type Clip = {
  x: number
  y: number
  width: number
  height: number
}

export type Instance = {
  clip: Clip
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
}

export type IssueTypes = {
  code: string
  conformance_level: string
  criteria_name: string
  element: string
  failing_issue_variable: string
  failing_technique: string
  id: string
  issues: Instance[]
  message: string
  occurences: number
  rule_name: string
  severity: string
}

export type Conformance = {
  A: IssueTypes[]
  AA: IssueTypes[]
  AAA: IssueTypes[]
  Section508: IssueTypes[]
  BestPractice: IssueTypes[]
}

export interface Issues {
  issues: {
    errors: Conformance
    warnings: Conformance
    pass: Conformance
    notices: Conformance
  }
}

const Extension = () => {
  // const [rulesets, setRulesets] = useState([])

  const [selectedTool, setSelectedTool] = useState<Selection>(new Set([]))

  // const apiKey = localStorage.getItem('authToken')
  // const serverUrl = localStorage.getItem('serverUrl')

  useEffect(() => {
    const selectedToolArray = Array.from(selectedTool)

    const tools = [
      'tab-order',
      'headings',
      'list-tags',
      'landmarks',
      'alt-text',
      'links',
    ]

    tools.forEach((tool) => {
      if (selectedToolArray.includes(tool)) {
        window.parent.postMessage(`show-${tool}`, '*')
      } else {
        window.parent.postMessage(`hide-${tool}`, '*')
      }
    })
  }, [selectedTool])

  const handleMinimise = () => {
    window.parent.postMessage('minimise-button-clicked', '*')
  }

  const [result, setResult] = useState<[] | unknown>([])

  console.log('result', result)


  useEffect(() => {

    const resetAuditResult = () => {
      chrome.runtime.sendMessage({action: 'resetAuditResult'})
    }

    resetAuditResult()

    const fetchAuditResult = async () => {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({action: 'getAuditResult'}, (response) => {
          resolve(response)
        })
      })
      setResult(response)
    }
  
    fetchAuditResult()
  
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'session') {
        const result = changes.auditResult.newValue
        setResult(result)
      }
    })
  
    const handleNewResult = (newResult: unknown) => {
      setResult(newResult)
    }
  
    window.addEventListener('message', (event) => {
      if (event.data.action === 'updateResult') {
        handleNewResult(event.data.result)
      }
    })
  
    return () => {
      setResult([])
    }
  }, [])


  const runAudit = async () => {
    await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0]?.id || 0},
        func: () => {
          const event = new CustomEvent('scally_send', {
            detail: {
              options: {
                runners: ['htmlcs'],
                standard: 'SECTIONBB',
                ignore: [],
              },
            },
          })
          console.log('event', event)
          window.dispatchEvent(event)
        },
      })
    })
  }

  return (
    <main className="font-poppins">
      <div className="w-full" aria-label="Trail" role="modal">
        <div className="flex justify-between items-center sticky bg-white top-0 z-[1] border-b border-neutral-300 h-14 px-6 py-2">
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
            <MenuTrigger>
              <Button
                appearance="default"
                aria-label="Menu"
                className="text-base data-[pressed=true]:border-purple-600 data-[pressed=true]:bg-purple-100"
              >
                Bookmarklets
                <ChevronDownIcon width={16} height={16} />
              </Button>
              <Menu
                selectionMode="multiple"
                selectedKeys={selectedTool}
                onSelectionChange={setSelectedTool}
                classNames={{popover: 'font-poppins'}}
              >
                <MenuItem id="tab-order" classNames={{title: 'text-base'}}>
                  Tab Order
                </MenuItem>
                <MenuItem id="headings" classNames={{title: 'text-base'}}>
                  Headings
                </MenuItem>
                <MenuItem id="list-tags" classNames={{title: 'text-base'}}>
                  List
                </MenuItem>
                <MenuItem id="landmarks" classNames={{title: 'text-base'}}>
                  Landmark
                </MenuItem>
                <MenuItem id="alt-text" classNames={{title: 'text-base'}}>
                  Alt Text
                </MenuItem>
                <MenuItem id="links" classNames={{title: 'text-base'}}>
                  Links
                </MenuItem>
              </Menu>
            </MenuTrigger>
            <IconButton
              appearance="text"
              isIconOnly={true}
              onPress={handleMinimise}
              aria-label="Minimise"
            >
              <MinusIcon width={24} height={24} />
            </IconButton>
          </div>
        </div>

        <div className="flex h-full px-6 pb-6">
          <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
            <Button appearance="primary" onPress={runAudit}>
              <span className="text-base">Test Website</span>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
            <span className="text-lg text-neutral-800">
              {JSON.stringify(result)}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Extension
