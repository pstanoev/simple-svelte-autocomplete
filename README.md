# Simple Svelte Autocomplete

Autocomplete / Select / Typeahead component made with [Svelte](https://svelte.dev/) based on  https://github.com/tborychowski/svelte-autocomplete


* no dependencies
* use plain lists or array of objects 
* option to define a label field or function
* option to define more fields used for search

#### See live demo at http://simple-svelte-autocomplete.surge.sh/

Import the component and define items:

````javascript
import AutoComplete from "./SimpleAutocomplete.svelte";
let colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];
let selectedColor;
````


````html
<AutoComplete items={colors} bind:selectedItem={selectedColor} />
````

You can also use it with array of objects:
````javascript
let colorList = [
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
  bind:value={selectedColorValue}
  labelFieldName="name" />
````


## Props

Props you may want to specify include:

- `className` - apply a className to the control
- `disabled` - disable the control
- `name` - generate an HTML input with this name, containing the current value
- `placeholder` - change the text displayed when no option is selected
- `beforeChange` - function called before a new value is selected
- `onChange` - function called after new value is selected
- `items` - array of items the user can select from
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
