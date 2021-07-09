<script>
import AutoComplete from "../SimpleAutocomplete.svelte";
import Highlight from "svelte-highlight";
import xml from "svelte-highlight/src/languages/xml";

let selectedColor;
const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
const code = `<script>
const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
let selectedColor;
<\/script>

<AutoComplete items={colors} bind:selectedItem={selectedColor} lock={true} />
Selected color: {selectedColor}`;
</script>

<div>
    <h3 class="mt-3">Simple lock example:</h3>
    <p>
        This example is liked the previous one except that the input is <em>lock</em>. This means that only the suggested values are available.
    </p>

    <div class="columns">
        <div class="column is-one-third">
            <h5>Pick a color:</h5>

            <AutoComplete items={colors} bind:selectedItem={selectedColor} lock={true} />
            <p>Selected color: {selectedColor}</p>

        </div>

        <div class="column">
            <Highlight language="{xml}" {code} />
        </div>
    </div>
</div>
