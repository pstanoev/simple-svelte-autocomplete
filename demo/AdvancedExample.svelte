<script>
  import AutoComplete from "../src/SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  const colorList = [
    { id: 1, name: "White", code: "#FFFFFF" },
    { id: 2, name: "Red", code: "#FF0000" },
    { id: 3, name: "Yellow", code: "#FF00FF" },
    { id: 4, name: "Green", code: "#00FF00" },
    { id: 5, name: "Blue", code: "#0000FF" },
    { id: 6, name: "Black", code: "#000000" },
  ]

  let selectedColorObject = colorList[0]
  let highlightedColorObject
  let selectedColorValue

  const code = `<script>
const colorList = [
  { id: 1, name: "White", code: "#FFFFFF" },
  { id: 2, name: "Red", code: "#FF0000" },
  { id: 3, name: "Yellow", code: "#FF00FF" },
  { id: 4, name: "Green", code: "#00FF00" },
  { id: 5, name: "Blue", code: "#0000FF" },
  { id: 6, name: "Black", code: "#000000" }
];

let selectedColorObject = colorList[0];
let highlightedColorObject;
let selectedColorValue;
<\/script>

<AutoComplete
    items={colorList}
    bind:selectedItem={selectedColorObject}
    bind:highlightedItem={highlightedColorObject}
    bind:value={selectedColorValue}
    labelFieldName="name"
    valueFieldName="id"
    keywordsFunction={color => color.name + ' ' + color.code} />`
</script>

<div>
  <h3 class="mt-3">Objects selection</h3>
  <article class="message is-info">
    <div class="message-body">
      If you have an array of objects as items, they can be feed directly into the AutoComplete
      component and you can specify which field to use as label.
      <br />
      You can also specifiy a function to combine multiple fields to search by. Try searching by HEX
      code of a color.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          Selected color item: <code>{JSON.stringify(selectedColorObject)}</code>
          <br />
          Highlighted color item:
          <code
            >{highlightedColorObject ? highlightedColorObject.name : highlightedColorObject}</code
          >
          <br />
          Selected value: <code>{selectedColorValue}</code>

          <AutoComplete
            items={colorList}
            bind:selectedItem={selectedColorObject}
            bind:highlightedItem={highlightedColorObject}
            bind:value={selectedColorValue}
            labelFieldName="name"
            valueFieldName="id"
            keywordsFunction={(color) => color.name + " " + color.code}
            showClear={true}
            hideArrow={false}
            placeholder="Please select color"
          />

          <div>
            <p>Change selected item from outside:</p>
            <button
              class="button"
              on:click={() => (selectedColorObject = colorList[colorList.length - 1])}
            >
              Set color to Black
            </button>
          </div>
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
