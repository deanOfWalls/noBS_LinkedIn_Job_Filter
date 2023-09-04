// Function to show the UI overlay
function showOverlay() {
  const overlayHTML = `
    <div id="overlay">
      <label for="zipCode">Zip Code:</label>
      <input type="text" id="zipCode">
      <!-- Add other fields here -->
      <button id="searchButton">Search</button>
    </div>
  `;
  const overlay = document.createElement('div');
  overlay.innerHTML = overlayHTML;
  document.body.appendChild(overlay);

  // Event listener for the "Search" button
  document.getElementById('searchButton').addEventListener('click', function() {
    const zipCode = document.getElementById('zipCode').value;
    // Capture other fields here
    // Construct LinkedIn URL
    const baseURL = "https://www.linkedin.com/jobs/search/?";
    const query = `currentJobId=${currentJobId}`;
    const fullURL = `${baseURL}${query}`;
    // Navigate to the URL
    window.location.href = fullURL;
  });
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
  currentJobId = getCurrentJobId();
  showOverlay();
});
