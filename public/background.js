chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'RUN_AUDIT') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tabId = tabs[0].id
      chrome.tabs.sendMessage(tabId, {...request, tabId}, (response) => {
        // Handle response if needed
        sendResponse(response)
      })
    })
  } else if (request.type === 'AUDIT_RESULTS') {
    chrome.runtime.sendMessage({
      type: 'TO_REACT',
      payload: request.payload,
      tabId: request.tabId,
    })
  }
})
