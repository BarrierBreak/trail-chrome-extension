chrome.devtools.panels.elements.createSidebarPane("Trail AMS", (sidebar) => {
  sidebar.setPage(chrome.runtime.getURL("src/devtools/index.html"));
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "INSPECT") {
    chrome.devtools.inspectedWindow.eval(
      `inspect(window.document.querySelector('${message.payload}'))`,
      (result, exceptionInfo) => {
        console.log(result, exceptionInfo);
      }
    );

    sendResponse({ status: "inspect" });
  }
});
