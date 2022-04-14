<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  let selectedColor
  const colors = [
    "White",
    "Red",
    "Yellow",
    "Green",
    "Blue",
    "Black",
    "Mät bläck",
    "<i>Jét Black</i>",
  ]
  const code = `<script>
import AutoComplete from 'simple-svelte-autocomplete';

const colors = [
   "White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"
];
let selectedColor;
<\/script>

Selected color: {selectedColor}
<AutoComplete items={colors} bind:selectedItem={selectedColor} required={true} />`
</script>

<div>
  <h3 class="mt-3">Required selection</h3>
  <article class="message is-info">
    <div class="message-body">
      The <code>required</code> attribute is passed to the HTML input.
    </div>
  </article>

  <form>
    <div class="columns">
      <div class="column is-one-third">
        <article class="message">
          <div class="message-header">
            <p>Pick a color</p>
          </div>
          <div class="message-body">
            <p>Selected color: {selectedColor}</p>
            <AutoComplete items={colors} bind:selectedItem={selectedColor} required={true} />
            <button type="submit">Submit</button>
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
  </form>
</div>
