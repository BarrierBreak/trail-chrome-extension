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
// import WebsiteLandmarks from "./WebsiteLandmarks";
import CheckboxTable from "./CheckboxTable";
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
  const [html, setHtml] = useState("");
  const [rulesets, setRulesets] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  // const [scallyErrors, setScallyErrors] = useState([]);
  // const [scallyWarnings, setScallyWarnings] = useState([]);
  // const [scallyPass, setScallyPass] = useState([]);
  // const [scallyNotices, setScallyNotices] = useState([]);
  const [currentURL, setCurrentURL] = useState("");
  const [responseData, setResponseData] = useState<Issues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<Selection>(new Set([]));

  const apiKey = localStorage.getItem("authToken");
  const serverUrl = localStorage.getItem("serverUrl");


  // const errors = allIssues.filter((issue) => issue["type"] === "error");
  // const warnings = allIssues.filter((issue) => issue["type"] === "warning");
  // const pass = allIssues.filter((issue) => issue["type"] === "pass");
  // const notices = allIssues.filter((issue) => issue["type"] === "notice");

  console.log("serverUrl", serverUrl);

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

  // const getTotalIssueCount = (data: any) => {
  //   let count = 0;
  //   if (data) {
  //     Object.values(data).forEach((level: any) => {
  //       count += level.length;
  //     });
  //   }
  //   return count;
  // };

  const tabData = [
    {
      id: "FAIL",
      label: "Fail",
      // issues: getTotalIssueCount(errors),
      issues: 555,
    },
    {
      id: "MANUAL",
      label: "Manual",
      // issues: getTotalIssueCount(warnings),
      issues: 666,
    },
    {
      id: "PASS",
      label: "Pass",
      // issues: getTotalIssueCount(pass),
      issues: 777,
    },
    {
      id: "BEST-PRACTICE",
      label: "BP",
      // issues: getTotalIssueCount(notices),
      issues: 888,
    },
  ];

  // To scrape HTML source code from current tab of webpage
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

  // const postURL = () => {
  //   setIsLoading(true);
  //   chrome.tabs.query(
  //     {
  //       active: true,
  //       currentWindow: true,
  //     },
  //     async function (tabs) {
  //       const tabURL = tabs[0].url;
  //       await fetch("https://trail-api.barrierbreak.com/api/audit", {
  //         method: "POST",
  //         headers: {
  //           Accept: "*/*",
  //           "User-Agent": "BarrierBreak Client (https://www.barrierbreak.com)",
  //           "x-api-key": `${apiKey}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           url: tabURL,
  //           element: "all",
  //         }),
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           console.log("URL:", data);
  //           setResponseData(data);
  //           setIsLoading(false);
  //         })
  //         .catch((error) => {
  //           console.error("Error:", error);
  //         });
  //     }
  //   );
  // };

  const convertAbsoluteToRelative = (htmlDocument: Document) => {
    const trailElements = htmlDocument.querySelectorAll(
      "#trail-iframe, #trail-btn"
    );

    trailElements.forEach((element) => {
      element.remove();
    });

    // const elements = htmlDocument.querySelectorAll("[href], [src]");
    // elements.forEach((element) => {
    //   const href = element.getAttribute("href");
    //   const src = element.getAttribute("src");
    //   const srcSet = element.getAttribute("srcset");

    //   if (href) {
    //     if (
    //       href.startsWith("/") &&
    //       !href.startsWith("http") &&
    //       !href.startsWith("//")
    //     ) {
    //       element.setAttribute("href", `${currentURL}${href}`);
    //     } else if (href.startsWith("//")) {
    //       element.setAttribute("href", "https:" + `${href}`);
    //     }
    //   }

    //   if (src) {
    //     if (
    //       src.startsWith("/") &&
    //       !src.startsWith("http") &&
    //       !src.startsWith("//")
    //     ) {
    //       element.setAttribute("src", `${currentURL}${src}`);
    //     } else if (src.startsWith("//")) {
    //       element.setAttribute("src", "https:" + `${src}`);
    //     }
    //   }

    //   if (srcSet) {
    //     const srcSetArray = srcSet.split(",");
    //     const newSrcSetArray = srcSetArray.map((src) => {
    //       if (!src.trim().startsWith("http") && !src.trim().startsWith("//")) {
    //         return `${currentURL}${src.trim()}`;
    //       } else if (src.trim().startsWith("//")) {
    //         return "https:" + `${src.trim()}`;
    //       }
    //       return src;
    //     });
    //     element.setAttribute("srcset", newSrcSetArray.join(","));
    //   }

      // console.log(src, srcSet, href);
    //});

    //console.log("currentURL", currentURL);

    return htmlDocument;
  };

  const postData = async () => {
    setIsLoading(true);

    const htmlDocument = new DOMParser().parseFromString(html, "text/html");

    // To convert absolute URLs to relative URLs
    const newhtmlcode = convertAbsoluteToRelative(htmlDocument);

    // console.log("HTML:", htmlDocument.documentElement.outerHTML);

    const element = newhtmlcode.querySelector("#trail-btn");
    if (element) {
      element.remove();
    }

  //   // To fetch accesibility results of webpage from Scally
  //   // await fetch("https://trail-api.barrierbreak.com/api/test-html", {
    await fetch("https://trail-api.barrierbreak.com/api/extension-html", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "User-Agent": "BarrierBreak Client (https://www.barrierbreak.com)",
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: newhtmlcode.documentElement.outerHTML,
        element: "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setResponseData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getRulesets = async () => {
    await fetch("https://trail-api.barrierbreak.com/api/allRuleSets", {
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

  console.log("rulesets", rulesets);

  let auditResult: any = null;
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "sendAuditResult") {
      // console.log("Received audit result:", request.result);
      auditResult = request.result;
      console.log("auditResult", auditResult);

      setAllIssues(auditResult.issues);
      console.log("allIssues", allIssues);
    }
    sendResponse({ status: "received" });
  });

  const errorData: Conformance = {
    A: [],
    AA: [],
    AAA: [],
    BestPractice: [],
    Section508: [],
  };
  const warningData: Conformance = {
    A: [],
    AA: [],
    AAA: [],
    BestPractice: [],
    Section508: [],
  };
  const passData: Conformance = {
    A: [],
    AA: [],
    AAA: [],
    BestPractice: [],
    Section508: [],
  };
  const noticeData: Conformance = {
    A: [],
    AA: [],
    AAA: [],
    BestPractice: [],
    Section508: [],
  };
  
  // To handle minimise functionality
  const handleMinimise = () => {
    window.parent.postMessage("minimise-button-clicked", "*");
  };
  
  const handleData = () => {

    console.log("");
    console.log("");
    
    const errors = allIssues.filter((issue) => issue["type"] === "error");
    const warnings = allIssues.filter((issue) => issue["type"] === "warning");
    const pass = allIssues.filter((issue) => issue["type"] === "pass");
    const notices = allIssues.filter((issue) => issue["type"] === "notice");
    const scallyIssueTypes = [errors, warnings, pass, notices];
    scallyIssueTypes.forEach((scallyIssue) => {
      rulesets.forEach((ruleset) => {
        scallyIssue.forEach((issue: any) => {
          if (ruleset["ruleset_id"] === issue["code"]) {
            const result = {
              code: issue["code"],
              conformance_level: ruleset["name"],
              criteria_name: ruleset["criteria_name"],
              element: ruleset["element"],
              failing_issue_variable: ruleset["failing_issue_variable"],
              failing_technique: ruleset["failing_technique"],
              id: "",
              issues: [
                {
                  clip: { x: 404, y: 404, width: 404, height: 404 },
                  clipBase64: "",
                  code: issue["code"],
                  context: issue["context"],
                  elementTagName: issue["elementTagName"],
                  id: "",
                  message: issue["message"],
                  recurrence: issue["recurrence"],
                  selector: issue["selector"],
                  type: issue["type"],
                  typeCode: issue["typeCode"],
                },
              ],
              message: issue["message"],
              occurences: 404,
              rule_name: ruleset["rule_name"],
              severity: ruleset["severity"],
            };

            let targetArray: any[] = [];
            if (issue["type"] === "error") {
              if (ruleset["name"] === "A") {
                targetArray = errorData.A;
              } else if (ruleset["name"] === "AA") {
                targetArray = errorData.AA;
              } else if (ruleset["name"] === "AAA") {
                targetArray = errorData.AAA;
              } else if (ruleset["name"] === "Best Practice") {
                targetArray = errorData.BestPractice;
              } else if (ruleset["name"] === "Section508") {
                targetArray = errorData.Section508;
              }
            } else if (issue["type"] === "warning") {
              if (ruleset["name"] === "A") {
                targetArray = warningData.A;
              } else if (ruleset["name"] === "AA") {
                targetArray = warningData.AA;
              } else if (ruleset["name"] === "AAA") {
                targetArray = warningData.AAA;
              } else if (ruleset["name"] === "Best Practice") {
                targetArray = warningData.BestPractice;
              } else if (ruleset["name"] === "Section508") {
                targetArray = warningData.Section508;
              }
            } else if (issue["type"] === "pass") {
              if (ruleset["name"] === "A") {
                targetArray = passData.A;
              } else if (ruleset["name"] === "AA") {
                targetArray = passData.AA;
              } else if (ruleset["name"] === "AAA") {
                targetArray = passData.AAA;
              } else if (ruleset["name"] === "Best Practice") {
                targetArray = passData.BestPractice;
              } else if (ruleset["name"] === "Section508") {
                targetArray = passData.Section508;
                }
            } else if (issue["type"] === "notice") {
              if (ruleset["name"] === "A") {
                targetArray = noticeData.A;
              } else if (ruleset["name"] === "AA") {
                targetArray = noticeData.AA;
              } else if (ruleset["name"] === "AAA") {
                targetArray = noticeData.AAA;
              } else if (ruleset["name"] === "Best Practice") {
                targetArray = noticeData.BestPractice;
              } else if (ruleset["name"] === "Section508") {
                targetArray = noticeData.Section508;
              }
            }

            const existingEntry = targetArray.find(
              (entry) => entry.code === issue["code"]
            );
            if (existingEntry) {
              existingEntry.issues.push(...result.issues);
            } else {
              targetArray.push(result);
            }
          }
        });
      });
      console.log("errorData", errorData);
      console.log("warningData", warningData);
      console.log("passData", passData);
      console.log("noticeData", noticeData);
    });
  };

  // API call
  const handleTestResults = () => {
    getRulesets();
    postData();
    handleData();
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
            <Button onPress={handleData}>Data</Button>
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
          {responseData?.issues ? (
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
                  {/* <DownloadCSV csvdata={allIssues} /> */}
                </div>
                <TabPanel id="FAIL">
                  <CheckboxTable data={errorData} />
                </TabPanel>
                <TabPanel id="MANUAL">
                  <CheckboxTable data={warningData} />
                </TabPanel>
                <TabPanel id="PASS">
                  <CheckboxTable data={passData} />
                </TabPanel>
                <TabPanel id="BEST-PRACTICE">
                  <CheckboxTable data={noticeData} />
                </TabPanel>
                {/* <TabPanel id="STRUCTURE">
                  <WebsiteLandmarks html={html} />
                </TabPanel> */}
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
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
  );
};

export default Extension;
