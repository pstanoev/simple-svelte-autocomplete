<script>
  import AutoComplete from "../src/SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"]
  let selectedColor
  let text = "Non existing color"
  let toCreate = ""
  const code = `<script>
const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
let selectedColor;
let text = 'Non existing color'
let toCreate = "";

function handleCreate(newColor) {
  toCreate = 'Creating ' + newColor;
  colors.unshift(newColor);
  colors = colors;
  return newColor
}
<\/script>

<AutoComplete
  items={colors}
  bind:selectedItem={selectedColor}
  bind:text
  create={true}
  createText={"Item doesn't exist, create one?"} .
  onCreate={handleCreate} />
Current user entered text: {text}<br />
Selected color: {selectedColor}`

  function handleCreate(newColor) {
    toCreate = "Creating " + newColor
    colors.unshift(newColor)
    colors = colors
    return newColor
  }
</script>

<div>
  <h3 class="mt-3">Item creation</h3>

  <article class="message is-info">
    <div class="message-body">
      You can bind to the <code>text</code> property to get the current text that is typed by the
      user. The
      <code>create</code> property will enable the controll to show
      <br />
      After, with the event on <code>onCreate</code> you can get the entered text and create the
      item.
      <br />
      A slot called <code>create</code> and <code>createText</code> is available for customizing the
      UI.
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
            items={colors}
            bind:selectedItem={selectedColor}
            bind:text
            create={true}
            createText={"Item doesn't exist, create one?"}
            onCreate={handleCreate}
          />
          <p>Current user entered text: <code>{text}</code></p>
          <p>Selected color: <code>{selectedColor}</code></p>
          <p>To create: <code>{toCreate}</code></p>
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
