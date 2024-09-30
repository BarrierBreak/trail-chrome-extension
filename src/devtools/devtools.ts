chrome.devtools.panels.elements.createSidebarPane("Trail AMS", (sidebar) => {
  sidebar.setPage(chrome.runtime.getURL("src/devtools/index.html"));
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "INSPECT") {
    sendResponse(chrome.devtools.inspectedWindow.eval(
      `inspect(window.document.querySelector('${message.payload}'))`
    ));
  }
});
