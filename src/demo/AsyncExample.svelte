<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  async function searchColor(keyword, nb_items_max) {
    return ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"]
  }

  async function searchCountry(keyword) {
    const url =
      "https://restcountries.com/v2/name/" + encodeURIComponent(keyword) + "?fields=name;alpha2Code"

    const response = await fetch(url)
    return await response.json()
  }

  let selectedColor
  let selectedCountry

  const colorCode = `<script>
let selectedColor;
async function searchColor(keyword) {
  return [
    "White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"
  ]
}
<\/script>

<AutoComplete
    searchFunction={searchColor}
    bind:selectedItem={selectedColor}
/>`

  const countryCode = `<script>
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
  <h3 class="mt-3">Items asynchronous loading</h3>

  <article class="message is-info">
    <div class="message-body">
      <code>searchFunction</code> can be used to dynamically generate items.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          <AutoComplete searchFunction={searchColor} bind:selectedItem={selectedColor} />

          <div style="margin-bottom: 10rem;">
            <p>Selected color: <code>{JSON.stringify(selectedColor)}</code></p>
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
          <Highlight language={xml} code={colorCode} />
        </div>
      </article>
    </div>
  </div>

  <article class="message is-info">
    <div class="message-body">
      The <code>delay</code> parameter makes the component wait for 200ms after you typed something
      before generating a request. Set <code>localFiltering</code> to <code>false</code> if your search
      function already returnes filtered results, so results won't be filtered a second time client-side.
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
          <Highlight language={xml} code={countryCode} />
        </div>
      </article>
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
