/*global chrome*/

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//   console.log(response.farewell);
// });

// console.log("side-panel script loaded");

// chrome.runtime.onMessage.addListener(function (msg) {
//   if (msg == "toggle") {
//     console.log("message received");
//     toggle();
//   }
// });

// var iframe = document.createElement("iframe");
// // iframe.style.background = "green";
// iframe.style.height = "100%";
// iframe.style.width = "400px";
// iframe.style.position = "fixed";
// iframe.style.top = "0px";
// iframe.style.right = "0px";
// iframe.style.zIndex = "9000000000000000000";
// iframe.style.border = "0px";
// iframe.src = chrome.runtime.getURL("index.html");

// document.body.appendChild(iframe);

// function toggle() {
//   if (iframe.style.width == "0px") {
//     iframe.style.width = "400px";
//   } else {
//     iframe.style.width = "0px";
//   }
// }

const body = document.body.outerHTML;
console.log(body);

const extensionBtn = new DOMParser().parseFromString(
  "<button id='trail-btn' style = 'position: fixed; width: 92px; height: 40px; font-size: 20px; background: #0000FF; top: 244px; right: -26px; border-radius: 4px 4px 0px 0px; border: 0px; cursor: pointer; color: #fff; transform: rotate(-90deg); z-index: 9999}'>Trail</button>",
  "text/html"
).body.firstElementChild;
document.body.appendChild(extensionBtn);

extensionBtn.addEventListener("click", () => {
  console.log("click");
  extensionBtn.style.visibility = "hidden";
  const iframe = new DOMParser().parseFromString(
    "<iframe id='trail-iframe' style = 'width: 324px; height: 100vh; background: beige; position: fixed; top: 0; right: 0; z-index: 9999'></iframe>",
    "text/html"
  ).body.firstElementChild;
  iframe.src = chrome.runtime.getURL("index.html");
  document.body.appendChild(iframe);
});
