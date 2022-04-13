<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
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

  let selectedColorsItems
  let selectedColorsValues

  const code = `<script>
let selectedColorsItems;
let selectedColorsValues;
<\/script>

<AutoComplete
    multiple=true
    items={colorList}
    labelFieldName="name"
    valueFieldName="id"
    bind:selectedItem={selectedColorsItems}
    bind:value={selectedColorsValues}
    />`
</script>

<div>
  <h3>Multiple example:</h3>
  <p>
    The <strong>multiple</strong> attribute allows you to select several items.
  </p>

  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick a color:</h5>
      <AutoComplete
        multiple="true"
        items={colorList}
        labelFieldName="name"
        valueFieldName="id"
        showClear={true}
        bind:selectedItem={selectedColorsItems}
        bind:value={selectedColorsValues}
      />
      <p>
        Selected color items: {JSON.stringify(selectedColorsItems)}
        <br />
        Selected color values: {JSON.stringify(selectedColorsValues)}
      </p>
    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
