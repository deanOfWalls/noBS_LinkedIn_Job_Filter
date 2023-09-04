// Variable to store the state of the overlay
let overlayVisible = false;

// Function to show the UI overlay
function showOverlay() {
  const overlayHTML = `
    <div id="overlay">
      <label for="zipCode">Zip Code:</label>
      <input type="text" id="zipCode"><br>
      
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
      <input type="checkbox" id="remote"><br>
      
      <button id="searchButton">Search</button>
    </div>
  `;
  const overlay = document.createElement('div');
  overlay.innerHTML = overlayHTML;
  document.body.appendChild(overlay);

  // Event listener for the "Search" button
  document.getElementById('searchButton').addEventListener('click', function() {
    const zipCode = document.getElementById('zipCode').value;
    const country = document.getElementById('country').value;
    const timePosted = document.getElementById('timePosted').value;
    const remote = document.getElementById('remote').checked;
    
    // Construct LinkedIn URL
    // TODO: Update this part to include new parameters
    const baseURL = "https://www.linkedin.com/jobs/search/?";
    const query = `currentJobId=${currentJobId}`;
    const fullURL = `${baseURL}${query}`;
    
    // Navigate to the URL
    window.location.href = fullURL;
  });
}

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
button.addEventListener('click', function() {
  if (overlayVisible) {
    hideOverlay();
  } else {
    currentJobId = getCurrentJobId();
    showOverlay();
  }
  overlayVisible = !overlayVisible;
});
