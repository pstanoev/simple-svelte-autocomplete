<script>
  import Highlight from "svelte-highlight"
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import xml from "svelte-highlight/src/languages/xml"

  async function searchCountry(keyword) {
    const url =
      "https://restcountries.com/v2/name/" + encodeURIComponent(keyword) + "?fields=name;alpha2Code"

    const response = await fetch(url)
    return await response.json()
  }

  async function searchCountrySlow(keyword) {
    await new Promise((r) => setTimeout(r, 3000))
    return searchCountry(keyword)
  }

  const code = `
<AutoComplete
  searchFunction={searchCountrySlow}
  showLoadingIndicator={true} />
`
</script>

<div>
  <h3 class="mt-3">Loading indicator:</h3>
  <p>
    When <code>showLoadingIndicator</code> is set to true, loading spinner is shown when the async
    <code>searchFunction</code> is executed.
    <br />
    Bulma class 'is-loading' is added to the input control. If you do not use Bulma you need to add style
    for the 'is-loading' class.
  </p>
  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick a country:</h5>

      <AutoComplete
        searchFunction={searchCountrySlow}
        labelFieldName="name"
        maxItemsToShowInList="10"
        showLoadingIndicator={true}
      />
    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
