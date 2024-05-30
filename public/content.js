/*global chrome*/

// To inject Trail extension button on load
const extensionBtn = new DOMParser().parseFromString(
  "<button id='trail-btn' style='display: flex; align-items: center; justify-content: center; gap: 5px; position: fixed; width: 121px; height: 40px; font-size: 16px; color: #FEFEFE; padding: 8px !important; background: #5928ED; border: 1px solid #FEFEFE !important; border-bottom: 0 !important; top: 244px; right: -72px; border-radius: 4px 4px 0px 0px !important; cursor: pointer; transform: rotate(-90deg); z-index: 9999999'><svg xmlns='http://www.w3.org/2000/svg' aria-label='Trail AMS' width='64' height='12' viewBox='0 0 64 12' fill='#FEFEFE'><path d='M0 0.806585H8.09435V2.55144H4.97867V11.7531H3.03538V2.55144H0V0.806585Z'/><path d='M9.72409 6.55144V11.7531H7.81292V4.80658L7.66838 3.47325H9.24228L9.43501 4.6749C9.78833 3.73663 10.5753 3.22634 11.3783 3.22634C11.8601 3.22634 12.3098 3.34156 12.6631 3.55556L12.3258 5.21811C11.9725 5.02058 11.6031 4.88889 11.1856 4.88889C10.3183 4.88889 9.75621 5.59671 9.72409 6.55144Z'/><path d='M19.8556 3.80247V10.1728L20.0001 11.7531H18.3459L18.2335 10.8807L18.1693 10.8642C17.6714 11.6049 16.8523 11.9671 15.969 11.9671C13.7045 11.9671 12.8212 10.321 12.8212 7.96708C12.8212 5.06996 14.2345 3.22634 16.9969 3.22634C17.5268 3.22634 18.6992 3.35802 19.8556 3.80247ZM17.9605 9.1358V4.87243C17.7196 4.7572 17.2538 4.65844 16.756 4.65844C15.2302 4.65844 14.7163 6.12346 14.7163 7.90123C14.7163 9.26749 15.0375 10.5679 16.3866 10.5679C17.3823 10.5679 17.9605 9.84362 17.9605 9.1358Z'/><path d='M23.8082 11.7531H21.897V3.47325H23.8082V11.7531ZM21.7364 1.10288C21.7364 0.493828 22.1861 0 22.8445 0C23.503 0 23.9527 0.493828 23.9527 1.10288C23.9527 1.7284 23.4869 2.1893 22.8445 2.1893C22.17 2.1893 21.7364 1.7284 21.7364 1.10288Z'/><path d='M25.7858 0.329219H27.697V9.0535C27.697 10.0741 27.9058 10.4527 28.5642 10.4527C28.8854 10.4527 29.2388 10.3374 29.576 10.1893L29.9936 11.5062C29.56 11.786 28.773 12 28.0824 12C25.9143 12 25.7858 10.6996 25.7858 9.46502V0.329219Z'/><path d='M35.4252 11.7531H33.5301L37.224 0.806585H39.4082L43.1823 11.7531H41.0945L40.1309 8.85597H36.3728L35.4252 11.7531ZM38.2518 2.65021L36.7582 7.34156H39.7454L38.3 2.65021C38.2839 2.65021 38.2518 2.65021 38.2518 2.65021Z'/><path d='M49.8312 7.96708L52.5775 0.806585H54.7135L55.2917 11.7531H53.4287L53.0272 4.21399C53.0112 4.21399 52.9951 4.21399 52.9951 4.21399L50.5218 10.535H49.0443L46.6353 4.27984C46.6353 4.27984 46.6192 4.27984 46.6031 4.27984L46.2016 11.7531H44.3386L44.9489 0.806585H47.1331L49.7991 7.96708C49.7991 7.96708 49.8152 7.96708 49.8312 7.96708Z'/><path d='M56.4035 10.8971L57.1262 9.25103C57.7365 9.64609 58.9892 10.2058 60.0974 10.2058C60.9486 10.2058 61.8158 9.92593 61.8158 8.69136C61.8158 7.65432 60.9004 7.34156 59.7762 7.02881C58.1862 6.58436 56.7087 5.94239 56.7087 3.83539C56.7087 1.82716 58.2183 0.609053 60.3222 0.609053C61.8158 0.609053 63.1649 1.28395 64 2.15638L62.9561 3.48971C62.1209 2.78189 61.2055 2.32099 60.3222 2.32099C59.5995 2.32099 58.7483 2.63375 58.7483 3.65432C58.7483 4.6749 59.6798 4.98765 60.8843 5.36626C62.3458 5.84362 63.8876 6.4856 63.8876 8.60905C63.8876 10.7819 62.3779 11.9506 60.0652 11.9506C58.4913 11.9506 56.9496 11.3086 56.4035 10.8971Z'/></svg><p style='margin-bottom: 3px' aria-hidden='true'>|</p><svg style = 'transform: rotate(90deg);' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M11.1499 18.415V20.2856H12.8202V18.415C12.8202 16.1428 13.5252 15.0743 19.9575 15.0743H23.6026C22.244 20.2113 17.5657 24 12.0005 24C6.43537 24 1.71775 20.1793 0.380914 15.0114H10.8443V13.341H0.0753561C0.0247732 12.9002 0 12.4522 0 12C0 11.5478 0.0247732 11.0998 0.0753561 10.659H3.99397C7.37992 10.659 9.29589 10.3864 10.609 9.72058C12.1037 8.96181 12.8006 7.66724 12.8006 5.64797V3.77529H11.1303V5.64797C11.1303 7.9181 10.4252 8.98864 3.99397 8.98864H0.380914C1.71671 3.81865 6.41266 0 12.0005 0C17.5884 0 22.3215 3.84859 23.6346 9.05059H13.1061V10.7209H23.9319C23.9773 11.1421 24 11.5675 24 12C24 12.4759 23.9711 12.9436 23.9184 13.405H19.9575C14.1157 13.405 11.1499 14.1803 11.1499 18.416V18.415Z' fill='#FEFEFE'/></svg></button>",
  "text/html"
).body.firstElementChild;
document.body.insertBefore(extensionBtn, document.body.firstChild);

