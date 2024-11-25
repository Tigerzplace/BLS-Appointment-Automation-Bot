chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("ita-pak.blsinternational.com")) {
    chrome.windows.create({
      url: chrome.runtime.getURL("html/popup.html") + `?tabId=${tab.id}`,
      type: "popup",
      width: 620,
      height: 650
    });
  }
});
