chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.registrationId) {
    console.log(`Received Registration ID: ${message.registrationId}`);
  }
});
