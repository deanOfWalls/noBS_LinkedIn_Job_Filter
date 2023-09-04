// Variable to store the state of the overlay
let overlayVisible = false;

// Function to show the UI overlay
function showOverlay() {
  // Retrieve saved settings
  chrome.storage.sync.get(['zipCode', 'country', 'timePosted', 'remote'], function (items) {
    const overlayHTML = `
        <div id="overlay">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" value="${items.zipCode || ''}"><br>
          
          <label for="country">Country:</label>
          <select id="country">
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <!-- Add more countries here -->
          </select><br>
          
          <label for="timePosted">Time Posted:</label>
          <select id="timePosted">
            <option value="anytime">Any time</option>
            <option value="pastMonth">Past Month</option>
            <option value="pastWeek">Past Week</option>
            <option value="past24Hours">Past 24 hours</option>
          </select><br>
          
          <label for="remote">Remote:</label>
          <select id="remote">
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select><br>
          
          <button id="searchButton">Search</button>
        </div>
      `;
    const overlay = document.createElement('div');
    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);

    // Set saved values to the elements
    document.getElementById('country').value = items.country || 'USA';
    document.getElementById('timePosted').value = items.timePosted || 'anytime';
    document.getElementById('remote').value = items.remote || 'No';

    // Event listener for the "Search" button
    document.getElementById('searchButton').addEventListener('click', function () {
      const zipCode = document.getElementById('zipCode').value;
      const country = document.getElementById('country').value;
      const timePosted = document.getElementById('timePosted').value;
      const remote = document.getElementById('remote').value;

      // Save settings
      chrome.storage.sync.set({
        zipCode: zipCode,
        country: country,
        timePosted: timePosted,
        remote: remote
      });

      // Construct LinkedIn URL
      const baseURL = "https://www.linkedin.com/jobs/search/?";
      let query = `currentJobId=${getCurrentJobId()}`;

      if (zipCode) {
        query += `&location=${zipCode}`;
      }

      if (country) {
        query += `&country=${country}`;
      }

      if (timePosted === 'past24Hours') {
        query += `&f_TPR=r86400`;
      } else if (timePosted === 'pastWeek') {
        query += `&f_TPR=r604800`;
      } else if (timePosted === 'pastMonth') {
        query += `&f_TPR=r2592000`;
      }

      if (remote === 'Yes') {
        query += `&f_WT=2`;
      }

      const fullURL = `${baseURL}${query}`;

      // Navigate to the URL
      window.location.href = fullURL;
    });
  });
}

// ... rest of the code


// Function to hide the UI overlay
function hideOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Function to get the currentJobId from the URL
function getCurrentJobId() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get('currentJobId');
}

// Declare and initialize the button variable
const button = document.createElement('button');
button.id = 'overlayButton';
button.style.backgroundImage = `url(${chrome.runtime.getURL('noBS.png')})`;
document.body.appendChild(button);

// Log for debugging
console.log('Content script running');
console.log(button);
console.log(chrome.runtime.getURL('noBS.png'));

// Variable to store the currentJobId
let currentJobId = null;

// Event listener for the overlay button
button.addEventListener('click', function () {
  if (overlayVisible) {
    hideOverlay();
  } else {
    currentJobId = getCurrentJobId();
    showOverlay();
  }
  overlayVisible = !overlayVisible;
});
