let auditResult = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log("Message received in background script:", request);

  // reset the stored audit result on page refresh
  if (request.action === "resetAuditResult") {
    auditResult = null;
    // console.log("Audit result reset:", auditResult);

    sendResponse({
      message: "Audit result reset successfully",
      result: auditResult,
    });

    chrome.storage.session.set({
      auditResult: auditResult,
    });
  } else if (request.action === "sendAuditResult") {
    auditResult = request.result;
    // console.log("Audit result stored:", auditResult);

    sendResponse({
      message: "Audit result received successfully",
      result: auditResult,
    });

    chrome.storage.session.set({
      auditResult: auditResult,
    });
  } else if (request.action === "getAuditResult") {
    // console.log("Sending audit result:", auditResult);

    sendResponse({ result: auditResult });
  } else if (request.action === "updateResult") {
    auditResult = request.result;
    // console.log("Audit result updated:", auditResult);

    sendResponse({
      message: "Audit result updated successfully",
      result: auditResult,
    });

    chrome.storage.session.set({
      auditResult: auditResult,
    });
  }
});
