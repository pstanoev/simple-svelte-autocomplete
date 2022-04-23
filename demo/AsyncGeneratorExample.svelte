<script>
  import AutoComplete from "../src/SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  let selectedCountry

  async function* searchCountryGenerator(keyword) {
    const url =
      "https://restcountries.com/v2/name/" + encodeURIComponent(keyword) + "?fields=name;alpha2Code"

    const response = await fetch(url)
    const chunks = await response.json()
    if (response.status == 200 && chunks) {
      for (const chunk of chunks) {
        yield [chunk]
        await new Promise((r) => setTimeout(r, 1000))
      }
    }
  }

  const code = `<script>
let selectedCountry;
async function* searchCountryGenerator(keyword) {
    const url = "https://restcountries.com/v2/name/"
        + encodeURIComponent(keyword) + "?fields=name;alpha2Code";

    const response = await fetch(url);
    const chunks = await response.json();

    for (const chunk of chunks) {
        yield [chunk];
        await new Promise(r => setTimeout(r, 1000));
    }
}
<\/script>

<AutoComplete
    searchFunction={searchCountry}
    bind:selectedItem={selectedCountry}
    labelFieldName="name"
    localFiltering={false}
    showLoadingIndicator={true}
/>`
</script>

<div>
  <h3 class="mt-3">Async generators</h3>
  <article class="message is-info">
    <div class="message-body">
      <p>
        If your async data takes time to generate from your server, you may want to
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams"
          >stream</a
        >
        the response so the end user can have the first suggestions displayed while the latter are being
        computed.<br />
        <code>searchFunction</code> can be a generator that yields chunks of items.
      </p>
      <p>
        Here we artificially simulate delay between chunks but you can see a real-life snippet <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#iterating_over_async_generators"
          >here</a
        >.
      </p>
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
            searchFunction={searchCountryGenerator}
            bind:selectedItem={selectedCountry}
            labelFieldName="name"
            localFiltering={false}
            showLoadingIndicator={true}
          />

          <div style="margin-bottom: 10rem;">
            <p>Selected country: <code>{JSON.stringify(selectedCountry)}</code></p>
          </div>
        </div>
      </article>
    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
