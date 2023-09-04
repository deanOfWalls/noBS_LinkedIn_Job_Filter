// Variable to store the state of the overlay
let overlayVisible = false;

function showOverlay() {
  // Retrieve saved settings
  chrome.storage.sync.get(['country', 'timePosted', 'remote'], function (items) {
    const overlayHTML = `
      <div id="overlay">
        <label for="zipCode">Zip Code:</label>
        <input type="text" id="zipCode" value="" autocomplete="off"><br>
        
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
    if (document.getElementById('country')) {
      document.getElementById('country').value = items.country || 'USA';
    }
    if (document.getElementById('timePosted')) {
      document.getElementById('timePosted').value = items.timePosted || 'anytime';
    }
    if (document.getElementById('remote')) {
      document.getElementById('remote').value = items.remote || 'No';
    }

    // Event listener for the "Search" button
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        const countryElem = document.getElementById('country');
        const timePostedElem = document.getElementById('timePosted');
        const remoteElem = document.getElementById('remote');
        const distanceElem = document.getElementById('distance');
        const zipCodeElem = document.getElementById('zipCode');

        const country = countryElem ? countryElem.value : null;
        const timePosted = timePostedElem ? timePostedElem.value : null;
        const remote = remoteElem ? remoteElem.value : null;
        const distance = distanceElem ? distanceElem.value : null;
        const zipCode = zipCodeElem ? zipCodeElem.value : null;

        // Fetch location details using Zippopotamus HTTPS API
        if (zipCode) {
          fetch(`https://api.zippopotam.us/us/${zipCode}`)
            .then(response => response.json())
            .then(data => {
              const city = data.places[0]['place name'];
              const state = data.places[0]['state'];
              const country = 'United States'; // You can also fetch this dynamically if needed
              // Update the country to USA and fill city and state
              if (document.getElementById('country') && document.getElementById('zipCode')) {
                document.getElementById('country').value = 'USA';
                document.getElementById('zipCode').value = `${city}, ${state}`;
              }

              // Construct LinkedIn URL
              const jobId = getCurrentJobId();
              const location = `${zipCode}, ${city}, ${state}, ${country}`;
              const geoId = '102233366'; // This should ideally be dynamically determined
              const baseURL = 'https://www.linkedin.com/jobs/search/?';
              const queryParams = new URLSearchParams({
                country: 'USA',
                currentJobId: jobId,
                geoId: geoId,
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

              // Navigate to the URL
              const fullURL = `${baseURL}${queryParams.toString()}`;
              window.location.href = fullURL;

              saveUserSelections(country, timePosted, remote);
              hideOverlay();

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

          saveUserSelections(country, timePosted, remote);
          hideOverlay();

        }
      });
    } else {
      console.error('Search button element not found');
    }
  });
}

function hideOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.remove();
    overlayVisible = false;
  }
}

function getCurrentJobId() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get('currentJobId');
}

const button = document.createElement('button');
button.id = 'overlayButton';
button.style.backgroundImage = `url(${chrome.runtime.getURL('noBS.png')})`;
document.body.appendChild(button);

console.log('Content script running');
console.log(button);
console.log(chrome.runtime.getURL('noBS.png'));

let currentJobId = null;

button.addEventListener('click', function () {
  console.log('Overlay button clicked');

  if (overlayVisible) {
    hideOverlay();
  } else {
    currentJobId = getCurrentJobId();
    showOverlay();
  }
  overlayVisible = !overlayVisible;
});

function saveUserSelections(country, timePosted, remote) {
  chrome.storage.sync.set({
    country: country,
    timePosted: timePosted,
    remote: remote
  });
}

function loadUserSelections() {
  if (chrome.storage) {
    chrome.storage.sync.get(['country', 'timePosted', 'remote'], function (items) {
      if (document.getElementById('country')) {
        document.getElementById('country').value = items.country || 'USA';
      }
      if (document.getElementById('timePosted')) {
        document.getElementById('timePosted').value = items.timePosted || 'anytime';
      }
      if (document.getElementById('remote')) {
        document.getElementById('remote').value = items.remote || 'No';
      }
    });
  } else {
    console.error('chrome.storage is not available');
  }
}