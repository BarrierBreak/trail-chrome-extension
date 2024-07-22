const insertButton = document.getElementById("insertBtn");
insertButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      { type: "INSERT_SCALLY" },
      () => {
        window.close();
      }
    );
  });
});

(() => {
  let tokenValue = document.getElementById("authToken");
  // let urlValue = document.getElementById("serverUrl");
  let saveBtn = document.getElementById("saveBtn");

  const authToken = localStorage.getItem("authToken");
  if (authToken !== null) {
    tokenValue.value = authToken;
  }

  // const serverURL = localStorage.getItem("serverUrl");
  // if (serverURL !== null) {
  //   urlValue.value = serverURL;
  // }

  saveBtn.addEventListener("click", () => {
    let data = {
      authToken: tokenValue.value,
      // serverUrl: urlValue.value,
    };

    localStorage.setItem("authToken", data.authToken);
    // localStorage.setItem("serverUrl", data.serverUrl);
    location.reload();
    window.close();
  });
})();
