chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "summarizeContextMenu",
    title: "Summarize Selected Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "summarizeContextMenu") {
    chrome.tabs.sendMessage(tab.id, { action: "summarize" });
    
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "summarize") {
    fetch('http://localhost:3000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: request.text }),
    })
      .then(response => response.json())
      .then(data => {
        const summary = data.result;
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "displaySummary", summary: summary });
        });
        sendResponse({ summary: summary });
      })
      .catch(error => console.error('Error:', error));
  } else if (request.action === "getSummary") {
    const summary = 'This is a sample summary'; // Replace with the actual summary
    sendResponse({ summary: summary });
  }
  return true;
});
