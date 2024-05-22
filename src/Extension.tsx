import { useEffect, useState } from "react";
import { Button, Chip, Tab, TabList, TabPanel, Tabs } from "@trail-ui/react";
import {
  DownloadIcon,
  ExportIcon,
  MinusIcon,
  TrailIcon,
} from "@trail-ui/icons";
import WebsiteLandmarks from "./WebsiteLandmarks";
import CheckboxTable from "./CheckboxTable";
import { TrailAMSVerticalIcon } from "@trail-ui/icons";

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

function Extension() {
  const [responseData, setResponseData] = useState<Issues>();
  const [isLoading, setIsLoading] = useState(false);

  const [html, setHtml] = useState("");
  const apiKey = localStorage.getItem("authtoken");

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

  useEffect(() => {
    // To scrape HTML source code from current tab of webpage
    async function getCurrentTabHtmlSource() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
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

  const postData = async () => {
    setIsLoading(true);

    // To get html structure of webpage
    const htmlDocument = new DOMParser().parseFromString(html, "text/html");

    // To remove html element having id as 'trail-btn' from DOM
    const element = htmlDocument.querySelector("#trail-btn");
    if (element) {
      element.remove();
    }

    // To fetch accesibility results of webpage from Scally
    await fetch("https://trail-api.barrierbreak.com/api/test-html", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "User-Agent": "BarrierBreak Client (https://www.barrierbreak.com)",
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: htmlDocument.documentElement.outerHTML,
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

  // To handle minimise functionality
  const handleMinimise = () => {
    window.parent.postMessage("close-button-clicked", "*");
  };

  // API call
  const handleTestResults = () => {
    postData();
  };

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
            <TrailAMSVerticalIcon width={36} height={32} />
          </div>
          <Button
            appearance="default"
            onPress={handleMinimise}
            className="px-1 rounded-full focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            <MinusIcon
              width={24}
              height={24}
              role="img"
              aria-label="Minimise"
              aria-hidden="false"
            />
          </Button>
        </div>

        <div className="flex h-screen px-6">
          {responseData?.issues ? (
            <Tabs color="purple" classNames={{ tab: "border-0 py-0 pr-1.5" }}>
              <div className="flex items-center justify-between h-12 w-[564px] sticky z-[1] bg-white top-14">
                <TabList>
                  {tabData.map((tab) => (
                    <Tab id={tab.id}>
                      <div className="flex items-center gap-1 text-sm h-12">
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
                    <div className="flex items-center text-sm h-12">
                      <p>Structure</p>
                    </div>
                  </Tab>
                </TabList>
                <div className="flex gap-2">
                  <Button
                    className="font-medium"
                    appearance="text"
                    endContent={
                      <DownloadIcon
                        width={24}
                        height={24}
                        aria-label="Download"
                      />
                    }
                  >
                    CSV
                  </Button>
                  <Button
                    className="font-medium"
                    appearance="primary"
                    endContent={<ExportIcon width={24} height={24} />}
                  >
                    Export
                  </Button>
                </div>
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
          ) : (
            <div className="flex items-center justify-center w-full">
              <Button
                appearance="primary"
                onPress={handleTestResults}
                isLoading={isLoading}
              >
                Test Website
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Extension;
