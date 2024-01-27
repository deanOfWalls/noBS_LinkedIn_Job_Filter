// Flag to track visibility state of the overlay
let overlayVisible = false;

// Function to construct URL with given search parameters and then navigate to it
function buildAndNavigateURL(city, state, country, geoId, keywords, distance, timePosted, remote, easyApply) {
  const jobId = getCurrentJobId(); // retrieves current job id from the url
  const baseURL = 'https://www.linkedin.com/jobs/search/?'; //base url for the job search

// Array to hold URL parameters  
  let urlParams = [
    `country=${country}`, // adds the country to the search parameters
    `currentJobId=${jobId}`, // adds the current job id to the search parameters
    `geoId=${geoId || ''}`, // adds the geographical id or an empty string if not provided
    `refresh=true`, //sets the refresh parameter to true
    `keywords=${encodeURIComponent(keywords)}`, //encodes and adds the keywords
    `f_E=2,3`  // Entry-level flag // flag for entry-level jobs
  ];
// Adds a parameter for jobs posted in the last 24 hours, if specified
  if (timePosted === 'past24Hours') {
    urlParams.push(`f_TPR=r86400`);
  }
// Adds the city and state to the location parameter, if provided
  if (city && state) {
    const location = `${city}, ${state}, ${country}`;
    urlParams.push(`location=${encodeURIComponent(location)}`);
  }
// Adds the distance parameter, unless it is set to 'none'
  if (distance !== 'none') {
    urlParams.push(`distance=${distance}`);
  }
// Adds a parameter to filter for jobs with 'Easy Apply' option
  if (easyApply === 'Yes') {
    urlParams.push(`f_AL=true`);
  }

  const fullURL = `${baseURL}${urlParams.join('&')}`;
  window.location.href = fullURL; // Navigates to the constructed URL
}

