<script>
import AutoComplete from "./SimpleAutocomplete.svelte";
import { countryList } from "./country-list.js";

async function searchCountry(keyword) {
    const url =
      "https://restcountries.eu/rest/v2/name/" +
      encodeURIComponent(keyword) +
      "?fields=name;alpha2Code";

    const response = await fetch(url);
    return await response.json();
}

async function searchCountrySlow(keyword) {
    await new Promise(r => setTimeout(r, 3000));
    return searchCountry(keyword);
}

</script>

<div>
    <h3>Activity indicator:</h3>

    <div class="columns">
        <div class="column">
            <p>Those requests takes 3s to compute, an activity indicator is shown during this time.</p>

            <h5>Pick a country:</h5>
            <AutoComplete
                searchFunction={searchCountrySlow}
                labelFieldName="name"
                maxItemsToShowInList="10" />
        </div>
    </div>
</div>
