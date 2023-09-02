// Wrap callback-based chrome.storage.local.get into a Promise-based function
async function getStoredKeywords() {
    return new Promise((resolve) => {
      chrome.storage.local.get("keywords", function(data) {
        console.log("Fetched stored keywords:", data.keywords); // Added for debugging
        resolve(data.keywords || []);
      });
    });
  }
  
  // Wrap callback-based chrome.storage.local.set into a Promise-based function
  async function setStoredKeywords(keywords) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ keywords: keywords }, function() {
        console.log("Stored keywords:", keywords); // Added for debugging
        resolve();
      });
    });
  }
  
  // Function to update the displayed list of keywords
  function updateKeywordList(keywords) {
    console.log("Updating keyword list with:", keywords); // Existing debug statement
    const keywordListDiv = document.getElementById("keywordList");
    keywordListDiv.innerHTML = ""; // Clear existing list
    const ul = document.createElement("ul");
    keywords.forEach(keyword => {
      const li = document.createElement("li");
      li.textContent = keyword;
      ul.appendChild(li);
    });
    keywordListDiv.appendChild(ul);
  }
  
  // Function to send updated keywords to content script
  async function sendUpdatedKeywords(keywords) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("Sending message to content script:", {action: "updateKeywords", keywords: keywords}); // Added for debugging
      chrome.tabs.sendMessage(tabs[0].id, {action: "updateKeywords", keywords: keywords});
    });
  }
  
  document.addEventListener("DOMContentLoaded", async function () {
    // Load stored keywords
    const storedKeywords = await getStoredKeywords();
    console.log("Stored keywords fetched:", storedKeywords); // Existing debug statement
    document.getElementById("keywords").value = storedKeywords.join(", ");
    updateKeywordList(storedKeywords); // Update the list
  
    // Listen for Apply Filter button click
    const applyFilterButton = document.getElementById("applyFilter");
    applyFilterButton.addEventListener("click", async function () {
      console.log("Apply Filter button clicked."); // Existing debug statement
  
      // Fetch and clean up entered keywords
      const keywords = document.getElementById("keywords").value
        .split(",")
        .map(keyword => keyword.trim().toLowerCase()); // Convert to lowercase for case-insensitive matching
  
      console.log("Keywords entered:", keywords); // Existing debug statement
  
      // Store keywords in Chrome's local storage
      await setStoredKeywords(keywords);
      console.log("Keywords saved to local storage:", keywords); // Existing debug statement
  
      // Send updated keywords to content script
      sendUpdatedKeywords(keywords);
  
      // Update the list
      updateKeywordList(keywords);
    });
  });
  