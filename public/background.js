// /*global chrome*/

// // Add background scripts here

// let auditResult = null;

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "sendAuditResult") {
//     console.log("Received audit result:", request.result);
//     auditResult = request.result;

//     const allIssues = auditResult.issues;

//     const message = {
//       type: "rulesets",
//       issues: allIssues,
//     };

//     // Post the message to the parent window
//     window.parent.postMessage(message, "*");
//     const error = [];
//     const warning = [];
//     const pass = [];

//     // console.log("all issues", allIssues);
//     allIssues.forEach((issue) => {
//       switch (issue.type) {
//         case "error":
//           error.push(issue);
//           break;
//         case "warning":
//           warning.push(issue);
//           break;
//         case "pass":
//           pass.push(issue);
//           break;
//         default:
//           break;
//       }
//     });

//     console.log("error", error);
//     console.log("warning", warning);
//     console.log("pass", pass);
//   }
//   sendResponse({ status: "received" });
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getAuditResult") {
//     sendResponse({ result: auditResult });
//   }
// });
