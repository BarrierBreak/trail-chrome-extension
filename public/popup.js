/*global chrome*/

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("runAudit").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: dispatchScallySendEvent,
      });
    });
  });
});

function dispatchScallySendEvent() {
  const event = new CustomEvent("scally_send", {
    detail: {
      options: {
        runners: ["htmlcs"],
        standard: "SECTIONBB",
        ignore: [],
      },
    },
  });
  window.dispatchEvent(event);
}

// Fetch the audit result from the background script
chrome.runtime.sendMessage({ action: "getAuditResult" }, (response) => {
  if (response && response.result) {
    document.getElementById("result").textContent = JSON.stringify(
      response.result,
      null,
      2
    );
  } else {
    document.getElementById("result").textContent = "No results available.";
  }
});
