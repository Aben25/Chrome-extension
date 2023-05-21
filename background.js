

// let summary = '';  // Variable to store the summary

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.action == "summarize") {
//     console.log('Received summarize request:', request.text);
//     fetch('http://localhost:3000/summarize', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({text: request.text})
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Received summary from server:', data.summary);
//       summary = data.summary;  // Store the summary
//       sendResponse({summary: data.summary});
//     })
//     .catch(error => console.error('Error:', error));
//   } else if (request.action == "getSummary") {
//     console.log('Received getSummary request');
//     sendResponse({summary: summary});  // Send the stored summary
//   }
//   return true; // Keeps the message channel open until sendResponse is called
// });
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "summarize") {
      fetch('http://localhost:3000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: request.text })
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
    } else if (request.action == "getSummary") {
      // Retrieve the summary from storage (e.g., variable or database)
      const summary = 'This is a sample summary'; // Replace with the actual summary
  
      sendResponse({ summary: summary });
    }
    return true; // Keeps the message channel open until sendResponse is called
  });
  