<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/src/languages/xml"

  async function searchCountry(keyword) {
    const url =
      "https://restcountries.com/v2/name/" + encodeURIComponent(keyword) + "?fields=name;alpha2Code"

    const response = await fetch(url)
    return await response.json()
  }

  let selectedCountry

  const code = `<script>
let selectedCountry;
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
  <h3 class="mt-3">Async example:</h3>

  <p>
    The delay parameter makes the component wait for 200ms after you typed something before
    generating a request. Set <strong>localFiltering</strong> to false if your search function already
    returnes filtered results.
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

  <div>
    <p>
      REPL:<br />
      <a href="https://svelte.dev/repl/9b0f5c2ac2e34a0ca4c7d7b71f109a7d" target="_blank">
        svelte.dev/repl/9b0f5c2ac2e34a0ca4c7d7b71f109a7d
      </a>
    </p>
  </div>
</div>
