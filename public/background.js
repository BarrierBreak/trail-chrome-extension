// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  if (request.type === "RUN_AUDIT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      console.log('Sending RUN_AUDIT to content script, tabId:', tabId);
      chrome.tabs.sendMessage(tabId, { ...request, tabId }, (response) => {
        console.log('Received response from content script:', response);
        sendResponse(response);
      });
    });
    return true; // Indicates that sendResponse will be called asynchronously
  } else if (request.type === "AUDIT_RESULTS") {
    console.log('Forwarding AUDIT_RESULTS to React component');
    chrome.runtime.sendMessage({
      type: "TO_REACT",
      payload: request.payload,
      tabId: request.tabId,
    }, response => {
      console.log('Response from React component:', response);
      sendResponse(response);
    });
    return true; // Indicates that sendResponse will be called asynchronously
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTURE_SCREENSHOT") {
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
