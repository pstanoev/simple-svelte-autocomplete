<script>
  import AutoComplete from "../src/SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  let selectedColor
  const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"]
  const code = `<script>
const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
let selectedColor;
<\/script>

<AutoComplete items={colors} bind:selectedItem={selectedColor} lock={true} />
Selected color: {selectedColor}`
</script>

<div>
  <h3 class="mt-3">Locked example:</h3>
  <article class="message is-info">
    <div class="message-body">
      The <code>lock</code> attribute dissalows free text re-selection after the first selection until
      the control is cleared with the x button.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          <AutoComplete items={colors} bind:selectedItem={selectedColor} lock={true} />
          <p>Selected color: <code>{selectedColor}</code></p>
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
