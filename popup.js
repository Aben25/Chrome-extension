document.addEventListener('DOMContentLoaded', function() {
  const loadingElement = document.getElementById('loading');
  const summaryElement = document.getElementById('summary');

  document.getElementById('summarize').addEventListener('click', function() {
    loadingElement.classList.remove('hidden');
    summaryElement.classList.add('hidden');

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let tab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: getSelectedText,
        },
        function(result) {
          const selectedText = result[0].result;
          chrome.runtime.sendMessage({ action: "summarize", text: selectedText }, function(response) {
            const summary = response.summary;
            loadingElement.classList.add('hidden');
            summaryElement.classList.remove('hidden');
            summaryElement.textContent = summary;
            readText(summary);
          });
        }
      );
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
    loadingElement.classList.add('hidden');
    summaryElement.classList.remove('hidden');
    summaryElement.textContent = summary;
  });
});

