# Simple Svelte Autocomplete

Autocomplete / Select / Typeahead component made with [Svelte](https://svelte.dev/)

### Live demo http://simple-svelte-autocomplete.surge.sh/

- no dependencies
- use plain lists or array of objects
- option to define a label field or function
- option to define more fields used for search
- support for async load of items
- can hold one or several values

## Install

```bash
npm i -D simple-svelte-autocomplete
```

## Usage

Import the component and define items:

```javascript
import AutoComplete from "simple-svelte-autocomplete"

const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"]
let selectedColor
```

And use it like this:

```html
<AutoComplete items="{colors}" bind:selectedItem="{selectedColor}" />
```

You can also use it with array of objects:

```javascript
const colorList = [
  { id: 1, name: "White", code: "#FFFFFF" },
  { id: 2, name: "Red", code: "#FF0000" },
  { id: 3, name: "Yellow", code: "#FF00FF" },
  { id: 4, name: "Green", code: "#00FF00" },
  { id: 5, name: "Blue", code: "#0000FF" },
  { id: 6, name: "Black", code: "#000000" },
]

let selectedColorObject
```

Just define which field should be used as label:

```html
<AutoComplete items="{colorList}" bind:selectedItem="{selectedColorObject}" labelFieldName="name" />
```

Specifying function for label instead of field name is also supported:

```html
<AutoComplete items={colorList} bind:selectedItem={selectedColorObject} labelFunction={color =>
color.id + '. ' + color.name} />
```

By default the component searches by the item label, but it can also search by custom fields by specifying `keywords` function. For example to enable searching by color name and color HEX code:

```html
<AutoComplete items={colorList} bind:selectedItem={selectedColorObject} labelFieldName="name"
keywordsFunction={color => color.name + ' ' + color.code} />
```

## Asynchronous loading of items

Define a `searchFunction` which will be called with `keyword` and `maxItemsToShowInList` parameters.
If you have `searchFunction` defined you don't need to specify `items` since the function will be used for loading.
The `delay` parameter specifies the time to wait between user input and calling the `searchFunction`.
It is recommend that delay > 200ms is set when using a remote search function to avoid sending too many requests.
The `localFiltering` parameter can be set to false if the search function already returns filtered items according to the user input.

```html
<AutoComplete
  searchFunction="{getItems}"
  delay="200"
  localFiltering="false"
  labelFieldName="name"
  valueFieldName="id"
  bind:selectedItem="{myValue}"
/>
```

```js
async function getItems(keyword) {
  const url = "/api/my-items/?format=json&name=" + encodeURIComponent(keyword)

  const response = await fetch(url)
  const json = await response.json()

  return json.results
}
```

```json
{
  "results": [
    {
      "id": 1,
      "name": "Sample One",
      "date": "2020-09-25"
    },
    {
      "id": 2,
      "name": "Sample Two",
      "date": "2020-09-26"
    }
  ]
}
```

## Properties

### Behaviour

- `items` - array of items the user can select from (optional, use `searchFunction` for async loading of items)
- `searchFunction` - optional function to load items asynchronously from HTTP call for example, the searchFunction can also return all items and additional local search will still be performed
- `delay` - delay in milliseconds to wait after user input to do the local searching or call `searchFunction` if provided, defaults to 0
- `localFiltering` - boolean specifying if `searchFunction` is used, to still perform local filtering of the items to only ones that match the user input, defaults to true
- `localSorting`  - boolean specifying if result items should be sorted locally by `itemSortFunction` or `sortByMatchedKeywords`. If set to false, no local sorting will be done
- `cleanUserText` - by default the component removes special characters and spaces from the user entered text, set `cleanUserText=false` to prevent this
- `multiple` - enable multiple selection (false by default)
- `selectedItem` - the current item that is selected (object if the array of items contains objects)
- `highlightedItem` - the current item that is highlighted in the dropdown menu
- `labelFieldName` - the name of the field to be used for showing the items as text in the dropdown
- `keywordsFieldName` - the name of the field to search by, if not specified the label will be used
- `value` - derived value from the `selectedItem`, equals to `selectedItem` if `valueFieldName` is not specified
- `valueFieldName` - field to use to derive the value from the selected item
- `labelFunction` - optional function that creates label from the item. If used `labelFieldName` is ignored
- `keywordsFunction` - optional function that creates text to search from the item. If used `keywordsFieldName` is ignored
- `valueFunction` - optional function that derives the value from the selected item. If used `valueFieldName` is ignored
- `keywordsCleanFunction` - optional function to additionally process the derived keywords from the item
- `textCleanFunction` - optional function to additionally process the user entered text. Ignored if `cleanUserText=false`
- `selectFirstIfEmpty` - set to true to select the first item if the user clears the text and closes the dropdown, defaults to false
- `minCharactersToSearch` - minimum length of search text to perform search, defaults to 1
- `maxItemsToShowInList` - maximum number of items to show in the dropdown list, defaults 0 (no limit)
- `ignoreAccents` - ignores the accents/umlauts (è,ü,ö etc) to match items, defaults to true
- `matchAllKeywords` - defaults to true, if false, any item will be suggested if it shares at least one common keyword with the input. Ignored if sorting function is given with `itemSortFunction`
- `sortByMatchedKeywords` - defaults to false, if true, items are sorted by the number of matched keywords, only useful if `matchAllKeywords` is false. Ignored if sorting function is given with `itemSortFunction`
- `itemSortFunction` - Optional custom function to order items. Parameters are two list items to compare and the cleaned up search query. Returns an integer indicating wether the first item comes before the seconde one. Only used if `sortByMatchedKeywords` is true.
- `itemFilterFunction` - Optional custom function to filter items. Parameters are a list item and the cleaned up search query. Returns a boolean indicated wether to keep the item. If this is used, the `keywordsFieldName` and `keywordsFunction` are ignored

- `disabled` - disable the control completely
- `readonly` - make the input readonly, no user entered text (simulates combobox), item from the list can still be selected
- `lock` - defaults to false, locks the input for user entered text when an item has been selected
- `create` - true to enable accepting of unlisted values
- `closeOnBlur` - true to close the dropdown when the component loses focus
- `debug` - flag to enable detailed log statements from the component

### Events

- `beforeChange` - function called before a new value is selected
- `onChange` - function called after new value is selected
- `onFocus` - function called on focus of the input control
- `onBlur` - function called on blur of the input control
- `onCreate` - function called when `create` is true and the user presses enter, the function must return add the created item to the `items` array and return it

### UI options

- `placeholder` - change the text displayed when no option is selected
- `noResultsText` - text to show in the dropdown when the search text does not match any item. Defaults to "No results found". Can be set to "" to not show anything.
- `moreItemsText` - text displayed when the user text matches a lot of items and we can display only up to `maxItemsToShowInList` items
- `createText` - text to show when `create` is true, and the user text doesn't match any of the items
- `hideArrow` - set to true to not show the blue dropdown arrow
- `showClear` - set to true to show X button that can be used to deselect the selected item
- `showLoadingIndicator` - defaults to false, set to true to show loading spinner when the async `searchFunction` is executed, bulma class 'is-loading' is added to the input control

### CSS classes and IDs

- `className` - apply a className to the control
- `inputClassName` - apply a className to the input control
- `noInputStyles` - set to true to disable the `input autocomplete-input` classes which are added to the input by default
- `inputId` - apply an id attribute to the the input control
- `dropdownClassName` - apply a className to the dropdown div showing the list of items
- `name` - generate an HTML input with this name, containing the current value
- `html5autocomplete` - flag to enable or disable the [HTML5 autocomplete](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form#attr-autocomplete) attribute
- `selectName` - apply a name attribute to the <select> tag that holds the selected value
- `selectId` - apply an id attribute to the <select> tag that holds the selected value
- `required` - adds the `required` attribute to the input
- `tabIndex` - adds the `tabIndex` attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex

### UI Slots

- `item` - change the apearance of items in the dropdown list:

```html
<div slot="item" let:item="{item}" let:label="{label}">
  {@html label}
  <!-- to render the default higliglighted item label -->
  <!-- render anything else -->
  <span style="color:{item.propertyX}">{item.propertyY}</span>
</div>
```

- `no-results` - customize the div that shows the "no results" text:

```html
<div slot="no-results" let:noResultsText={noResultsText}>
    <span>{noResultsText}</span>
</div>
```

The noResultsText variable is optional and can be ommited.

- `loading` - customize the div that shows the "loading" text:

```html
<div slot="loading" let:loadingText={loadingText}>
    <span>{loadingText}</strong>
</div>
```

- `tag` - customize the tag blocks displayed when multiple selection is enabled:

```html
<slot name="tag" let:label="{label}" let:item="{item}" let:unselectItem="{unselectItem}">
  <span class="tag">{label}</span>
  <span class="delete-tag" on:click|preventDefault="{unselectItem(item)}"></span>
</slot>
```

#### CSS properties

- `autocomplete` the class applied to the main control
- `autocomplete-input` the class applied to the input list
- `autocomplete-list` the class applied to the dropdown list
- `autocomplete-list-item` the class applied to items in the dropdown list

Note: Setting `noInputStyles=true` will disable the use of the `autocomplete-input` class above.

Use global to apply styles, example:
```
  .parent :global(.childClass) {
    color: red;
  }

```

The component is inteded to use with [Bulma](https://bulma.io/) but it can be adapted to use Boostrap or anything else.
