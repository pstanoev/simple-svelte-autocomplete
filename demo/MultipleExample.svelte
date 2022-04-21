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
  <h3>Multiple selection</h3>
  <article class="message is-info">
    <div class="message-body">
      The <code>multiple</code> attribute allows you to select several items.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          <AutoComplete
            multiple="true"
            items={colorList}
            labelFieldName="name"
            valueFieldName="id"
            bind:selectedItem={selectedColorsItems}
            bind:value={selectedColorsValues}
          />

          <p>
            Selected color items: <code>{JSON.stringify(selectedColorsItems)}</code>
            <br />
            Selected color values: <code>{JSON.stringify(selectedColorsValues)}</code>
          </p>
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