// To inject Trail extension iframe on load
const iframe = new DOMParser().parseFromString(
  "<iframe id='trail-iframe' title='trail-extension' allow='clipboard-write' style = 'width: 0px !important; height: 100vh; position: fixed; top: 0; right: 0; border-radius: 5px; z-index: 999999; box-shadow: -8px 0px 24px 0px rgba(0, 0, 0, 0.12);'></iframe>",
  "text/html"
).body.firstElementChild;
iframe.src = chrome.runtime.getURL("index.html");
document.body.insertBefore(iframe, document.body.firstChild.nextSibling);

// To display iframe
extensionBtn.addEventListener("click", () => {
  showIframe();
});

// To handle animation of trail button on focus
extensionBtn.addEventListener("focusin", () => {
  extensionBtn.style.right = "-41px";
  extensionBtn.style.transition =
    "all 0.5s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )";
});

// To handle animation of trail button going out of focus
extensionBtn.addEventListener("focusout", () => {
  extensionBtn.style.right = "-72px";
  extensionBtn.style.transition =
    "all 0.5s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )";
});

// To handle keyboard shortcut to display / hide iframe
let keys = {};
window.addEventListener("keydown", (ev) => {
  keys[ev.key] = true;
});

window.addEventListener("keyup", () => {
  if (keys["Control"] && keys["b"]) {
    showIframe();
  }
  if (keys["Escape"]) {
    hideIframe();
  }
  keys = {};
});

// To minimize iframe
window.addEventListener("message", (event) => {
  if (event.data === "minimise-button-clicked") {
    hideIframe();
  }
});

// To show button on mouse hover
extensionBtn.addEventListener("mouseover", () => {
  extensionBtn.style.right = "-41px";
  extensionBtn.style.transition =
    "all 0.5s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )";
});

// To hide button on mouse leave
extensionBtn.addEventListener("mouseout", () => {
  extensionBtn.style.right = "-72px";
  extensionBtn.style.transition =
    "all 0.5s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )";
});

// Function to show extension iframe
function showIframe() {
  extensionBtn.style.top = "1000px";
  extensionBtn.style.transition =
    "top 1.5s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )";
  iframe.style.transition = "width 0.5s";
  iframe.style.width = "612px";
  iframe.focus();
}

// Function to hide extension iframe
function hideIframe() {
  extensionBtn.style.display = "flex";
  extensionBtn.style.top = "244px";
  extensionBtn.style.transition =
    "top 1.5s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )";
  iframe.style.transition = "width 0.5s";
  iframe.style.width = "0px";
  extensionBtn.focus();
}
