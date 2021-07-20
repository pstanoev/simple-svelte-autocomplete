<script>
import AutoComplete from "../SimpleAutocomplete.svelte";
import Highlight from "svelte-highlight";
import xml from "svelte-highlight/src/languages/xml";

async function* colors(keyword){
  for (const color of [
    { id: 1, name: "White", code: "#FFFFFF", enabled: true, order: 4 },
    { id: 2, name: "Red", code: "#FF0000", enabled: true, order: 3 },
    { id: 3, name: "Yellow", code: "#FF00FF", enabled: true, order: 5 },
    { id: 4, name: "Green", code: "#00FF00", enabled: false, order: 2 },
    { id: 5, name: "Blue", code: "#0000FF", enabled: true, order: 6 },
    { id: 6, name: "Black", code: "#000000", enabled: false, order: 1 }
  ]) {
    yield [color];
  }
}

let selectedColorObject;
let selectedColorValue;

const code = `<script>
async function* colors(keyword){
  for (const color of [
    { id: 1, name: "White", code: "#FFFFFF", enabled: true, order: 4 },
    { id: 2, name: "Red", code: "#FF0000", enabled: true, order: 3 },
    { id: 3, name: "Yellow", code: "#FF00FF", enabled: true, order: 5 },
    { id: 4, name: "Green", code: "#00FF00", enabled: false, order: 2 },
    { id: 5, name: "Blue", code: "#0000FF", enabled: true, order: 6 },
    { id: 6, name: "Black", code: "#000000", enabled: false, order: 1 }
  ]) {
    yield [color];
  }
}

let selectedColorObject;
let selectedColorValue;
<\/script>

<AutoComplete
    searchFunction={colors}
    bind:selectedItem={selectedColorObject}
    bind:value={selectedColorValue}
    labelFieldName="name"
    valueFieldName="id"
    itemFilterFunction={(item, words) => item.item.enabled}
    itemOrderFunction={(item1, item2, words) => item2.item.order - item1.item.order}
    />`;
</script>

<div>
    <h3 class="mt-3">Custom functions examples:</h3>
    <p>
        <code>itemFilterFunction</code> and <code>itemOrderFunction</code> allow you to
        use custom functions to control which item will be displayed in the list, and
        in which order.<br>
        <code>itemFilterFunction</code> takes for arguments an individual item from the item list,
        and the cleaned up words from the input field. It should return a boolean indicating
        wether to keep the item.
        <code>itemOrderFunction</code> takes for arguments two distincts item from the item list,
        and the cleaned up words from the input field. It should return an integer. If greater than
        0 the first item comes first, if lesser than 0 the second item comes first.
    </p>

    <div class="columns">
        <div class="column is-one-third">
            <h5>Pick a color:</h5>
            <AutoComplete
                searchFunction={colors}
                bind:selectedItem={selectedColorObject}
                bind:value={selectedColorValue}
                labelFieldName="name"
                valueFieldName="id"
                placeholder="Please select color"
                itemFilterFunction={(item, words) => item.item.enabled}
                itemOrderFunction={(item1, item2, words) => item2.item.order - item1.item.order}
                />
            <p>
                Selected color item: {JSON.stringify(selectedColorObject)}
                <br />
                Selected value: {selectedColorValue}
            </p>
        </div>
        <div class="column">
            <Highlight language="{xml}" {code} />
        </div>
    </div>
</div>
