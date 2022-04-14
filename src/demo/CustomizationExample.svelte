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

  let selectedColorObjectCustom
  let selectedColorValueCustom

  const code = `<AutoComplete ...>

    <div slot="item" let:item={item} let:label={label}>
        {@html label}
        <span style="color:{item.code}">{item.code}</span>
    </div>

    <div slot="no-results" let:noResultsText={noResultsText}>
       <strong>NO RESULTS - {noResultsText}</strong>
    </div>

    <div slot="create" let:createText={createText}>
       <strong>Item doesn't exist, create? - {createText}</strong>
    </div>

</AutoComplete>`
</script>

<div>
  <h3 class="mt-3">Slots</h3>
  <article class="message is-info">
    <div class="message-body">
      You can use the svelte slots mechanism to customize the copmonent.
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
            items={colorList}
            bind:selectedItem={selectedColorObjectCustom}
            bind:value={selectedColorValueCustom}
            labelFieldName="name"
            valueFieldName="id"
            create={true}
            keywordsFunction={(color) => color.name + " " + color.code}
            placeholder="Please select color"
          >
            <div slot="item" let:item let:label>
              {@html label}
              <span style="color:{item.code}">{item.code}</span>
            </div>

            <div slot="no-results" let:noResultsText>
              <strong>NO RESULTS - {noResultsText}</strong>
            </div>
          </AutoComplete>
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
