<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/src/languages/xml"

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

const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"];
let selectedColor;
<\/script>

Selected color: {selectedColor}
<AutoComplete items={colors} bind:selectedItem={selectedColor} />`
</script>

<div>
  <h3 class="mt-3">Simple example:</h3>

  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick a color:</h5>

      <p>Selected color: {selectedColor}</p>

      <AutoComplete items={colors} bind:selectedItem={selectedColor} />
    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
