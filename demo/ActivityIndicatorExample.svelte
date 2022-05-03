<script>
  import Highlight from "svelte-highlight"
  import AutoComplete from "../src/SimpleAutocomplete.svelte"
  import xml from "svelte-highlight/languages/xml"

  async function searchColor(keyword) {
    await new Promise((r) => setTimeout(r, 3000))
    return ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"]
  }

  const code = `<script>
async function searchColor(keyword, nb_items_max) {
  await new Promise((r) => setTimeout(r, 3000))
  return [
    "White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"
  ]
}
<\/script>

<AutoComplete
    searchFunction={searchColor}
    showLoadingIndicator={true}
/>
`
</script>

<div>
  <h3 class="mt-3">Loading indicator</h3>
  <article class="message is-info">
    <div class="message-body">
      When <code>showLoadingIndicator</code> is set to true, loading spinner is shown when the async
      <code>searchFunction</code> is executed.
      <br />
      Bulma class 'is-loading' is added to the input control. If you do not use Bulma you need to add
      style for the 'is-loading' class.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          <AutoComplete searchFunction={searchColor} showLoadingIndicator={true} />
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
