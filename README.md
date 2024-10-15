# [POC] Google Places Autocomplete

Switch to branch `places/api/v2` for the Google Places (New) API: https://github.com/jggcabana/google-places-autocomplete/tree/places/api/v2

### Overview
- A minimal Node.js app to test/utilize the Google Places Autocomplete API.
- Uses jQuery + Bootstrap for component styling.

### Features
- Autocomplete address searchbox - form input with Google Places Autocomplete.
- Auto-populated address fields - form inputs that will populate on value change of the autocomplete input.
- Debounced input - includes a debounced handler for input events, so that the Google Places API is not requested for each keystroke.

### Local Development Setup
- Requires Node.js - https://nodejs.org/en
- Requires a Google Places API Key. Create an account and generate your key - [Overview | Places API | Google for Developers](https://developers.google.com/maps/documentation/places/web-service/overview)
- Replace the `$API-KEY` with your key in the query parameter, found in `./public/index.html`.
	```
	...
	<script src="https://maps.googleapis.com/maps/api/js?key=$API-KEY&libraries=places&v=weekly" defer></script>
	...
	```
- In the root directory, run `npm start`. Make sure you've restored the needed node packages in the root directory (`npm install`).

### Google Places API Quick Start
- Initialize the Google Places Autocomplete service:
	```
	const autocompleteService = new  google.maps.places.AutocompleteService();
	```
- Get Autocomplete predictions (to see the different autocomplete request options, see https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest):
	```
	const autocompleteRequest = {
		input: input,
		componentRestrictions: { country: 'ph' } // ISO 3166-2 country code
	};
	
	// Create a callback to handle the response
	autocompleteService.getPlacePredictions(autocompleteRequest, autoCompletecallBack);
	```
- To get the details of a single prediction, initialize the Google Places Service (different from the Google Places ***Autocomplete*** Service:
	```
	// The service needs an html element to be constructed 
	const placesService = new google.maps.places.PlacesService(window.document.createElement('div'));

	const request = {
		placeId: prediction.place_id, // place id obtained from an autocomplete prediction response
		fields: ['address_components', 'name', 'formatted_address']
	}
	
	// Create a callback to handle the response	
	placesService.getDetails(request, getDetailsCallback);
	```
