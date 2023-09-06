// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element by its ID
    const searchForm = document.getElementById('searchForm');
  
    // Add a submit event listener to the form
    searchForm.addEventListener('submit', function(event) {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Collect the form data
      const formData = {
        positiveTerms: document.getElementById('positiveTerms').value,
        negativeTerms: document.getElementById('negativeTerms').value,
        zipCode: document.getElementById('zipCode').value,
        distance: document.getElementById('distance').value,
        country: document.getElementById('country').value,
        timePosted: document.getElementById('timePosted').value
      };
  
      // Save the form data to Chrome's local storage
      chrome.storage.local.set(formData, function() {
        console.log('Settings saved');
        // You can add more actions here, like sending a message to the background script
      });
    });
  });
  