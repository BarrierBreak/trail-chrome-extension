// /*global chrome*/

// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["content.js"],
//   });
// });

// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.sendMessage(tab.id, "toggle");
//   console.log("message sent");
// });

// chrome.action.onClicked.addListener(() => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const currentTab = tabs[0];
//     chrome.tabs.sendMessage(currentTab.id, "toggle");
//     console.log("message sent");
//   });
// });

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("hello bg script");
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(
//     sender.tab ? "from content script:" + sender.tab.url : "from extension"
//   );
//   if (request.greeting === "hello") {
//     sendResponse({ farewell: "goodbye" });
//   }
// });
