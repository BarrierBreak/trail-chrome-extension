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
import WebsiteLandmarks from "./WebsiteLandmarks";
import CheckboxTable from "./CheckboxTable";
import DownloadCSV from "./DownloadCSV";

export interface IssueItems {
  issues: {
    clip: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
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
  }[];
}

export interface Issues {
  issues: {
    errors: {
      code: string;
      conformance_level: string;
      criteria_name: string;
      element: string;
      failing_issue_variable: string;
      failing_technique: string;
      id: string;
      issues: {
        clip: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
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
      }[];
      message: string;
      occurences: string;
      rule_name: string;
      severity: string;
    }[];
    warnings: {
      code: string;
      conformance_level: string;
      criteria_name: string;
      element: string;
      failing_issue_variable: string;
      failing_technique: string;
      id: string;
      issues: {
        clip: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
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
      }[];
      message: string;
      occurences: string;
      rule_name: string;
      severity: string;
    }[];
    pass: {
      code: string;
      conformance_level: string;
      criteria_name: string;
      element: string;
      failing_issue_variable: string;
      failing_technique: string;
      id: string;
      issues: {
        clip: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
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
      }[];
      message: string;
      occurences: string;
      rule_name: string;
      severity: string;
    }[];
    notices: {
      code: string;
      conformance_level: string;
      criteria_name: string;
      element: string;
      failing_issue_variable: string;
      failing_technique: string;
      id: string;
      issues: {
        clip: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
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
      }[];
      message: string;
      occurences: string;
      rule_name: string;
      severity: string;
    }[];
  };
}

const Extension = () => {
  const [responseData, setResponseData] = useState<Issues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [html, setHtml] = useState("");
  const [currentURL, setCurrentURL] = useState("");
  const apiKey = localStorage.getItem("authtoken");
  const [selectedTool, setSelectedTool] = useState<Selection>(new Set([]));

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

  const tabData = [
    { id: "FAIL", label: "Fail", issues: responseData?.issues.errors.length },
    {
      id: "MANUAL",
      label: "Manual",
      issues: responseData?.issues.warnings.length,
    },
    { id: "PASS", label: "Pass", issues: responseData?.issues.pass.length },
    {
      id: "BEST-PRACTICE",
      label: "BP",
      issues: responseData?.issues.notices.length,
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
    const elements = htmlDocument.querySelectorAll("[href], [src]");
    elements.forEach((element) => {
      const href = element.getAttribute("href");
      const src = element.getAttribute("src");
      const srcSet = element.getAttribute("srcset");

      href &&
        href.startsWith("/") &&
        element.setAttribute("href", href.slice(1));
      src && src.startsWith("/") && element.setAttribute("src", src.slice(1));
      srcSet &&
        srcSet.startsWith("/") &&
        element.setAttribute("srcset", srcSet.slice(1));

      if (href && !href.startsWith("http") && !href.startsWith("//")) {
        element.setAttribute("href", `${currentURL}${href}`);
      }

      if (src && !src.startsWith("http") && !src.startsWith("//")) {
        element.setAttribute("src", `${currentURL}${src}`);
      }

      if (srcSet) {
        const srcSetArray = srcSet.split(",");
        const newSrcSetArray = srcSetArray.map((src) => {
          if (!src.trim().startsWith("http") && !src.trim().startsWith("//")) {
            return `${currentURL}${src.trim()}`;
          }
          return src;
        });
        element.setAttribute("srcset", newSrcSetArray.join(","));
      }

      // console.log(src, srcSet, href);
    });

    return htmlDocument;
  };

  const postData = async () => {
    setIsLoading(true);

    const htmlDocument = new DOMParser().parseFromString(html, "text/html");

    // To convert absolute URLs to relative URLs
    const newhtmlcode=convertAbsoluteToRelative(htmlDocument);

    // console.log("HTML:", htmlDocument.documentElement.outerHTML);

    const element = newhtmlcode.querySelector("#trail-btn");
    if (element) {
      element.remove();
    }

    // To fetch accesibility results of webpage from Scally
    await fetch("https://trail-api.barrierbreak.com/api/test-html", {
    // await fetch("https://trail-api.barrierbreak.com/api/extension-html", {
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

  // To handle tab order
  // const handleTabOrder = () => {
  //   let msg: string;
  //   setIsTabOrderSelected(!isTabOrderSelected);
  //   isTabOrderSelected ? (msg = "hide-tab-order") : (msg = "show-tab-order");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle list tags
  // const handleList = () => {
  //   let msg: string;
  //   setIsListSelected(!isListSelected);
  //   isListSelected ? (msg = "hide-list-tags") : (msg = "show-list-tags");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle landmarks
  // const handleLandmarks = () => {
  //   let msg: string;
  //   setIsLandmarkSelected(!isLandmarkSelected);
  //   isLandmarkSelected ? (msg = "hide-landmarks") : (msg = "show-landmarks");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle alt text
  // const handleAltText = () => {
  //   let msg: string;
  //   setIsAltTextSelected(!isAltTextSelected);
  //   isAltTextSelected ? (msg = "hide-alt-text") : (msg = "show-alt-text");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle links
  // const handleLinks = () => {
  //   let msg: string;
  //   setIsLinkSelected(!isLinkSelected);
  //   isLinkSelected ? (msg = "hide-links") : (msg = "show-links");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle forms
  // const handleForms = () => {
  //   let msg: string;
  //   setIsFormSelected(!isFormSelected);
  //   isFormSelected ? (msg = "hide-forms") : (msg = "show-forms");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle headings
  // const handleHeading = () => {
  //   let msg: string;
  //   setIsHeadingSelected(!isHeadingSelected);
  //   isHeadingSelected ? (msg = "hide-headings") : (msg = "show-headings");
  //   window.parent.postMessage(msg, "*");
  // };

  // To handle minimise functionality
  const handleMinimise = () => {
    window.parent.postMessage("minimise-button-clicked", "*");
  };

  // API call
  const handleTestResults = () => {
    postData();
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
                {/* <MenuItem id="form" classNames={{ title: "text-base" }}>
                  Form
                </MenuItem> */}
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
                  <DownloadCSV csvdata={responseData} />
                </div>
                <TabPanel id="FAIL">
                  <CheckboxTable data={responseData} issueType="errors" />
                </TabPanel>
                <TabPanel id="MANUAL">
                  <CheckboxTable data={responseData} issueType="warnings" />
                </TabPanel>
                <TabPanel id="PASS">
                  <CheckboxTable data={responseData} issueType="pass" />
                </TabPanel>
                <TabPanel id="BEST-PRACTICE">
                  <CheckboxTable data={responseData} issueType="notices" />
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
