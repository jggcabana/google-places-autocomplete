
# [POC] Google Places Autocomplete (New)

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
- Create an `AutocompleteSessionToken`. This token is important because it groups several autocomplete requests (up to 12) into one billable unit. The token is automatically invalidated once a call to `Place.fetchFields` is made. A new token must be regenerated once the previous token becomes invalid.
	```
	var sessionToken = new google.maps.places.AutocompleteSessionToken();
	```
- Get Autocomplete predictions:
	```
	const request = {
		input: input,
		includedRegionCodes: ['ph'], // ISO 3166-2 country codes
		sessionToken: sessionToken
	};
	
	const autocomplete = google.maps.places.AutocompleteSuggestion;
	const { suggestions } = await autocomplete.fetchAutocompleteSuggestions(request);
	```
- To get the details of a single prediction, instantiate a `Place` object and call its `fetchFields` method:
	```
	// placeId obtained from fetchAutocompleteSuggestions response
	let place = new google.maps.places.Place({ id: placeId });

	// Only include the fields you need
	await place.fetchFields({ fields: ['addressComponents', 'formattedAddress'] });

	// Do something with the fields you requested
	console.log(place.addressComponents);
	console.log(place.formattedAddress);
	```
### Quick Links
- [Autocomplete (New) | Places API | Google for Developers](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete)
- [Place Class Data Fields | Maps JavaScript API | Google for Developers](https://developers.google.com/maps/documentation/javascript/place-class-data-fields)
- [Place Types | Maps JavaScript API | Google for Developers](https://developers.google.com/maps/documentation/javascript/place-types)
