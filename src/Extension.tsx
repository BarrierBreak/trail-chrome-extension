import { useEffect, useState } from "react";
import { Button, Chip, Tab, TabList, TabPanel, Tabs } from "@trail-ui/react";
import {
  CloseFilledIcon,
  DownloadIcon,
  ExportIcon,
  TrailIcon,
} from "@trail-ui/icons";
import WebsiteLandmarks from "./WebsiteLandmarks";
import CheckboxTable from "./CheckboxTable";

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

  // To handle close functionality
  const handleClose = () => {
    window.parent.postMessage("close-button-clicked", "*");
  };

  // API call
  const handleTestResults = () => {
    postData();
  };

  return (
    <main className="font-poppins">
      <div className="w-full" aria-label="Trail" role="modal">
        <div className="flex justify-between items-center border-b border-neutral-200 h-14 pl-6 pr-5 py-2">
          <div className="flex items-center gap-1">
            <TrailIcon
              width={40}
              height={40}
              className="text-purple-600"
              aria-label="Trail AMS"
              aria-hidden="false"
              role="img"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="32"
              viewBox="0 0 36 32"
              fill="#19171D"
            >
              <path d="M0 2.97694V0.941269H9.72378V2.97694H6.00019V13.7122H3.64642V2.97694H0Z" />
              <path d="M9.62744 4.05215H11.5182L11.7497 5.43487C12.1741 4.35942 13.1195 3.76408 14.0842 3.76408C14.663 3.76408 15.2611 3.89852 15.6276 4.12897L15.2225 6.0302C14.8366 5.83816 14.3543 5.68452 13.8527 5.68452C12.8108 5.68452 12.1356 6.51031 12.097 7.62417V13.712H9.80108V5.5885L9.62744 4.05215Z" />
              <path d="M15.8203 9.29495C15.8203 5.91498 17.4988 3.76408 20.8173 3.76408C21.4732 3.76408 22.8816 3.91772 24.2514 4.43624V11.8683L24.4444 13.712H22.4572L22.3221 12.6941L22.245 12.6749C21.724 13.4239 20.8751 14 19.5825 14C16.6692 14 15.8203 11.8107 15.8203 9.29495ZM21.9941 10.6585V5.68452C21.7047 5.55009 21.1259 5.41566 20.5279 5.41566C18.695 5.41566 18.0776 7.14406 18.0776 9.21813C18.0776 10.7929 18.4828 12.31 20.0841 12.31C21.3189 12.31 21.9941 11.4843 21.9941 10.6585Z" />
              <path d="M26.2773 1.26749C26.2773 0.576131 26.7983 0 27.5893 0C28.3803 0 28.9205 0.556927 28.9205 1.26749C28.9205 1.97805 28.361 2.55418 27.5893 2.55418C26.8176 2.55418 26.2773 2.01646 26.2773 1.26749ZM28.7469 4.05213V13.7119H26.451V4.05213H28.7469Z" />
              <path d="M30.9453 10.5817V0.364967H33.2605V10.5433C33.2605 11.7532 33.5113 12.1949 34.3023 12.1949C34.6689 12.1949 35.0934 12.0604 35.4985 11.8876L36.0001 13.424C35.4599 13.7888 34.5339 14.0001 33.7042 14.0001C31.0997 14.0001 30.9453 12.3101 30.9453 10.5817Z" />
              <path d="M6.96041 19.2278L11.4295 31.7749H8.97626L7.83521 28.4542H3.40413L2.2821 31.7749H0L4.29796 19.2278H6.96041ZM5.62918 21.341H5.57213L3.86055 26.6995H7.37879L5.62918 21.341Z" />
              <path d="M15.9746 19.2278L19.1315 27.4164H19.1695L22.4025 19.2278H24.9508L25.6355 31.7749H23.4294L22.954 23.1334H22.916L19.9873 30.3598H18.2377L15.385 23.2089H15.347L14.8716 31.7749H12.6655L13.3882 19.2278H15.9746Z" />
              <path d="M26.9858 30.7925L27.8416 28.8868C28.5643 29.3585 30.0477 30 31.3599 30C32.3868 30 33.3947 29.6792 33.3947 28.2641C33.3947 27.0755 32.2917 26.717 30.9795 26.3019C29.306 25.8113 27.3472 25.1132 27.3472 22.6981C27.3472 20.283 29.1348 19 31.6261 19C33.3947 19 34.9922 19.7736 36.0001 20.7736L34.764 22.3019C33.7561 21.4906 32.6721 20.9623 31.6451 20.9623C30.7703 20.9623 29.7814 21.3208 29.7814 22.4906C29.7814 23.6604 30.8654 24.0189 32.2917 24.4717C34.0223 25.0189 35.848 25.7358 35.848 28.1698C35.848 30.6038 34.0794 32 31.3218 32C29.4771 32 27.6324 31.2642 26.9858 30.7925Z" />
            </svg>
          </div>
          <button
            onClick={handleClose}
            className="focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            <CloseFilledIcon
              width={24}
              height={24}
              aria-label="Close"
              aria-hidden="false"
              role="img"
            />
          </button>
        </div>

        <div className="flex h-screen px-6">
          {responseData?.issues ? (
            <Tabs color="purple">
              <div className="flex items-center justify-between h-12 w-[564px]">
                <TabList>
                  {tabData.map((tab) => (
                    <Tab id={tab.id}>
                      <div className="flex items-center gap-1 font-medium text-sm h-12">
                        <p>{tab.label}</p>
                        <Chip
                          variant="solid"
                          color="default"
                          size="md"
                          radius="full"
                          children={`${tab.issues}`}
                          classNames={{
                            base: "p-0 h-[18px] min-w-7",
                            content: "text-xs text-center px-2 py-0",
                          }}
                        />
                      </div>
                    </Tab>
                  ))}
                  <Tab id="STRUCTURE">
                    <div className="flex items-center font-medium text-sm h-12">
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
