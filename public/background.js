chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "RUN_AUDIT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { ...request, tabId }, (response) => {
        sendResponse(response);
      });
    });
  } else if (request.type === "AUDIT_RESULTS") {
    chrome.runtime.sendMessage({
      type: "TO_REACT",
      payload: request.payload,
      tabId: request.tabId,
    });
  } else if (request.type === "CAPTURE_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      sendResponse({ screenshot: image });
    });
    return true;
  }
});
