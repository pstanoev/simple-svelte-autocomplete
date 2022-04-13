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
const animals = ["White Rabbit", "White Horse", "Black Rabbit", "Black Horse", "Black Black Rabbit"];
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
  <h3 class="mt-3">Matching keyword strategy:</h3>
  <p>
    When <code>matchAllKeywords</code> is set to false, the component will show all items that match at least
    one keyword. The sorting of the items can also be changed to show the ones with most matches
    first.
  </p>
  <div class="columns">
    <div class="column is-one-third">
      <h5>Pick an animal:</h5>

      <AutoComplete
        items={animals}
        bind:selectedItem={selectedAnimal}
        matchAllKeywords={false}
        sortByMatchedKeywords={true}
      />
      <p>Selected animal: {selectedAnimal}</p>
    </div>

    <div class="column">
      <Highlight language={xml} {code} />
    </div>
  </div>
</div>
