/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
  TrailIcon,
  TrailAMSVerticalIcon,
  MinusIcon,
  ChevronDownIcon,
} from "@trail-ui/icons";
import CheckboxTable from "./CheckboxTable";
import WebsiteLandmarks from "./WebsiteLandmarks";
// import DownloadCSV from "./DownloadCSV";

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
  const [rulesets, setRulesets] = useState([]);
  const [html, setHtml] = useState("");
  const [currentURL, setCurrentURL] = useState("");
  const [selectedTool, setSelectedTool] = useState<Selection>(new Set([]));
  const [result, setResult] = useState<[] | any>([]);

  const apiKey = localStorage.getItem("authToken");
  // const serverUrl = localStorage.getItem('serverUrl')

  console.log("current url", currentURL);

  useEffect(() => {
    const selectedToolArray = Array.from(selectedTool);

    const tools = [
      "tab-order",
      "headings",
      "list-tags",
      "landmarks",
      "alt-text",
      "links",
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
    const resetAuditResult = () => {
      chrome.runtime.sendMessage({ action: "resetAuditResult" });
    };

    resetAuditResult();

    const fetchAuditResult = async () => {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "getAuditResult" }, (response) => {
          resolve(response);
        });
      });
      setResult(response);
    };

    fetchAuditResult();

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "session") {
        const result = changes.auditResult.newValue;
        setResult(result);
      }
    });

    const handleNewResult = (newResult: any) => {
      setResult(newResult);
      console.log(newResult, "handleNewResult");
    };

    window.addEventListener("message", (event) => {
      if (event.data.action === "updateResult") {
        handleNewResult(event.data.result);
      }
    });

    return () => {
      setResult([]);
    };
  }, []);

  useEffect(() => {
    async function getCurrentTabHtmlSource() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      //extract only url with https
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
  }, []);

  const getRulesets = () => {
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const runAudit = async () => {
    await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0]?.id || 0 },
        func: () => {
          const event = new CustomEvent("scally_send", {
            detail: {
              options: {
                runners: ["htmlcs"],
                standard: "SECTIONBB",
                ignore: [],
              },
            },
          });
          // console.log("event", event);
          window.dispatchEvent(event);
        },
      });
    });
  };

  const errorType: any[] = [];
  const warningType: any[] = [];
  const passType: any[] = [];
  const noticeType: any[] = [];

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

  useEffect(() => {
    runAudit();
  }, []);

  const handleResponse = () => {
    getRulesets();
  };

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
          {rulesets.length > 0 ? (
            <div
              className="before:content-[''] before:h-[1px] before:w-6 before:bg-neutral-300 before:left-0 before:top-[103px] before:fixed
                        after:content-[''] after:h-[1px] after:w-6 after:bg-neutral-300 after:right-0 after:top-[103px] after:fixed"
            >
              <Tabs color="purple" classNames={{ tab: "border-0 py-0 pr-1.5" }}>
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
                  {/* <DownloadCSV csvdata={{errorType, warningType, passType, noticeType}} /> */}
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
              <Button appearance="primary" onPress={handleResponse}>
                <span className="text-base">Test Website</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Extension;
