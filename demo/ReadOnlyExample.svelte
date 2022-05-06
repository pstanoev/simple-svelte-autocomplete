<script>
  import AutoComplete from "../src/SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  let selectedColor
  const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"]
  const code = `<script>
import AutoComplete from 'simple-svelte-autocomplete';

const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"]
let selectedColor;
<\/script>

Selected color: {selectedColor}
<AutoComplete items={colors} bind:selectedItem={selectedColor} readonly={true} />`
</script>

<div>
  <h3 class="mt-3">Read-only selection</h3>
  <article class="message is-info">
    <div class="message-body">
      The <code>readonly</code> attribute is passed to the HTML input. When `true` then the text input
      cannot be edited, but items can still be selected in the menu.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          <p>Selected color: {selectedColor}</p>
          <AutoComplete items={colors} bind:selectedItem={selectedColor} readonly={true} />
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