// Function to show the search overlay
function showOverlay() {
  // Retrieves user preferences from Chrome's storage
  chrome.storage.sync.get(['location', 'timePosted', 'remote', 'positiveTerms', 'negativeTerms', 'distance', 'easyApply', 'mode'], function (items) {
    // HTML content for the overlay
    const overlayHTML = `
          <div id="overlay">
              <label class="mode-label">Dark/Light Mode</label>
              <label class="switch">
                  <input type="checkbox" id="modeToggle">
                  <span class="slider"></span>
              </label>
              <label for="positiveTerms">Positive Search Terms:</label>
              <input type="text" id="positiveTerms" placeholder="E.g., entry level software developer, java" value="" autocomplete="off"><br>
              
              <label for="negativeTerms">Negative Search Terms:</label>
              <input type="text" id="negativeTerms" placeholder="E.g., senior, 5+" value="" autocomplete="off"><br>
             

              <label for="location">Location:</label>
              <select id="location">
                  <option value=", , , USA">USA</option>
                  <option value="Birmingham, Alabama, 102905961, USA">Birmingham, Alabama, USA</option>
                  <option value="Montgomery, Alabama, 105392391, USA">Montgomery, Alabama, USA</option>
                  <option value="Huntsville, Alabama, 105142920, USA">Huntsville, Alabama, USA</option>
                  <option value="Anchorage, Alaska, 101830238, USA">Anchorage, Alaska, USA</option>
                  <option value="Fairbanks, Alaska, 104572344, USA">Fairbanks, Alaska, USA</option>
                  <option value="Juneau, Alaska, 100852499, USA">Juneau, Alaska, USA</option>
                  <option value="Phoenix, Arizona, 100219842, USA">Phoenix, Arizona, USA</option>
                  <option value="Tucson, Arizona, 103752383, USA">Tucson, Arizona, USA</option>
                  <option value="Mesa, Arizona, 100558512, USA">Mesa, Arizona, USA</option>
                  <option value="Little Rock, Arkansas, 104302746, USA">Little Rock, Arkansas, USA</option>
                  <option value="Fayetteville, Arkansas, 105633049, USA">Fayetteville, Arkansas, USA</option>
                  <option value="Fort Smith, Arkansas, 102509050, USA">Fort Smith, Arkansas, USA</option>
                  <option value="Los Angeles, California, 102448103, USA">Los Angeles, California, USA</option>
                  <option value="San Diego, California, 103918656, USA">San Diego, California, USA</option>
                  <option value="San Jose, California, 106233382, USA">San Jose, California, USA</option>
                  <option value="San Francisco, California, 102277331, USA">San Francisco, California, USA</option>
                  <option value="Sacramento, California, 101857797, USA">Sacramento, California, USA</option>
                  <option value="Denver, Colorado, 103736294, USA">Denver, Colorado, USA</option>
                  <option value="Colorado Springs, Colorado, 100182490, USA">Colorado Springs, Colorado, USA</option>
                  <option value="Aurora, Colorado, 106606877, USA">Aurora, Colorado, USA</option>
                  <option value="Bridgeport, Connecticut, 100199330, USA">Bridgeport, Connecticut, USA</option>
                  <option value="New Haven, Connecticut, 101911097, USA">New Haven, Connecticut, USA</option>
                  <option value="Hartford, Connecticut, 101325776, USA">Hartford, Connecticut, USA</option>
                  <option value="Wilmington, Delaware, 105138576, USA">Wilmington, Delaware, USA</option>
                  <option value="Jacksonville, Florida, 100868799, USA">Jacksonville, Florida, USA</option>
                  <option value="Miami, Florida, 102394087, USA">Miami, Florida, USA</option>
                  <option value="Tampa, Florida, 105517665, USA">Tampa, Florida, USA</option>
                  <option value="Orlando, Florida, 105142029, USA">Orlando, Florida, USA</option>
                  <option value="Atlanta, Georgia, 106224388, USA">Atlanta, Georgia, USA</option>
                  <option value="Augusta, Georgia, 108959117, USA">Augusta, Georgia, USA</option>
                  <option value="Columbus, Georgia, 102437047, USA">Columbus, Georgia, USA</option>
                  <option value="Honolulu, Hawaii, 105879727, USA">Honolulu, Hawaii, USA</option>
                  <option value="Boise, Idaho, 102381687, USA">Boise, Idaho, USA</option>
                  <option value="Nampa, Idaho, 100748018, USA">Nampa, Idaho, USA</option>
                  <option value="Chicago, Illinois, 103112676, USA">Chicago, Illinois, USA</option>
                  <option value="Aurora, Illinois, 104382747, USA">Aurora, Illinois, USA</option>
                  <option value="Rockford, Illinois, 106717984, USA">Rockford, Illinois, USA</option>
                  <option value="Indianapolis, Indiana, 100871315, USA">Indianapolis, Indiana, USA</option>
                  <option value="Fort Wayne, Indiana, 106502857, USA">Fort Wayne, Indiana, USA</option>
                  <option value="Evansville, Indiana, 103041884, USA">Evansville, Indiana, USA</option>
                  <option value="Des Moines, Iowa, 105056705, USA">Des Moines, Iowa, USA</option>
                  <option value="Cedar Rapids, Iowa, 106585497, USA">Cedar Rapids, Iowa, USA</option>
                  <option value="Davenport, Iowa, 100918937, USA">Davenport, Iowa, USA</option>
                  <option value="Wichita, Kansas, 100652883, USA">Wichita, Kansas, USA</option>
                  <option value="Overland Park, Kansas, 104027599, USA">Overland Park, Kansas, USA</option>
                  <option value="Kansas City, Kansas, 104388316, USA">Kansas City, Kansas, USA</option>
                  <option value="Louisville, Kentucky, 108449684, USA">Louisville, Kentucky, USA</option>
                  <option value="Lexington, Kentucky, 114499923, USA">Lexington, Kentucky, USA</option>
                  <option value="Bowling Green, Kentucky, 107023414, USA">Bowling Green, Kentucky, USA</option>
                  <option value="New Orleans, Louisiana, 106689237, USA">New Orleans, Louisiana, USA</option>
                  <option value="Baton Rouge, Louisiana, 105831158, USA">Baton Rouge, Louisiana, USA</option>
                  <option value="Shreveport, Louisiana, 106758579, USA">Shreveport, Louisiana, USA</option>
                  <option value="Portland, Maine, 106827813, USA">Portland, Maine, USA</option>
                  <option value="Lewiston, Maine, 104035811, USA">Lewiston, Maine, USA</option>
                  <option value="Baltimore, Maryland, 106330734, USA">Baltimore, Maryland, USA</option>
                  <option value="Frederick, Maryland, 3730211287, USA">Frederick, Maryland, USA</option>
                  <option value="Rockville, Maryland, 100249151, USA">Rockville, Maryland, USA</option>
                  <option value="Boston, Massachusetts, 102380872, USA">Boston, Massachusetts, USA</option>
                  <option value="Worcester, Massachusetts, 104689951, USA">Worcester, Massachusetts, USA</option>
                  <option value="Springfield, Massachusetts, 100632918, USA">Springfield, Massachusetts, USA</option>
                  <option value="Detroit, Michigan, 103624908, USA">Detroit, Michigan, USA</option>
                  <option value="Grand Rapids, Michigan, 100061294, USA">Grand Rapids, Michigan, USA</option>
                  <option value="Warren, Michigan, 106646796, USA">Warren, Michigan, USA</option>
                  <option value="Minneapolis, Minnesota, 103039849, USA">Minneapolis, Minnesota, USA</option>
                  <option value="St Paul, Minnesota, 102370339, USA">Saint Paul, Minnesota, USA</option>
                  <option value="Rochester, Minnesota, 3730211287, USA">Rochester, Minnesota, USA</option>
                  <option value="Jackson, Mississippi, 100853037, USA">Jackson, Mississippi, USA</option>
                  <option value="Gulfport, Mississippi, 100960260, USA">Gulfport, Mississippi, USA</option>
                  <option value="Biloxi, Mississippi, 103699215, USA">Biloxi, Mississippi, USA</option>
                  <option value="Kansas City, Missouri, 106142749, USA">Kansas City, Missouri, USA</option>
                  <option value="St Louis, Missouri, 104428936, USA">Saint Louis, Missouri, USA</option>
                  <option value="Springfield, Missouri, 104102413, USA">Springfield, Missouri, USA</option>
                  <option value="Billings, Montana, 104158430, USA">Billings, Montana, USA</option>
                  <option value="Missoula, Montana, 103023809, USA">Missoula, Montana, USA</option>
                  <option value="Great Falls, Montana, 105928748, USA">Great Falls, Montana, USA</option>
                  <option value="Omaha, Nebraska, 100739428, USA">Omaha, Nebraska, USA</option>
                  <option value="Lincoln, Nebraska, 106469669, USA">Lincoln, Nebraska, USA</option>
                  <option value="Bellevue, Nebraska, 102457028, USA">Bellevue, Nebraska, USA</option>
                  <option value="Las Vegas, Nevada, 100293800, USA">Las Vegas, Nevada, USA</option>
                  <option value="Henderson, Nevada, 104093424, USA">Henderson, Nevada, USA</option>
                  <option value="Reno, Nevada, 106693758, USA">Reno, Nevada, USA</option>
                  <option value="Manchester, New Hampshire, 104439903, USA">Manchester, New Hampshire, USA</option>
                  <option value="Nashua, New Hampshire, 106489956, USA">Nashua, New Hampshire, USA</option>
                  <option value="Newark, New Jersey, 103913444, USA">Newark, New Jersey, USA</option>
                  <option value="Jersey City, New Jersey, 102340689, USA">Jersey City, New Jersey, USA</option>
                  <option value="Paterson, New Jersey, 102390836, USA">Paterson, New Jersey, USA</option>
                  <option value="Albuquerque, New Mexico, 104055874, USA">Albuquerque, New Mexico, USA</option>
                  <option value="Las Cruces, New Mexico, 104022305, USA">Las Cruces, New Mexico, USA</option>
                  <option value="Rio Rancho, New Mexico, 105787306, USA">Rio Rancho, New Mexico, USA</option>
                  <option value="New York City, New York, 102571732, USA">New York City, New York, USA</option>
                  <option value="Buffalo, New York, 103676418, USA">Buffalo, New York, USA</option>
                  <option value="Rochester, New York, 106553046, USA">Rochester, New York, USA</option>
                  <option value="Charlotte, North Carolina, 102264677, USA">Charlotte, North Carolina, USA</option>
                  <option value="Raleigh, North Carolina, 100197101, USA">Raleigh, North Carolina, USA</option>
                  <option value="Greensboro, North Carolina, 106414689, USA">Greensboro, North Carolina, USA</option>
                  <option value="Fargo, North Dakota, 102300628, USA">Fargo, North Dakota, USA</option>
                  <option value="Bismarck, North Dakota, 102737163, USA">Bismarck, North Dakota, USA</option>
                  <option value="Grand Forks, North Dakota, 103985908, USA">Grand Forks, North Dakota, USA</option>
                  <option value="Columbus, Ohio, 102812094, USA">Columbus, Ohio, USA</option>
                  <option value="Cleveland, Ohio, 102356711, USA">Cleveland, Ohio, USA</option>
                  <option value="Cincinnati, Ohio, 106310628, USA">Cincinnati, Ohio, USA</option>
                  <option value="Oklahoma City, Oklahoma, 101060990, USA">Oklahoma City, Oklahoma, USA</option>
                  <option value="Tulsa, Oklahoma, 101891230, USA">Tulsa, Oklahoma, USA</option>
                  <option value="Norman, Oklahoma, 100716176, USA">Norman, Oklahoma, USA</option>
                  <option value="Portland, Oregon, 104727230, USA">Portland, Oregon, USA</option>
                  <option value="Salem, Oregon, 102572422, USA">Salem, Oregon, USA</option>
                  <option value="Eugene, Oregon, 101560118, USA">Eugene, Oregon, USA</option>
                  <option value="Philadelphia, Pennsylvania, USA">Philadelphia, Pennsylvania, USA</option>
                  <option value="Pittsburgh, Pennsylvania, 104937023, USA">Pittsburgh, Pennsylvania, USA</option>
                  <option value="Allentown, Pennsylvania, 106588646, USA">Allentown, Pennsylvania, USA</option>
                  <option value="Providence, Rhode Island, 106094923, USA">Providence, Rhode Island, USA</option>
                  <option value="Columbia, South Carolina, 105682819, USA">Columbia, South Carolina, USA</option>
                  <option value="Charleston, South Carolina, 107200988, USA">Charleston, South Carolina, USA</option>
                  <option value="Greenville, South Carolina, 102419620, USA">Greenville, South Carolina, USA</option>
                  <option value="Sioux Falls, South Dakota, 103695844, USA">Sioux Falls, South Dakota, USA</option>
                  <option value="Rapid City, South Dakota, 101392951, USA">Rapid City, South Dakota, USA</option>
                  <option value="Aberdeen, South Dakota, 101815058, USA">Aberdeen, South Dakota, USA</option>
                  <option value="Nashville, Tennessee, 105573479, USA">Nashville, Tennessee, USA</option>
                  <option value="Memphis, Tennessee, 100420597, USA">Memphis, Tennessee, USA</option>
                  <option value="Knoxville, Tennessee, 104362759, USA">Knoxville, Tennessee, USA</option>
                  <option value="Houston, Texas, 103743442, USA">Houston, Texas, USA</option>
                  <option value="San Antonio, Texas, 102396835, USA">San Antonio, Texas, USA</option>
                  <option value="Dallas, Texas, 104194190, USA">Dallas, Texas, USA</option>
                  <option value="Austin, Texas, 104472865, USA">Austin, Texas, USA</option>
                  <option value="Fort Worth, Texas, 100432370, USA">Fort Worth, Texas, USA</option>
                  <option value="El Paso, Texas, 102994360, USA">El Paso, Texas, USA</option>
                  <option value="Salt Lake City, Utah, 106513356, USA">Salt Lake City, Utah, USA</option>
                  <option value="West Valley City, Utah, 104252509, USA">West Valley City, Utah, USA</option>
                  <option value="Provo, Utah, 106484743, USA">Provo, Utah, USA</option>
                  <option value="Burlington, Vermont, 101545250, USA">Burlington, Vermont, USA</option>
                  <option value="South Burlington, Vermont, 105070696, USA">South Burlington, Vermont, USA</option>
                  <option value="Virginia Beach, Virginia, 106468467, USA">Virginia Beach, Virginia, USA</option>
                  <option value="Norfolk, Virginia, 104167482, USA">Norfolk, Virginia, USA</option>
                  <option value="Chesapeake, Virginia, 106976053, USA">Chesapeake, Virginia, USA</option>
                  <option value="Seattle, Washington, 104116203, USA">Seattle, Washington, USA</option>
                  <option value="Spokane, Washington, 106141823, USA">Spokane, Washington, USA</option>
                  <option value="Tacoma, Washington, 104976816, USA">Tacoma, Washington, USA</option>
                  <option value="Charleston, West Virginia, 104911336, USA">Charleston, West Virginia, USA</option>
                  <option value="Huntington, West Virginia, 102784804, USA">Huntington, West Virginia, USA</option>
                  <option value="Parkersburg, West Virginia, 104363153, USA">Parkersburg, West Virginia, USA</option>
                  <option value="Milwaukee, Wisconsin, 105240372, USA">Milwaukee, Wisconsin, USA</option>
                  <option value="Madison, Wisconsin, 106816259, USA">Madison, Wisconsin, USA</option>
                  <option value="Green Bay, Wisconsin, 105135127, USA">Green Bay, Wisconsin, USA</option>
                  <option value="Cheyenne, Wyoming, 103451076, USA">Cheyenne, Wyoming, USA</option>
                  <option value="Casper, Wyoming, 104533488, USA">Casper, Wyoming, USA</option>
                  <option value="Laramie, Wyoming, 104574744, USA">Laramie, Wyoming, USA</option>
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

              <label for="easyApply">Easy Apply:</label>
              <select id="easyApply">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
              </select><br>
              
              <button id="searchButton">Search</button>
              <a href="http://deanwalls.com" target="_blank" id="deanWallsLink">
              
                  <span style="--i:1">h</span>
                  <span style="--i:2">t</span>
                  <span style="--i:3">t</span>
                  <span style="--i:4">p</span>
                  <span style="--i:5">:</span>
                  <span style="--i:6">/</span>
                  <span style="--i:7">/</span>
                  <span style="--i:8">d</span>
                  <span style="--i:9">e</span>
                  <span style="--i:10">a</span>
                  <span style="--i:11">n</span>
                  <span style="--i:12">w</span>
                  <span style="--i:13">a</span>
                  <span style="--i:14">l</span>
                  <span style="--i:15">l</span>
                  <span style="--i:16">s</span>
                  <span style="--i:17">.</span>
                  <span style="--i:18">c</span>
                  <span style="--i:19">o</span>
                  <span style="--i:20">m</span>
              </a>
          </div>
      `;

      const overlay = document.createElement('div'); // Creates a new div element
      overlay.innerHTML = overlayHTML; // Sets the inner HTML of the div to the overlay content
      document.body.appendChild(overlay); // Adds the overlay to the body of the document
  
    // Sets the form fields to the stored user preferences or default values
    document.getElementById('positiveTerms').value = items.positiveTerms || '';
    document.getElementById('negativeTerms').value = items.negativeTerms || '';
    document.getElementById('location').value = items.location || 'New Castle, Delaware, 101877462, USA';
    document.getElementById('distance').value = items.distance || 'none';
    document.getElementById('timePosted').value = items.timePosted || 'anytime';
    document.getElementById('remote').value = items.remote || 'No';
    document.getElementById('easyApply').value = items.easyApply || 'No';

    // Sets the light or dark mode based on user preference
    if (items.mode === 'light') {
      document.getElementById('overlay').classList.add('light-mode');
      document.getElementById('modeToggle').checked = true;
    }

    // Event listener for the mode toggle switch
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('change', function () {
      // Toggles the light-mode class and updates the mode in storage
      if (modeToggle.checked) {
        document.getElementById('overlay').classList.add('light-mode');
        chrome.storage.sync.set({ mode: 'light' });
      } else {
        document.getElementById('overlay').classList.remove('light-mode');
        chrome.storage.sync.set({ mode: 'dark' });
      }
    });

    // Event listener for the search button
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function () {
      // Retrieves values from form fields
      const locationValue = document.getElementById('location').value;
      const [city, state, geoId, country] = locationValue.split(', ');

      const timePosted = document.getElementById('timePosted').value;
      const remote = document.getElementById('remote').value;
      const distance = document.getElementById('distance').value;
      const positiveTerms = document.getElementById('positiveTerms').value;
      const negativeTerms = document.getElementById('negativeTerms').value;
      const easyApply = document.getElementById('easyApply').value;

      // Builds the keyword string, excluding negative terms
      let keywords = positiveTerms;
      if (negativeTerms) {
        const negativeTermsArray = negativeTerms.split(', ').map(term => term.trim());
        keywords = `${positiveTerms} NOT ${negativeTermsArray.join(' NOT ')}`;
      }

      // Calls function to build URL and navigate, then saves user selections and hides the overlay
      buildAndNavigateURL(city, state, country, geoId, keywords, distance, timePosted, remote, easyApply);
      saveUserSelections(locationValue, timePosted, remote, positiveTerms, negativeTerms, distance, easyApply);
      hideOverlay();
    });
  });
}

