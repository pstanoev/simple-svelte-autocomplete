<script>
import AutoComplete from "./SimpleAutocomplete.svelte";
import Highlight from "svelte-highlight";
import xml from "svelte-highlight/src/languages/xml";

const colorList = [
    { id: 1, name: "White", code: "#FFFFFF" },
    { id: 2, name: "Red", code: "#FF0000" },
    { id: 3, name: "Yellow", code: "#FF00FF" },
    { id: 4, name: "Green", code: "#00FF00" },
    { id: 5, name: "Blue", code: "#0000FF" },
    { id: 6, name: "Black", code: "#000000" }
];

let selectedColorObject;
let selectedColorValue;

const code = `<script>
const colorList = [
  { id: 1, name: "White", code: "#FFFFFF" },
  { id: 2, name: "Red", code: "#FF0000" },
  { id: 3, name: "Yellow", code: "#FF00FF" },
  { id: 4, name: "Green", code: "#00FF00" },
  { id: 5, name: "Blue", code: "#0000FF" },
  { id: 6, name: "Black", code: "#000000" }
];

let selectedColorObject;
let selectedColorValue;
<\/script>

<AutoComplete
    items={colorList}
    bind:selectedItem={selectedColorObject}
    bind:value={selectedColorValue}
    labelFieldName="name"
    valueFieldName="id"
    keywordsFunction={color => color.name + ' ' + color.code} />`;
</script>

<div>
    <h3>Advanced example:</h3>
    <p>
        If you have an array of objects as items, they can be feed directly into
        the AutoComplete component and you can specify which field to use as
        label.
        <br />
        You can also specifiy function to combine multiple fields to search by.
        Try searching by HEX code of a color.
    </p>

    <div class="columns">
        <div class="column is-one-third">
            <h5>Pick a color:</h5>
            <AutoComplete
                items={colorList}
                bind:selectedItem={selectedColorObject}
                bind:value={selectedColorValue}
                labelFieldName="name"
                valueFieldName="id"
                keywordsFunction={color => color.name + ' ' + color.code}
                showClear={true}
                hideArrow={false}
                placeholder="Please select color"
                />

            <p>
                Selected color item: {JSON.stringify(selectedColorObject)}
                <br />
                Selected value: {selectedColorValue}
            </p>

            <div>
                <p>Change selected item from outside:</p>
                <button
                    class="button"
                    on:click={() => (selectedColorObject = colorList[colorList.length - 1])}>
                    Set color to Black
                </button>
            </div>
        </div>
        <div class="column">
            <Highlight language="{xml}" {code} />
        </div>
    </div>
</div>
