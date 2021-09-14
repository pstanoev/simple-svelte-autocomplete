<script>
  import AutoComplete from "../SimpleAutocomplete.svelte";
  import Highlight from "svelte-highlight";
  import xml from "svelte-highlight/src/languages/xml";

  let colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
  let selectedColor;
  let text = "Non existing color";
  let toCreate = "";
  const code = `<script>
const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
let selectedColor;
let text = 'Non existing color'
let toCreate = "";

function handleCreate(newColor) {
  toCreate = 'Creating ' + newColor;
  colors = [newColor, ...colors];
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
Selected color: {selectedColor}`;

 function handleCreate(newColor) {
    toCreate = 'Creating ' + newColor;
    colors = [newColor, ...colors];
    return newColor
  }
</script>

<div>
  <h3 class="mt-3">Allow unlisted, create new item:</h3>

  <p>
    You can bind to the `text` property to get the current text that is typed by
    the user. The `create` property will enable the controll to show
    <br />
    After, with the event on `onCreate` you can get the entered text and create
    the item.
    <br />
    A slot called `create` and `createText` is available for customizing the UI.
  </p>
  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick a color:</h5>

      <AutoComplete
        items={colors}
        bind:selectedItem={selectedColor}
        bind:text
        create={true}
        createText={"Item doesn't exist, create one?"}
        onCreate={handleCreate} />
      <p>Current user entered text: {text}</p>
      <p>Selected color: {selectedColor}</p>
      <p>To create: {toCreate}</p>

    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
