<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  async function searchCountry(keyword) {
    const url =
      "https://restcountries.com/v2/name/" + encodeURIComponent(keyword) + "?fields=name;alpha2Code"

    const response = await fetch(url)
    return await response.json()
  }

  let selectedCountry = { name: "Uruguay", alpha2Code: "UY" }

  const code = `<script>
let selectedCountry = {"name": "Uruguay", "alpha2Code": "UY"};
async function searchCountry(keyword) {
    const url = "https://restcountries.com/v2/name/"
    + encodeURIComponent(keyword) + "?fields=name;alpha2Code";

    const response = await fetch(url);
    return await response.json();
}
<\/script>

<AutoComplete
    searchFunction={searchCountry}
    bind:selectedItem={selectedCountry}
    labelFieldName="name"
    maxItemsToShowInList={10}
    delay={200}
    localFiltering={false} />`
</script>

<div>
  <h3 class="mt-3">Preloaded async example:</h3>

  <p>
    When an async autocomplete compenent is initialized with a value, the suggestion list will be
    loaded when the user focuses the input field.
  </p>

  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick a country:</h5>

      <AutoComplete
        searchFunction={searchCountry}
        bind:selectedItem={selectedCountry}
        labelFieldName="name"
        maxItemsToShowInList={10}
        delay={200}
        localFiltering={false}
      />

      <div style="margin-bottom: 10rem;">
        <p>Selected country: {JSON.stringify(selectedCountry)}</p>
      </div>
    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
