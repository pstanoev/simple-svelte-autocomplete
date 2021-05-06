# Simple Svelte Autocomplete

Autocomplete / Select / Typeahead component made with [Svelte](https://svelte.dev/)

### Live demo http://simple-svelte-autocomplete.surge.sh/

* no dependencies
* use plain lists or array of objects
* option to define a label field or function
* option to define more fields used for search
* support for async load of items


## Install

```bash
npm i -D simple-svelte-autocomplete
```

## Usage
Import the component and define items:

````javascript
import AutoComplete from "simple-svelte-autocomplete";

const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
let selectedColor;
````

And use it like this:
````html
<AutoComplete items={colors} bind:selectedItem={selectedColor} />
````

You can also use it with array of objects:
````javascript
const colorList = [
  { id: 1, name: "White", code: "#FFFFFF" },
  { id: 2, name: "Red", code: "#FF0000" },
  { id: 3, name: "Yellow", code: "#FF00FF" },
  { id: 4, name: "Green", code: "#00FF00" },
  { id: 5, name: "Blue", code: "#0000FF" },
  { id: 6, name: "Black", code: "#000000" }
];

let selectedColorObject;
````
Just define which field should be used as label:
````html
<AutoComplete
  items={colorList}
  bind:selectedItem={selectedColorObject}
  labelFieldName="name" />
````

Specifying function for label instead of field name is also supported:
````html
<AutoComplete
  items={colorList}
  bind:selectedItem={selectedColorObject}
  labelFunction={color => color.id + '. ' + color.name} />
````

By default the component searches by the item label, but it can also search by custom fields by specifying `keywords` function. For example to enable searching by color name and color HEX code:
````html
<AutoComplete
  items={colorList}
  bind:selectedItem={selectedColorObject}
  labelFieldName="name"
  keywordsFunction={color => color.name + ' ' + color.code} />
````

## Asynchronous loading of items

Define a `searchFunction` which will be called with `keyword` parameter.
If you have `searchFunction` defined you don't need to specify `items` since the function will be used for loading.
The `delay` parameter specifies the time to wait between user input and calling the `searchFunction`.
It is recommend that delay > 200ms is set when using a remote search function to avoid sending too many requests.
The `localSearch` parameter can be set to false if the search function already returns filtered items accordind to the user input.
```html
<AutoComplete searchFunction={getItems} delay=200 localSearch=false labelFieldName="name" valueFieldName="id" bind:selectedItem={myValue} />
```

```js
async function getItems(keyword) {
  const url = '/api/my-items/?format=json&name=' + encodeURIComponent(keyword);

  const response = await fetch(url);
  const json = await response.json();

  return json.results;
}
```

```json
{
  "results": [
    {
      "id": 1,
      "name": "Sample One",
      "date": "2020-09-25",
    },
    {
      "id": 2,
      "name": "Sample Two",
      "date": "2020-09-26",
    }
  ]
}
```

## Properties

### Behaviour

- `items` - array of items the user can select from (optional, use `searchFunction` for async loading of items)
- `searchFunction` - optional function to load items asynchroniously from HTTP call for example, the searchFunction can also return all items and addtional local search will still be performed
- `delay` - delay in miliseconds to wait after user input to do the local searching or call `searchFunction` if provided, defaults to 0
- `localFiltering` - boolean specifying if `searchFunction` is used, to still peform local filtering of the items to only ones that match the  user input, defaults to true
- `selectedItem` - the current item that is selected (object if the array of items contains objects)
- `labelFieldName` - the name of the field to be used for showing the items as text in the droprown
- `keywordsFieldName` - the name of the filed to search by
- `value` - derived value from the `selectedItem`, equals to `selectedItem` if `valueFieldName` is not specified
- `valueFieldName` - field to use to derive the value from the selected item
- `labelFunction` - optional function that creates label from the item. If used `labelFieldName` is ignored
- `keywordsFunction` - optional function that creates text to search from the item. If used `keywordsFieldName` is ignored
- `valueFunction` - optional function that derives the value from the selected item. If used `valueFieldName` is ignored
- `keywordsCleanFunction` - optional function to additionally process the derived keywords from the item
- `textCleanFunction` - optional function to additionally process the user entered text
- `selectFirstIfEmpty` - set to true to select the first item if the user clears the text and closes the dropdown. Defaults to false.
- `minCharactersToSearch` - minimum length of search text to perform search, defaults to 1
- `maxItemsToShowInList` - maximum number of items to show in the dropdown list, defaults 0 (no limit)
- `disabled` - disable the control
- `ignoreAccents` - ignores the accents to match items, defaults to true.

### Events

- `beforeChange` - function called before a new value is selected
- `onChange` - function called after new value is selected

### Style and UI options

- `placeholder` - change the text displayed when no option is selected
- `noResultsText` - text to show in the dropdown when the search text does not match any item. Defaults to "No results found". Can be set to "" to not show anything.
- `hideArrow` - set to true to not show the blue dropdown arrow
- `showClear` - set to true to show X button that can be used to deselect the selected item
- `className` - apply a className to the control
- `inputClassName` - apply a className to the input control
- `inputId` - apply an id attribute to the the input control
- `dropdownClassName` - apply a className to the dropdown div showing the list of items
- `name` - generate an HTML input with this name, containing the current value
- `debug` - flag to enable detailed log statements from the component
- `html5autocomplete` - flag to enable or disable the [HTML5 autocomplete](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form#attr-autocomplete) attribute

### UI Slots
- `item` - change the apearance of items in the dropdown list:
```html
<div slot="item" let:item={item} let:label={label}>
  {@html label} <!-- to render the default higliglighted item label -->
  <!-- render anything else -->
  <span style="color:{item.propertyX}">{item.propertyY}</span>
</div>
```
- `no-results` - customize the div that shows the "no results" text:
```html
<div slot="no-results" let:noResultsText={noResultsText}>
    <span>{noResultsText}</strong>
</pre>
```
The noResultsText variable is optional and can be ommited.

#### CSS properties
- `autocomplete` the class applied to the main control
- `autocomplete-input` the class applied to the input list
- `autocomplete-list` the class applied to the dropdown list
- `autocomplete-list-item` the class applied to items in the dropdown list

The component is inteded to use with [Bulma](https://bulma.io/) but it can be adapted to use Boostrap or anything else.
