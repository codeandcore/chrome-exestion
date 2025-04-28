document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getRegistrationId" },
      (response) => {
        if (chrome.runtime.lastError) {
          //   console.error(chrome.runtime.lastError.message);
        } else if (response && response.registrationId) {
          document.getElementById("registrationId").textContent =
            response.registrationId;
        } else {
          document.getElementById("registrationId").textContent =
            "No Registration ID found.";
        }
      }
    );
  });
});

document.getElementById("checkButton").addEventListener("click", () => {
  // Send a message to the active tab to check for the element
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "checkElement" });
  });
});