// Function to hide the overlay
function hideOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.remove();
    overlayVisible = false;
  }
}

// Function to get the current job ID from the URL
function getCurrentJobId() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const jobId = params.get('currentJobId');
  return jobId || '';
}

// Creates and adds the button to show/hide the overlay
const button = document.createElement('button');
button.id = 'overlayButton';
button.style.backgroundImage = `url(${chrome.runtime.getURL('noBS.png')})`;
document.body.appendChild(button);

// Event listener for the overlay button
button.addEventListener('click', function () {
  // Toggles the overlay visibility
  if (overlayVisible) {
    hideOverlay();
  } else {
    showOverlay();
  }
  overlayVisible = !overlayVisible;
});

// Function to save user selections to Chrome's storage
function saveUserSelections(locationValue, timePosted, remote, positiveTerms, negativeTerms, distance, easyApply) {
  chrome.storage.sync.set({
    location: locationValue,
    timePosted: timePosted,
    remote: remote,
    positiveTerms: positiveTerms,
    negativeTerms: negativeTerms,
    distance: distance,
    easyApply: easyApply,
    mode: document.getElementById('modeToggle').checked ? 'light' : 'dark'
  }, function () {
    // Logs an error message or a confirmation message
    if (chrome.runtime.lastError) {
      console.error("Error saving distance:", chrome.runtime.lastError);
    } else {
      console.log("Distance saved:", distance);
    }
  });
}

// Function to load user selections from Chrome's storage
function loadUserSelections() {
  if (chrome.storage) {
    chrome.storage.sync.get(['location', 'timePosted', 'remote', 'positiveTerms', 'negativeTerms', 'distance', 'easyApply', 'mode'], function (items) {
      // Sets form fields to stored values or defaults
      if (document.getElementById('location')) {
        document.getElementById('location').value = items.location || 'New Castle, Delaware, 101877462, USA';
      }
      if (document.getElementById('distance')) {
        document.getElementById('distance').value = items.distance || 'none';
      }
      if (document.getElementById('easyApply')) {
        document.getElementById('easyApply').value = items.easyApply || 'No';
      }
    });
  } else {
    console.error('chrome.storage is not available');
  }
}
