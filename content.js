// contentScript.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getRegistrationId") {
    const params = new URLSearchParams(window.location.search);
    const registrationId = params.get("registrationId");

    // Send the response back to the popup
    sendResponse({ registrationId: registrationId });
  } else {
  }
});

// Listen for URL changes
window.addEventListener("popstate", checkURLChangeAndTrigger);

// Monitor pushState or replaceState changes
(function (history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({ state: state });
    }
    checkURLChangeAndTrigger();
    return pushState.apply(history, arguments);
  };

  history.replaceState = function (state) {
    if (typeof history.onreplacestate == "function") {
      history.onreplacestate({ state: state });
    }
    checkURLChangeAndTrigger();
    return replaceState.apply(history, arguments);
  };
})(window.history);

// Function to detect URL change from date-select to slot-select
function checkURLChangeAndTrigger() {
  const currentURL = window.location.href;

  if (currentURL.includes("slot-select") && currentURL.includes("travelDate")) {
    checkTravelDateAndRefresh();
  }
}

// Check parameters on page load
document.addEventListener("DOMContentLoaded", checkTravelDateAndRefresh());


document.querySelector('[role="alertdialog"] .bg-primary').addEventListener("click", function() {
  setTimeout(function(){
    checkTravelDateAndRefresh();
  },800);
});

function checkTravelDateAndRefresh() {
  console.log("Extension Auto Load");

  // Get current URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const travelDate = urlParams.get("travelDate");
  const slotId = urlParams.get("slotId");

  if (travelDate) {
    setTimeout(function(){
      const noSlotElement = document.querySelector(
        ".slotSelectionContainer .grid-container"
      );
      const noSlotElementclick = document.querySelector(
        ".grid-container .grid-item a"
      );
  
      if (!noSlotElement) {
        console.log("No slot available. Refreshing the page...");
  
        if (!slotId) {
          setInterval(() => {
            // window.location.reload();
          }, 1000);
        } else {
        }
      } else {
        console.log("Slot is available, no need to refresh.");
  
        console.log(noSlotElementclick);
  
        if (noSlotElementclick) {
          noSlotElementclick.click();
  
          // check and select person
          setTimeout(function(){
            const passengerLengthElement =
              document.querySelector(".passengerLength");
            if (passengerLengthElement) {
              const passengerText = passengerLengthElement.textContent.trim();
              const selectedPassengers = passengerText
                .split("/")[1]
                .trim()
                .split(" ")[0];
              console.log(`Passengers Selected: ${selectedPassengers}`);
    
              // select passenger
              let checkboxes;
    
              setTimeout(function () {
                checkboxes = document.querySelectorAll(
                  '.selectTravellingAccordion tr input[type="checkbox"]'
                );
    
                Array.from(checkboxes).forEach((checkbox, index) => {
                  // Check if we need to select this checkbox based on the selectedPassengers count
                  if (index < selectedPassengers) {
                    // Set the 'checked' property to true
                    checkbox.checked = true;
    
                    const parentElement = checkbox.parentNode;
                    const peerElement = parentElement.querySelector(".peer");
    
                    if (peerElement) {
                      peerElement.setAttribute("aria-checked", "true");
                      peerElement.setAttribute("data-state", "checked");
                      checkbox.dispatchEvent(new Event("change"));
                      peerElement.dispatchEvent(
                        new MouseEvent("click", {
                          bubbles: true,
                          cancelable: true,
                        })
                      );
    
                      setTimeout(() => {
                        //trigger book button
                        console.log("checkbox checked", (checkbox, index));
                        const bookButton = document.querySelector(
                          '.selectTravellingAccordion button[type="submit"]'
                        );
                        if (bookButton) {
                          const clickEvent = new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                          });
                          bookButton.dispatchEvent(clickEvent);
                        }
                      }, 500);
                    }
                  } else {
                    // Uncheck the remaining checkboxes
                    checkbox.checked = false;
                  }
                });
              }, 500);
    
              setTimeout(function () {
                console.log("clicked");
                document
                  .querySelector("form .place-content-center button[type=submit]")
                  .click();
              }, 500);
            } else {
              console.log("passengerLength element not found.");
            }
          },700)
  
        } else {
          console.log("No clickable element found.");
        }
      }
    },500)
  } else {
    console.log("No travel date found in the URL.");
  }
}

function startPollingForElement() {
  const interval = setInterval(() => {
    if (document.readyState === "complete") {
      checkTravelDateAndRefresh();
      clearInterval(interval); // Stop polling once we check
    }
  }, 100);
}

// Start function
startPollingForElement();
