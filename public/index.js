$(async function () {
    await initCountrySelect();
    initGooglePlacesService();
});

function initGooglePlacesService() {
    const autocompleteService = new google.maps.places.AutocompleteService();
    const placesService = new google.maps.places.PlacesService(window.document.createElement('div'));

    $('#pac-input').on('input', debounce(autocompleteInputListener, 1000))

    function autocompleteInputListener() {

        try {
            let input = $(this).val();

            if (input) {
                let country = $('#country-select').val();
                var autocompleteRequest = {
                    input: input,
                    componentRestrictions: { country: country }
                };

                autocompleteService.getPlacePredictions(autocompleteRequest, autoCompletecallBack);
            }
            else {
                // hide predictions section if blank input 
                $('#predictions-section').hide()
            }
        } catch (error) {
            $('#predictions-section').hide()
        }
    }

    function autoCompletecallBack(predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            console.log(status);
            return;
        }

        var resultHtml = '';

        //Fill results section
        predictions.forEach(function (prediction) {
            resultHtml += `
                <div class="prediction-container" data-placeid="${prediction.place_id}">
                <span class="prediction-item">
                    ${prediction.description} <code>(${prediction.place_id})</code>
                </span>
                </div>
        `
        });

        if (resultHtml != undefined && resultHtml != '') {
            $('#predictions-section').html(resultHtml).show();
        }

        // add click handler for result select
        $(".prediction-container").click(function () {
            const request = {
                placeId: $(this).data('placeid'),
                fields: ['address_components', 'name', 'formatted_address']
            }

            placesService.getDetails(request, populateForm);
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

function populateForm(place, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
        console.log(status);
        return;
    }

    console.log(place);
    $('#auto-populate input').val('');

    $('#pac-input').val(place.formatted_address);
    const address = place.address_components;
    if (!address)
        return;

    for (const component of address) {
        for (const type of component.types) {
            switch (type) {
                case 'administrative_area_level_1':
                    $('#address-state').val(component.short_name);
                    break;
                case 'administrative_area_level_2':
                    $('#address-province').val(component.long_name);
                    break;
                case 'locality':
                    $('#address-city').val(component.long_name);
                    break;
                case 'postal_code':
                    $('#address-zip').val(component.long_name);
                    break;
                default:
                    break;
            }
        }
    }
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