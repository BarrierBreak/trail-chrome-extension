/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Chip,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@trail-ui/react";
import { ResetIcon, TrailAMSVerticalIcon, TrailIcon } from "@trail-ui/icons";
import CheckboxTable from "./CheckboxTable";
import WebsiteLandmarks from "./WebsiteLandmarks";
import DownloadCSV from "./DownloadCSV";
import ColorContrast from "./ColorContrast";

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
  const [result, setResult] = useState<[] | any>([]);
  const [dataFromTable, setDataFromTable] = useState([]);
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

  const handleDataFromTable = (data: any) => {
    setDataFromTable(data);

    console.log("dataFromTable", dataFromTable);
  };

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

    // Listen for messages from the background script
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

  const getRulesets = useCallback(() => {
    setIsLoading(true);
    fetch("https://trail-api.barrierbreak.com/api/allRuleSets", {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent": "GreasyMonk",
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 500) {
          alert("Please enter your Auth Token in the Auth Token dialog");
        }
        setRulesets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [apiKey]);

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

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "RELOAD") {
      location.reload();
    }
  });

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

  const handleResponse = () => {
    sessionStorage.removeItem(`auditResults_${tabId}`);
    getRulesets();
    runAudit();
    liveRegionAndTabFocus();
  };

  return (
    <div className="font-poppins">
      <div className="w-full">
        <div className="flex justify-between items-center w-full fixed bg-neutral-50 top-0 z-[1] border-b border-neutral-200 h-14 px-6 py-2">
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
          {rulesets.length > 0 && (
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
          )}
        </div>

        <span aria-live="polite" className="live-region sr-only"></span>
        <div className="flex h-full pr-6 pb-6">
          {rulesets.length > 0 ? (
            <div>
              <Tabs
                color="purple"
                orientation="vertical"
                classNames={{
                  tab: "border-b border-neutral-200 py-0 pr-1.5 justify-start data-[selected=true]:bg-purple-50 data-[focus-visible=true]:outline-purple-600 data-[focus-visible=true]:-outline-offset-2",
                  tabList:
                    "flex flex-col w-[120px] fixed bg-neutral-50 mt-[358px] p-0 before:content-[''] before:h-full before:fixed before:w-[1px] before:bg-neutral-200 before:left-[120px] after:content-[''] after:h-full after:fixed after:w-[120px] after:bg-neutral-50 after:left-[0px] after:top-[350px]",
                  panel:
                    "mt-[24px] mr-4 ml-[136px] sm:w-[74vw] md:w-[79vw] lg:w-[84vw] xl:w-[87vw]",
                  cursor: "h-full w-1 left-0",
                }}
              >
                <div className="tab flex items-center text-start justify-between h-12 w-[120px] sticky z-[1] bg-neutral-50 top-14">
                  <TabList>
                    {tabData.map((tab) => (
                      <Tab id={tab.id}>
                        <div className="flex items-center justify-between w-[105px] gap-1 text-sm h-12 pl-3">
                          <p>{tab.label}</p>
                          <Chip
                            variant="solid"
                            color="default"
                            size="md"
                            radius="full"
                            children={`${tab.issues}`}
                            classNames={{
                              base: "p-0 h-[18px] min-w-7 hover:bg-neutral-200 active:bg-neutral-200",
                              content: "text-xs text-center px-2 py-0",
                            }}
                          />
                        </div>
                      </Tab>
                    ))}
                    <Tab id="STRUCTURE">
                      <div className="flex items-center justify-between w-full gap-1 text-sm h-12 pl-3">
                        <p>Structure</p>
                      </div>
                    </Tab>
                    <Tab id="COLOR-CONTRAST">
                      <div className="flex items-center justify-between w-full gap-1 text-sm h-12 pl-3">
                        <p>Color Contrast</p>
                      </div>
                    </Tab>
                  </TabList>
                </div>
                <TabPanel id="FAIL">
                  <CheckboxTable
                    data={errorType}
                    rules={rulesets}
                    sendDataToExtension={handleDataFromTable}
                    issueType="fail"
                  />
                </TabPanel>
                <TabPanel id="MANUAL">
                  <CheckboxTable
                    data={warningType}
                    rules={rulesets}
                    isCheckboxVisible={true}
                    sendDataToExtension={handleDataFromTable}
                    issueType="manual"
                  />
                </TabPanel>
                <TabPanel id="PASS">
                  <CheckboxTable
                    data={passType}
                    rules={rulesets}
                    sendDataToExtension={handleDataFromTable}
                    issueType="pass"
                  />
                </TabPanel>
                <TabPanel id="BEST-PRACTICE">
                  <CheckboxTable
                    data={noticeType}
                    rules={rulesets}
                    sendDataToExtension={handleDataFromTable}
                    issueType="best-practice"
                  />
                </TabPanel>
                <TabPanel id="STRUCTURE">
                  <WebsiteLandmarks html={html} />
                </TabPanel>
                <TabPanel id="COLOR-CONTRAST">
                  <ColorContrast />
                </TabPanel>
              </Tabs>
            </div>
          ) : (
            <div>
              <Tabs
                color="purple"
                orientation="vertical"
                classNames={{
                  tab: "border-b border-neutral-200 py-0 pr-1.5 justify-start data-[selected=true]:bg-purple-50 data-[focus-visible=true]:outline-purple-600 data-[focus-visible=true]:-outline-offset-2",
                  tabList:
                    "flex flex-col w-[120px] fixed bg-neutral-50 mt-[211px] p-0 before:content-[''] before:h-full before:fixed before:w-[1px] before:bg-neutral-200 before:left-[120px] after:content-[''] after:h-full after:fixed after:w-[120px] after:bg-neutral-50 after:left-[0px] after:top-[350px]",
                  panel:
                    "mt-[24px] mr-4 ml-[136px] sm:w-[74vw] md:w-[79vw] lg:w-[84vw] xl:w-[87vw]",
                  cursor: "h-full w-1 left-0",
                }}
              >
                <div className="tab flex items-center text-start justify-between h-12 w-[120px] sticky z-[1] bg-neutral-50 top-14">
                  <TabList>
                    <Tab id="TEST">
                      <div className="flex items-center justify-between w-full gap-1 text-sm h-12 pl-3">
                        <p>Test</p>
                      </div>
                    </Tab>
                    <Tab id="STRUCTURE">
                      <div className="flex items-center justify-between w-full gap-1 text-sm h-12 pl-3">
                        <p>Structure</p>
                      </div>
                    </Tab>
                    <Tab id="COLOR-CONTRAST">
                      <div className="flex items-center justify-between w-full gap-1 text-sm h-12 pl-3">
                        <p>Color Contrast</p>
                      </div>
                    </Tab>
                  </TabList>
                </div>

                <TabPanel id="TEST">
                  <div className="flex flex-col items-center justify-center gap-4 w-full h-[80vh]">
                    <Button
                      appearance="primary"
                      onPress={handleResponse}
                      isLoading={isLoading}
                      className="test-website text-base"
                    >
                      Test Webpage
                    </Button>
                  </div>
                </TabPanel>
                <TabPanel id="STRUCTURE">
                  <WebsiteLandmarks html={html} />
                </TabPanel>
                <TabPanel id="COLOR-CONTRAST">
                  <ColorContrast />
                </TabPanel>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Extension;
