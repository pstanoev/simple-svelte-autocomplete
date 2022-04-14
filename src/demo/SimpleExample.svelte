<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  let selectedColor
  let colors = ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"]
  const code = `<script>
import AutoComplete from 'simple-svelte-autocomplete';

const colors = [
    "White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"
];
let selectedColor;
<\/script>

Selected color: {selectedColor}
<AutoComplete items={colors} bind:selectedItem={selectedColor} />`
</script>

<div>
  <h3 class="mt-3">Basic usecase</h3>

  <article class="message is-info">
    <div class="message-body">
      You can use the <code>items</code> attribute to set the list of the items available for
      autocompletion.
      <br />
      <code>selectedItem</code> can be bound to the selected item.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick a color</p>
        </div>
        <div class="message-body">
          <p>Selected color: <code>{selectedColor}</code></p>

          <AutoComplete items={colors} bind:selectedItem={selectedColor} />
          <div>
            <br />
            <button class="button" on:click={() => (colors = ["One", "Two", "Three"])}>
              Change items
            </button>
          </div>
          <div>
            <p>
              REPL:<br />
              <a href="https://svelte.dev/repl/3e21f8eaeab1413d8ac173520c10cde1" target="_blank">
                svelte.dev/repl/3e21f8eaeab1413d8ac173520c10cde1
              </a>
            </p>
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

<style>
</style>
