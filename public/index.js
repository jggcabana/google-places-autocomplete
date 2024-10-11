$(async function () {
    await initCountrySelect();
    initGooglePlacesService();
});

function initGooglePlacesService() {

    const autocomplete = google.maps.places.AutocompleteSuggestion;

    // This token is needed to group all the requests into one billing unit,
    // until a call to place.fetchFields() is made.
    var sessionToken = null;

    // $('#pac-input').on('input', autocompleteInputListener); // no debounce
    $('#pac-input').on('input', debounce(autocompleteInputListener, 500));

    async function autocompleteInputListener() {
        try {
            // Create a token if null
            sessionToken = sessionToken || new google.maps.places.AutocompleteSessionToken();
            displaySessionToken(sessionToken);
            let input = $(this).val();

            if (input) {
                let country = $('#country-select').val();

                var request = {
                    input: input,
                    includedRegionCodes: [country],
                    sessionToken: sessionToken
                };

                const { suggestions } = await autocomplete.fetchAutocompleteSuggestions(request);
                autoCompletecallBack(suggestions);
            }
            else {
                // hide predictions section if blank input 
                $('#predictions-section').hide()
            }
        } catch (error) {
            $('#predictions-section').hide()
        }
    }

    function autoCompletecallBack(predictions, status = google.maps.places.PlacesServiceStatus.OK) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            console.log(status);
            return;
        }

        var resultHtml = '';

        //Fill results section
        predictions.forEach(function (prediction) {
            resultHtml += `
                <div class="prediction-container" data-placeid="${prediction.placePrediction.placeId}">
                <span class="prediction-item">
                    ${prediction.placePrediction.text.text} <code>(${prediction.placePrediction.placeId})</code>
                </span>
                </div>
            `;
        });

        if (resultHtml != undefined && resultHtml != '') {
            $('#predictions-section').html(resultHtml).show();
        }

        // add click handler for result selection
        $(".prediction-container").click(async function () {
            let placeId = $(this).data('placeid');
            let place = new google.maps.places.Place({ id: placeId })

            await place.fetchFields({ fields: ['addressComponents', 'formattedAddress'] });
            populateForm(place);

            // invalidate the existing sessionToken so a new one can be made.
            sessionToken = null;
            displaySessionToken(sessionToken);
        });
    }
}

async function initCountrySelect() {
    const countries = await getCountries();
    for (const [code, country] of Object.entries(countries)) {
        $('#country-select').append(`<option value="${code}">${country}</option>`);
    }

    // default country value
    $('#country-select').val('us').change();
}

function getCountries() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'https://flagcdn.com/en/codes.json',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

function populateForm(place) {
    console.log(place);
    $('#auto-populate input').val('');

    $('#pac-input').val(place.formattedAddress);

    if (!place.addressComponents)
        return;

    for (const component of place.addressComponents) {
        for (const type of component.types) {
            switch (type) {
                case 'administrative_area_level_1':
                    $('#address-state').val(component.shortText);
                    break;
                case 'administrative_area_level_2':
                    $('#address-province').val(component.longText);
                    break;
                case 'locality':
                    $('#address-city').val(component.longText);
                    break;
                case 'postal_code':
                    $('#address-zip').val(component.longText);
                    break;
                default:
                    break;
            }
        }
    }
}

function displaySessionToken(token) {
    console.log(token);
    const tokenPlainText = token ? Object.entries(token)[0][1] : '-'; // for POC purposes only, don't do this

    $('#token-section').html(`
        <span>Autocomplete session token: <code>${tokenPlainText}</code></span>
    `).show();
}

// https://underscorejs.org/docs/modules/debounce.html
// slightly modified version of _.debounce
function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function () {
        var passed = Date.now() - previous;
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            if (!timeout) args = context = null;
        }
    };

    var debounced = function () {
        context = this;
        args = arguments;
        previous = Date.now();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);
        }
        return result;
    };

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = args = context = null;
    };

    return debounced;
}