const insertButton = document.getElementById("insert-button");
insertButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      { type: "INSERT_SCALLY" },
      (response) => {
        console.log(response.status);
      }
    );
  });
});
