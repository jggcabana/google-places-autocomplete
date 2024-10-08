$(async function () {
    const autocomplete = initGooglePlaces();

    // restrict autocomplete to selected country
    $('#country-select').on('change', function () {
        const selected = $(this).val();
        if (selected)
            autocomplete.setComponentRestrictions({
                country: selected
            });
    });

    await initCountrySelect();
});

function initGooglePlaces() {
    const input = $('#pac-input').get(0);
    const options = {
        fields: ['formatted_address', 'address_components', 'name']
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        populateForm(place);
    });

    return autocomplete;
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