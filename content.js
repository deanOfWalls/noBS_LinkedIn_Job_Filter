// Function to filter job listings based on keywords
function filterJobListings(keywords) {
    const jobListings = document.querySelectorAll(".job-card-container"); // Updated selector
    jobListings.forEach(listing => {
      const titleElement = listing.querySelector("a.job-card-list__title"); // Updated selector based on your HTML snippet
      if (titleElement) {
        const title = titleElement.textContent.toLowerCase();
        const shouldHide = keywords.some(keyword => title.includes(keyword));
        if (shouldHide) {
          listing.style.display = "none";
        }
      }
    });
  }
  
  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateKeywords') {
      console.log("Received message:", message);
      console.log("Filtering job listings with keywords:", message.keywords);
      filterJobListings(message.keywords);
    }
  });
  