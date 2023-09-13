let overlayVisible = false; // Add this line to define overlayVisible

function buildAndNavigateURL(city, state, country, geoId, keywords, distance, timePosted, remote) {
  const jobId = getCurrentJobId();
  const location = `${city}, ${state}, ${country}`;
  const baseURL = 'https://www.linkedin.com/jobs/search/?';

  let urlParams = [
    `country=${country}`,
    `currentJobId=${jobId}`,
    `geoId=${geoId}`,
    `refresh=true`,
    `keywords=${encodeURIComponent(keywords)}`,
    `f_E=2`  // Entry-level flag
  ];

  if (timePosted === 'past24Hours') {
    urlParams.push(`f_TPR=r86400`);  // Jobs posted within the last 24 hours
  }

  if (city.toLowerCase() !== 'none' && state.toLowerCase() !== 'none') {
    urlParams.push(`location=${encodeURIComponent(location)}`);
  }

  if (distance !== 'none') {
    urlParams.push(`distance=${distance}`);
  }

  const fullURL = `${baseURL}${urlParams.join('&')}`;
  window.location.href = fullURL;
}

function showOverlay() {
  chrome.storage.sync.get(['country', 'timePosted', 'remote', 'cityStateValue', 'positiveTerms', 'negativeTerms', 'distance'], function (items) {
    const overlayHTML = `
      <div id="overlay">
        <label for="positiveTerms">Positive Search Terms:</label>
        <input type="text" id="positiveTerms" value="" autocomplete="off"><br>
        
        <label for="negativeTerms">Negative Search Terms:</label>
        <input type="text" id="negativeTerms" value="" list="defaultNegativeTerms" autocomplete="off"><br>
        <datalist id="defaultNegativeTerms">
          <option value="Senior, Lead, Manager, Director, Principal, Mid, Experienced, 4+, 5+, 6+, 7+, 8+, II, III, IV, V, VI, VII, VIII"></option>
        </datalist>
        
        <label for="cityState">City/State:</label>
        <select id="cityState">
          <option value="New Castle, Delaware, 101877462">New Castle, Delaware</option>
          <option value="Philadelphia, Pennsylvania, 104937023">Philadelphia, Pennsylvania</option>
        </select><br>
        
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
        <a href="http://www.deanwalls.com" target="_blank" id="deanWallsLink">
        <span style="--i:1">w</span>
        <span style="--i:2">w</span>
        <span style="--i:3">w</span>
        <span style="--i:4">.</span>
        <span style="--i:5">d</span>
        <span style="--i:6">e</span>
        <span style="--i:7">a</span>
        <span style="--i:8">n</span>
        <span style="--i:9">w</span>
        <span style="--i:10">a</span>
        <span style="--i:11">l</span>
        <span style="--i:12">l</span>
        <span style="--i:13">s</span>
        <span style="--i:14">.</span>
        <span style="--i:15">c</span>
        <span style="--i:16">o</span>
        <span style="--i:17">m</span>
      </a>
      
      </div>
    `;
    const overlay = document.createElement('div');
    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);

    document.getElementById('positiveTerms').value = items.positiveTerms || '';
    document.getElementById('negativeTerms').value = items.negativeTerms || '';
    document.getElementById('cityState').value = items.cityState || 'New Castle, Delaware, 101877462';
    document.getElementById('distance').value = items.distance || 'none';  // Fetch distance here
    document.getElementById('country').value = items.country || 'USA';
    document.getElementById('timePosted').value = items.timePosted || 'anytime';
    document.getElementById('remote').value = items.remote || 'No';

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function () {     
   
  
      const cityStateElem = document.getElementById('cityState');
      const cityStateValue = cityStateElem.value;
      const [city, state, geoId] = cityStateValue.split(', ');

      const country = document.getElementById('country').value;
      const timePosted = document.getElementById('timePosted').value;
      const remote = document.getElementById('remote').value;
      const distance = document.getElementById('distance').value;
      const positiveTerms = document.getElementById('positiveTerms').value;
      const negativeTerms = document.getElementById('negativeTerms').value;

      // Adjust keywords formatting
      let keywords = positiveTerms;
      if (negativeTerms) {
        const negativeTermsArray = negativeTerms.split(', ').map(term => term.trim());
        keywords = `${positiveTerms} NOT ${negativeTermsArray.join(' NOT ')}`;
      }

      buildAndNavigateURL(city, state, country, geoId, keywords, distance, timePosted, remote);
      saveUserSelections(country, timePosted, remote, cityStateValue, positiveTerms, negativeTerms, distance);
      hideOverlay();
    });
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
  const jobId = params.get('currentJobId'); // Get the currentJobId from the URL parameter
  return jobId || '';
}

const button = document.createElement('button');
button.id = 'overlayButton';
button.style.backgroundImage = `url(${chrome.runtime.getURL('noBS.png')})`;
document.body.appendChild(button);

button.addEventListener('click', function () {
  if (overlayVisible) {
    hideOverlay();
  } else {
    showOverlay();
    
  }
  overlayVisible = !overlayVisible;
});

function saveUserSelections(country, timePosted, remote, cityStateValue, positiveTerms, negativeTerms, distance) {
  chrome.storage.sync.set({
    country: country,
    timePosted: timePosted,
    remote: remote,
    cityStateValue: cityStateValue,
    positiveTerms: positiveTerms,
    negativeTerms: negativeTerms,
    distance: distance
  }, function() {
    if (chrome.runtime.lastError) {
      console.error("Error saving distance:", chrome.runtime.lastError);
    } else {
      console.log("Distance saved:", distance);
    }
  });
}

function loadUserSelections() {
  if (chrome.storage) {
    chrome.storage.sync.get(['country', 'timePosted', 'remote', 'cityStateValue', 'positiveTerms', 'negativeTerms'], function (items) {
      if (document.getElementById('cityState')) {
        document.getElementById('cityState').value = items.cityStateValue || 'New Castle, Delaware, 101877462';
      }
      if (document.getElementById('distance')) {
        document.getElementById('distance').value = items.distance || 'none';
      }
    });
  } else {
    console.error('chrome.storage is not available');
  }
}
