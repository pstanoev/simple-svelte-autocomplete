<script>
import AutoComplete from "./SimpleAutocomplete.svelte";
import Highlight from "svelte-highlight";
import xml from "svelte-highlight/src/languages/xml";


const animals = ["White Rabbit", "White Horse", "Black Rabbit", "Black Horse", "Black Black Rabbit"];
let selectedAnimal;

const code = `<script>
const colors = ["White Rabbit", "White Horse", "Black Rabbit", "Black Horse", "Black Black Rabbit"];
let selectedAnimal;
<\/script>

<AutoComplete
    items={animals}
    bind:selectedItem={selectedAnimal}
    matchAllKeywords={false}
    sortByPertinence={true}
    />
Selected color: {selectedAnimal}`
</script>

<div>
    <h3>Matching keyword strategy:</h3>

    <div class="columns">
        <div class="column is-one-third">
            <h5>Pick an animal:</h5>

            <AutoComplete
                items={animals}
                bind:selectedItem={selectedAnimal}
                matchAllKeywords={false}
                sortByPertinence={true}
                />
            <p>Selected animal: {selectedAnimal}</p>
        </div>

        <div class="column">
            <Highlight language="{xml}" {code} />
        </div>
    </div>
</div>
