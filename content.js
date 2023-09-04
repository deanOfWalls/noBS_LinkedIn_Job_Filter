// Variable to store the state of the overlay
let overlayVisible = false;

function showOverlay() {
  // Retrieve saved settings
  chrome.storage.sync.get(['country', 'timePosted', 'remote'], function (items) {
    const overlayHTML = `
      <div id="overlay">
        <label for="zipCode">Zip Code:</label>
        <input type="text" id="zipCode" value=""><br>
        
        <label for="distance">Distance:</label>
        <select id="distance">
          <option value="none">None</option>
          <option value="0">0 miles</option>
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
          <option value="100">100 miles</option>
        </select><br>
        
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
      const country = document.getElementById('country').value;
      const timePosted = document.getElementById('timePosted').value;
      const remote = document.getElementById('remote').value;
      const distance = document.getElementById('distance').value;

      // Fetch location details using Zippopotamus HTTPS API
      const zipCode = document.getElementById('zipCode').value;

      if (zipCode) {
        fetch(`https://api.zippopotam.us/us/${zipCode}`)
          .then(response => response.json())
          .then(data => {
            const city = data.places[0]['place name'];
            const state = data.places[0]['state'];

            // Update the country to USA and fill city and state
            document.getElementById('country').value = 'USA';
            document.getElementById('zipCode').value = `${zipCode} ${city}, ${state}, United States`;

            // Construct LinkedIn URL
            const jobId = getCurrentJobId();
            const location = `${zipCode}, ${city}, ${state}, United States`;
            const baseURL = 'https://www.linkedin.com/jobs/search/?';
            const queryParams = new URLSearchParams({
              country: 'USA',
              currentJobId: jobId,
              geoId: 105328404,
              location: location,
              refresh: true
            });

            if (distance !== 'none') {
              queryParams.append('distance', distance);
            }

            if (timePosted === 'past24Hours') {
              queryParams.append('f_TPR', 'r86400');
            } else if (timePosted === 'pastWeek') {
              queryParams.append('f_TPR', 'r604800');
            } else if (timePosted === 'pastMonth') {
              queryParams.append('f_TPR', 'r2592000');
            }

            if (remote === 'Yes') {
              queryParams.append('f_WT', '2');
            }

            const fullURL = `${baseURL}${queryParams.toString()}`;

            // Navigate to the URL
            window.location.href = fullURL;
          })
          .catch(error => {
            console.error('An error occurred:', error);
          });
      } else {
        // No zip code entered, use country as search term
        const jobId = getCurrentJobId();
        const baseURL = 'https://www.linkedin.com/jobs/search/?';
        const queryParams = new URLSearchParams({
          currentJobId: jobId,
          country: country,
          refresh: true
        });

        if (distance !== 'none') {
          queryParams.append('distance', distance);
        }

        if (timePosted === 'past24Hours') {
          queryParams.append('f_TPR', 'r86400');
        } else if (timePosted === 'pastWeek') {
          queryParams.append('f_TPR', 'r604800');
        } else if (timePosted === 'pastMonth') {
          queryParams.append('f_TPR', 'r2592000');
        }

        if (remote === 'Yes') {
          queryParams.append('f_WT', '2');
        }

        const fullURL = `${baseURL}${queryParams.toString()}`;

        // Navigate to the URL
        window.location.href = fullURL;
      }
    });
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
button.addEventListener('click', function () {
  if (overlayVisible) {
    hideOverlay();
  } else {
    currentJobId = getCurrentJobId();
    showOverlay();
  }
  overlayVisible = !overlayVisible;
});