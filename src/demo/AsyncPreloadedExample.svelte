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
  <h3 class="mt-3">Preloaded item</h3>

  <article class="message is-info">
    <div class="message-body">
      When an async autocomplete compenent is initialized with a value, the suggestion list will be
      loaded when the user focuses the input field.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a country</p>
        </div>
        <div class="message-body">
          <AutoComplete
            searchFunction={searchCountry}
            bind:selectedItem={selectedCountry}
            labelFieldName="name"
            maxItemsToShowInList={10}
            delay={200}
            localFiltering={false}
          />

          <div style="margin-bottom: 10rem;">
            <p>Selected country: <code>{JSON.stringify(selectedCountry)}</code></p>
          </div>
        </div>
      </article>
    </div>

    <div class="column">
      <article class="message">
        <div class="message-header">
          <p>Code</p>
        </div>
        <div class="message-body">
          <Highlight language={xml} {code} />
        </div>
      </article>
    </div>
  </div>
</div>
