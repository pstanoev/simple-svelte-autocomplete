<script>
  import AutoComplete from "../SimpleAutocomplete.svelte"
  import Highlight from "svelte-highlight"
  import xml from "svelte-highlight/languages/xml"

  const animals = [
    "White Rabbit",
    "White Horse",
    "Black Rabbit",
    "Black Horse",
    "Black Black Rabbit",
  ]
  let selectedAnimal

  const code = `<script>
const animals = [
  "White Rabbit", "White Horse", "Black Rabbit", "Black Horse", "Black Black Rabbit"
];
let selectedAnimal;
<\/script>

<AutoComplete
    items={animals}
    bind:selectedItem={selectedAnimal}
    matchAllKeywords={false}
    sortByMatchedKeywords={true}
    />`
</script>

<div>
  <h3 class="mt-3">Matching keyword strategy</h3>
  <article class="message is-info">
    <div class="message-body">
      When <code>matchAllKeywords</code> is set to false, the component will show all items that match
      at least one keyword. The sorting of the items can also be changed to show the ones with most matches
      first.
    </div>
  </article>

  <div class="columns">
    <div class="column is-one-third">
      <article class="message">
        <div class="message-header">
          <p>Pick an animal</p>
        </div>
        <div class="message-body">
          <AutoComplete
            items={animals}
            bind:selectedItem={selectedAnimal}
            matchAllKeywords={false}
            sortByMatchedKeywords={true}
          />
          <p>Selected animal: <code>{selectedAnimal}</code></p>
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
