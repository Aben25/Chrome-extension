document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('summarize').addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: getSelectedText
        }, function(result) {
          const selectedText = result[0].result;
          chrome.runtime.sendMessage({ action: "summarize", text: selectedText }, function(response) {
            const summary = response.summary;
            document.getElementById('summary').textContent = summary;
            readText(summary); // Read the summarized text aloud
          });
        });
      });
    });
  
    function getSelectedText() {
      return window.getSelection().toString();
    }
  
    function readText(text) {
      const speechSynthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  
    // Request the summary from the background script when the popup is opened
    chrome.runtime.sendMessage({ action: "getSummary" }, function(response) {
      const summary = response.summary;
      document.getElementById('summary').textContent = summary;
    });
  });
  