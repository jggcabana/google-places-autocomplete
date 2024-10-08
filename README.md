# [POC] Google Places Autocomplete
- A minimal Node.js app to test/utilize the Google Places Autocomplete API.
- Uses jQuery + Bootstrap for component styling.

### Features
- Autocomplete address searchbox - form input with Google Places Autocomplete.
- Auto-populated address fields - form inputs that will populate on value change of the autocomplete input.

### Local Development Setup
- Requires Node.js - https://nodejs.org/en
- Requires a Google Places API Key. Create an account and generate your key - [Overview | Places API | Google for Developers](https://developers.google.com/maps/documentation/places/web-service/overview)
- Replace your key in the query parameter, found in `./public/index.html`.
	```
	...
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDFlHPPz-psboy0sdCJm7jeq-Gs6wcQQ0k&libraries=places&v=weekly" defer></script>
	...
	```
- This is my key. This key is IP restricted. I'm not unrestricting my key. Please generate your own.
- In the root directory, run `npm start`. Make sure you've restored the needed node packages in the root directory (`npm install`).

### Google Places API Quick Start
- Create an `autocomplete` object from a text input:
	```
	const  input  =  document.getElementById('pac-input');
	const  options  = {
		fields: ['formatted_address', 'address_components', 'name']
	};
	const  autocomplete  =  new  google.maps.places.Autocomplete(input, options);
	```
- Use the `fields` property to control the properties to be present in the response schema.
- Create a listener for the autocomplete input:
	```
	autocomplete.addListener('place_changed', () => {
		const  place  =  autocomplete.getPlace();
		// do stuff 
	});
	```
- Restrict the autocomplete results by country: 
	```
	 autocomplete.setComponentRestrictions({
		country: 'ph' // ISO 3166 country code
	});
	```