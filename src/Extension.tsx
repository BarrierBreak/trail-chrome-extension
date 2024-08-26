/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Selection,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@trail-ui/react";
import {
  ChevronDownIcon,
  MinusIcon,
  ResetIcon,
  TrailAMSVerticalIcon,
  TrailIcon,
} from "@trail-ui/icons";
import CheckboxTable from "./CheckboxTable";
import WebsiteLandmarks from "./WebsiteLandmarks";
import DownloadCSV from "./DownloadCSV";

export type Clip = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Instance = {
  clip: Clip;
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
};

export type IssueTypes = {
  code: string;
  conformance_level: string;
  criteria_name: string;
  element: string;
  failing_issue_variable: string;
  failing_technique: string;
  id: string;
  issues: Instance[];
  message: string;
  occurences: number;
  rule_name: string;
  severity: string;
};

export type Conformance = {
  A: IssueTypes[];
  AA: IssueTypes[];
  AAA: IssueTypes[];
  Section508: IssueTypes[];
  BestPractice: IssueTypes[];
};

export interface Issues {
  issues: {
    errors: Conformance;
    warnings: Conformance;
    pass: Conformance;
    notices: Conformance;
  };
}

const Extension = () => {
  const [html, setHtml] = useState("");
  const [rulesets, setRulesets] = useState([]);
  const [currentURL, setCurrentURL] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<Selection>(new Set([]));
  const [result, setResult] = useState<[] | any>([]);
  const [scallyResult, setScallyResult] = useState<any>({});
  const [tabId, setTabId] = useState<number>(0);

  const errorType: any[] = [];
  const warningType: any[] = [];
  const passType: any[] = [];
  const noticeType: any[] = [];
  const apiKey = localStorage.getItem("authToken");
  // const serverUrl = localStorage.getItem('serverUrl')

  console.log("current url", currentURL);

  // To check whether the URL has dashboard params and then open Trail automatically
  // if (currentURL.includes("break")) {
  //   console.log("match found");
  //   window.parent.postMessage("open-trail", "*");
  //   setTimeout(() => {
  //     (document.querySelector(".test-website") as HTMLElement)?.click()
  //   }, 500);
  // } else {
  //   console.log("match not found");
  // }

  useEffect(() => {
    const selectedToolArray = Array.from(selectedTool);

    const tools = [
      "tab-order",
      "headings",
      "list-tags",
      "landmarks",
      "alt-text",
      "links",
      "forms",
    ];

    tools.forEach((tool) => {
      if (selectedToolArray.includes(tool)) {
        window.parent.postMessage(`show-${tool}`, "*");
      } else {
        window.parent.postMessage(`hide-${tool}`, "*");
      }
    });
  }, [selectedTool]);

  const handleMinimise = () => {
    window.parent.postMessage("minimise-button-clicked", "*");
  };

  useEffect(() => {
    async function getCurrentTabHtmlSource() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // To extract only url with https
      const url = tab.url?.match(/^https?:\/\/[^#?/]+/)?.[0];
      setCurrentURL(url!);
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

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        handleMinimise();
      }
    });
  }, []);

  const getRulesets = useCallback(() => {
    setIsLoading(true);
    fetch("https://trail-api.barrierbreak.com/api/allRuleSets", {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent": "Test 123",
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRulesets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [apiKey]);

  // Listen for messages from the background script
  useEffect(() => {
    const listener = (request: any) => {
      if (request.type === "TO_REACT") {
        setScallyResult((prevResults: any) => ({
          ...prevResults,
          [request.tabId]: request.payload,
        }));
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Cleanup listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    setResult(scallyResult[tabId]);
    sessionStorage.removeItem(`auditResults_${tabId}`);
  }, [scallyResult, tabId]);

  const runAudit = () => {
    const options = {
      runners: ["htmlcs"],
      ignore: [],
      clip: true,
      standard: ["SECTIONBB"],
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      setTabId(tabId as number);
      chrome.runtime.sendMessage({ type: "RUN_AUDIT", options, tabId });
    });

    const listener = (request: any) => {
      if (request.type === "TO_REACT") {
        setScallyResult((prevResults: any) => ({
          ...prevResults,
          [request.tabId]: request.payload,
        }));
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Cleanup listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  };

  result?.issues?.forEach((issue: any) => {
    switch (issue.type) {
      case "error":
        errorType.push(issue);
        break;
      case "warning":
        warningType.push(issue);
        break;
      case "pass":
        passType.push(issue);
        break;
      case "notice":
        noticeType.push(issue);
        break;
    }
  });

  const getTotalIssueCount = (data: any) => {
    const total: any = [];
    data?.forEach((item: any) => {
      total.push(item.code);
    });
    return new Set(total).size;
  };

  const tabData = [
    {
      id: "FAIL",
      label: "Fail",
      issues: getTotalIssueCount(errorType),
    },
    {
      id: "MANUAL",
      label: "Manual",
      issues: getTotalIssueCount(warningType),
    },
    {
      id: "PASS",
      label: "Pass",
      issues: getTotalIssueCount(passType),
    },
    {
      id: "BEST-PRACTICE",
      label: "BP",
      issues: getTotalIssueCount(noticeType),
    },
  ];

  const handleReset = () => {
    window.parent.postMessage("reset-results", "*");
    const liveRegion = document.querySelector(".live-region");
    if (liveRegion) {
      liveRegion.textContent = "";
    }
    setRulesets([]);
    setResult({});
  };

  const liveRegionAndTabFocus = () => {
    setTimeout(() => {
      const liveRegion = document.querySelector(".live-region");
      if (liveRegion) {
        liveRegion.textContent = "Results are loaded";
      }
    }, 100);

    setTimeout(() => {
      (
        document?.querySelector(".tab")?.childNodes[0]
          ?.firstChild as HTMLElement
      ).focus();
    }, 500);
  };

  const handleResponse = useCallback(() => {
    sessionStorage.removeItem(`auditResults_${tabId}`);
    getRulesets();
    runAudit();
    liveRegionAndTabFocus();
  }, [getRulesets]);

  return (
    <div className="font-poppins">
      <div className="w-full" aria-label="Trail AMS" role="dialog">
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
                aria-controls="bookmarklet-menu"
                className="bookmarklet text-base data-[pressed=true]:border-purple-600 data-[pressed=true]:bg-purple-100"
                endContent={<ChevronDownIcon width={16} height={16} />}
              >
                Bookmarklets
              </Button>
              <Menu
                id="bookmarklet-menu"
                selectionMode="multiple"
                selectedKeys={selectedTool}
                onSelectionChange={setSelectedTool}
                classNames={{ popover: "font-poppins" }}
              >
                <MenuItem id="tab-order" classNames={{ title: "text-base" }}>
                  Tab Order
                </MenuItem>
                <MenuItem id="headings" classNames={{ title: "text-base" }}>
                  Headings
                </MenuItem>
                <MenuItem id="list-tags" classNames={{ title: "text-base" }}>
                  List
                </MenuItem>
                <MenuItem id="landmarks" classNames={{ title: "text-base" }}>
                  Landmark
                </MenuItem>
                <MenuItem id="alt-text" classNames={{ title: "text-base" }}>
                  Alt Text
                </MenuItem>
                <MenuItem id="links" classNames={{ title: "text-base" }}>
                  Links
                </MenuItem>
                <MenuItem id="forms" classNames={{ title: "text-base" }}>
                  Forms
                </MenuItem>
              </Menu>
            </MenuTrigger>
            <IconButton
              appearance="textLink"
              isIconOnly={true}
              onPress={handleMinimise}
              aria-label="Minimise"
            >
              <MinusIcon width={24} height={24} className="text-neutral-800" />
            </IconButton>
          </div>
        </div>

        <span aria-live="polite" className="live-region sr-only"></span>
        <div className="flex h-full px-6 pb-6">
          {rulesets.length > 0 ? (
            <div
              className="before:content-[''] before:h-[1px] before:w-6 before:bg-neutral-300 before:left-0 before:top-[103px] before:fixed
                        after:content-[''] after:h-[1px] after:w-6 after:bg-neutral-300 after:right-0 after:top-[103px] after:fixed"
            >
              <Tabs color="purple" classNames={{ tab: "border-0 py-0 pr-1.5" }}>
                <div className="tab flex items-center justify-between h-12 w-[564px] border-b border-neutral-300 sticky z-[1] bg-white top-14">
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
                              base: "p-0 h-[18px] min-w-7 hover:bg-purple-100 active:bg-purple-100",
                              content: "text-xs text-center px-2 py-0",
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
                  <div className="flex gap-4">
                    <IconButton
                      appearance="default"
                      isIconOnly={true}
                      onPress={handleReset}
                      aria-label="Reset Results"
                    >
                      <ResetIcon
                        width={16}
                        height={16}
                        className="text-neutral-800"
                      />
                    </IconButton>
                    <DownloadCSV
                      csvData={{ errorType, warningType, passType, noticeType }}
                      rules={rulesets}
                    />
                  </div>
                </div>
                <TabPanel id="FAIL">
                  <CheckboxTable data={errorType} rules={rulesets} />
                </TabPanel>
                <TabPanel id="MANUAL">
                  <CheckboxTable data={warningType} rules={rulesets} />
                </TabPanel>
                <TabPanel id="PASS">
                  <CheckboxTable data={passType} rules={rulesets} />
                </TabPanel>
                <TabPanel id="BEST-PRACTICE">
                  <CheckboxTable data={noticeType} rules={rulesets} />
                </TabPanel>
                <TabPanel id="STRUCTURE">
                  <WebsiteLandmarks html={html} />
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
              <Button
                appearance="primary"
                onPress={handleResponse}
                isLoading={isLoading}
                className="test-website text-base"
              >
                Test Webpage
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Extension;
