<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/src/languages/xml"
  const colors = [
    { id: 1, name: "White", code: "#FFFFFF", nice: false, order: 4 },
    { id: 2, name: "Red", code: "#FF0000", nice: true, order: 3 },
    { id: 3, name: "Yellow", code: "#FF00FF", nice: true, order: 5 },
    { id: 4, name: "Green", code: "#00FF00", nice: false, order: 2 },
    { id: 5, name: "Blue", code: "#0000FF", nice: true, order: 6 },
    { id: 6, name: "Black", code: "#000000", nice: true, order: 1 },
  ]

  async function loadColors(keyword) {
    return colors
  }

  function itemFilter(item, keywords) {
    // return only colors which have nice: true
    return item.nice
  }

  function itemSort(item1, item2, keywords) {
    // sort by color order
    return item1.order - item2.order
  }

  let selectedColorObject
  let selectedColorValue

  const code = `<script>
const colors = [
  { id: 1, name: "White", code: "#FFFFFF", nice: true, order: 4 },
  { id: 2, name: "Red", code: "#FF0000", nice: true, order: 3 },
  { id: 3, name: "Yellow", code: "#FF00FF", nice: true, order: 5 },
  { id: 4, name: "Green", code: "#00FF00", nice: false, order: 2 },
  { id: 5, name: "Blue", code: "#0000FF", nice: true, order: 6 },
  { id: 6, name: "Black", code: "#000000", nice: false, order: 1 }
];

async function loadColors(keyword) {
  return colors;
}

function itemFilter(item, keywords) {
  // return only colors which have nice: true
  return item.nice;
}

function itemSort(item1, item2, keywords) {
  // sort by color order
  return item1.order - item2.order;
}

let selectedColorObject;
let selectedColorValue;
<\/script>
<AutoComplete
    searchFunction={loadColors}
    bind:selectedItem={selectedColorObject}
    bind:value={selectedColorValue}
    labelFieldName="name"
    valueFieldName="id"
    itemFilterFunction={itemFilter}
    itemSortFunction={itemSort}
    />`
</script>

<div>
  <h3 class="mt-3">Custom filtering and sorting examples:</h3>
  <p>
    <code>itemFilterFunction</code>
    Optional function to override the default local filtering that the component does based on keyword
    matching.
    <br />
    The function arguments are individual item from the item list, and the cleaned up words from the
    input field. It should return a boolean indicating wether to keep the item.
    <br />
    <br />
    <code>itemSortFunction</code>
    Optional function to defined the sort order of the list.
    <br />
    The function arguments are two distincts items from the item list, and the cleaned up words from
    the input field. It should return an integer. If greater than 0 the first item comes first, if lesser
    than 0 the second item comes first.
  </p>

  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick a color:</h5>
      <AutoComplete
        searchFunction={loadColors}
        bind:selectedItem={selectedColorObject}
        bind:value={selectedColorValue}
        labelFieldName="name"
        valueFieldName="id"
        placeholder="Please select color"
        itemFilterFunction={itemFilter}
        itemSortFunction={itemSort}
      />
      <p>
        Selected color item: {JSON.stringify(selectedColorObject)}
        <br />
        Selected value: {selectedColorValue}
      </p>
    </div>
    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
