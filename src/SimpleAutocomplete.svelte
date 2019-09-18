<script>
  // the list of items  the user can select from
  export let items;

  // field of each item that's used for the labels in the list
  export let labelFieldName = undefined;
  export let keywordsFieldName = labelFieldName;
  export let valueFieldName = undefined;

  export let labelFunction = function(item) {
    return labelFieldName ? item[labelFieldName] : item;
  };

  export let keywordsFunction = function(item) {
    return keywordsFieldName ? item[keywordsFieldName] : item;
  };

  export let valueFunction = function(item) {
    if (item === undefined || item === null) {
      return item;
    }
    return valueFieldName ? item[valueFieldName] : item;
  };

  export let keywordsCleanFunction = function(keywords) {
    return keywords;
  };

  export let textCleanFunction = function(userEnteredText) {
    return userEnteredText;
  };

  export let beforeChange = function(oldSelectedItem, newSelectedItem) {
    return true;
  };

  export let onChange = function(newSelectedItem) {};

  function safeStringFunction(theFunction, argument) {
    if (typeof theFunction !== "function") {
      console.error(
        "Not a function: " + theFunction + ", argument: " + argument
      );
    }
    let originalResult;
    try {
      originalResult = theFunction(argument);
    } catch (error) {
      console.warn(
        "Error executing Autocomplete function on value: " + argument
      );
    }
    let result = originalResult;
    if (result === undefined || result === null) {
      result = "";
    }
    if (typeof result !== "string") {
      result = result.toString();
    }
    return result;
  }

  function safeLabelFunction(item) {
    // console.log("labelFunction: " + labelFunction);
    // console.log("safeLabelFunction, item: " + item);
    return safeStringFunction(labelFunction, item);
  }

  function safeKeywordsFunction(item) {
    // console.log("safeKeywordsFunction");
    let keywords = safeStringFunction(keywordsFunction, item);
    let result = safeStringFunction(keywordsCleanFunction, keywords);
    result = result.toLowerCase().trim();
    if (debug) {
      console.log(
        "Extracted keywords: '" +
          result +
          "' from item: " +
          JSON.stringify(item)
      );
    }
    return result;
  }

  // the text displayed when no option is selected
  export let placeholder = undefined;
  // apply a className to the control
  export let className = undefined;
  // generate an HTML input with this name, containing the current value
  export let name = undefined;
  // adds the disabled tag to the HTML input
  export let disabled = false;
  // add the title to the HTML input
  export let title = undefined;
  export let debug = false;

  // selected item state
  export let selectedItem = undefined;
  export let value;
  let text;

  function onSelectedItemChanged() {
    value = valueFunction(selectedItem);
    text = safeLabelFunction(selectedItem);
    onChange(selectedItem);
  }

  $: selectedItem, onSelectedItemChanged();

  // HTML elements
  let input;
  let list;

  // UI state
  let opened = false;
  let highlightIndex = -1;

  // view model
  let filteredListItems;

  let listItems = [];
  let skipFirstItem = true;

  function preparelistItems() {
    var tStart;
    if (debug) {
      tStart = performance.now();
      console.log("prepare items to search");
      console.log("items: " + JSON.stringify(items));
    }
    listItems = new Array(items ? items.length : 0);

    if (items && items.length > 0) {
      items.forEach((item, i) => {
        listItems[i] = getListItem(item);
      });
    }

    if (debug) {
      var tEnd = performance.now();
      console.log(
        listItems.length +
          " items to search prepared in " +
          (tEnd - tStart) +
          " milliseconds"
      );
    }
  }

  function getListItem(item) {
    return {
      // keywords representation of the item
      keywords: safeKeywordsFunction(item),
      // item label
      label: safeLabelFunction(item),
      // store reference to the origial item
      item: item
    };
  }

  $: items, preparelistItems();

  function preprareUserEnteredText(userEnteredText) {
    if (userEnteredText === undefined || userEnteredText === null) {
      return "";
    }
    const textFiltered = userEnteredText
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, " ")
      .trim();

    const cleanUserEnteredText = textCleanFunction(textFiltered);
    const textFilteredLowerCase = cleanUserEnteredText.toLowerCase().trim();

    if (debug) {
      console.log(
        "Change user entered text '" +
          userEnteredText +
          "' into '" +
          textFilteredLowerCase +
          "'"
      );
    }
    return textFilteredLowerCase;
  }

  function search() {
    var tStart;
    if (debug) {
      tStart = performance.now();
      console.log("Searching user entered text: '" + text + "'");
    }

    const textFiltered = preprareUserEnteredText(text);

    if (textFiltered === "") {
      filteredListItems = listItems;
      if (debug) {
        console.log(
          "User entered text is empty set the list of items to all items"
        );
      }
      return;
    }

    const searchWords = textFiltered.split(" ");

    const tempfilteredListItems = listItems.filter(listItem => {
      const itemKeywords = listItem.keywords;

      let matches = 0;
      searchWords.forEach(searchWord => {
        if (itemKeywords.includes(searchWord)) {
          matches++;
        }
      });

      return matches >= searchWords.length;
    });

    const hlfilter = highlightFilter(textFiltered, ["label"]);
    const filteredListItemsHighlighted = tempfilteredListItems.map(hlfilter);
    filteredListItems = filteredListItemsHighlighted;
    if (debug) {
      var tEnd = performance.now();
      console.log(
        "Search took " +
          (tEnd - tStart) +
          " milliseconds, found " +
          filteredListItems.length +
          " items"
      );
    }
  }

  // $: text, search();

  function selectListItem(listItem) {
    if (debug) {
      console.log("selectListItem");
    }
    const newSelectedItem = listItem.item;
    if (beforeChange(selectedItem, newSelectedItem)) {
      selectedItem = newSelectedItem;
    }
  }

  function selectItem() {
    if (debug) {
      console.log("selectItem");
    }
    const listItem = filteredListItems[highlightIndex];
    selectListItem(listItem);
    close();
  }

  function up() {
    if (debug) {
      console.log("up");
    }

    open();
    if (highlightIndex > 0) highlightIndex--;
    highlight();
  }

  function down() {
    if (debug) {
      console.log("down");
    }

    open();
    if (highlightIndex < filteredListItems.length - 1) highlightIndex++;
    highlight();
  }

  function highlight() {
    if (debug) {
      console.log("highlight");
    }

    const el = list.querySelector(".selected");
    if (el && el.scrollIntoViewIfNeeded === "Function") {
      el.scrollIntoViewIfNeeded();
    }
  }

  function onListItemClick(listItem) {
    if (debug) {
      console.log("onListItemClick");
    }

    selectListItem(listItem);
    close();
  }

  function onDocumentClick(e) {
    if (debug) {
      console.log("onDocumentClick: " + JSON.stringify(e.target));
    }
    if (!e.target.closest(".autocomplete")) {
      if (debug) {
        console.log("onDocumentClick outside");
      }
      close();
    } else {
      // if (debug) {
      //   console.log("onDocumentClick inside");
      // }
      // resetListToAllItemsAndOpen();
      // highlight();
    }
  }

  function onKeyDown(e) {
    if (debug) {
      console.log("onKeyDown");
    }

    let key = e.key;
    if (key === "Tab" && e.shiftKey) key = "ShiftTab";
    const fnmap = {
      Tab: opened ? down.bind(this) : null,
      ShiftTab: opened ? up.bind(this) : null,
      ArrowDown: down.bind(this),
      ArrowUp: up.bind(this),
      Escape: onEsc.bind(this)
    };
    const fn = fnmap[key];
    if (typeof fn === "function") {
      e.preventDefault();
      fn(e);
    }
  }

  function onKeyPress(e) {
    if (debug) {
      console.log("onKeyPress");
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectItem();
    }
  }

  function onInput(e) {
    if (debug) {
      console.log("onInput");
    }

    text = e.target.value;
    search();
    highlightIndex = 0;
    open();
  }

  function onInputClick() {
    if (debug) {
      console.log("onInputClick");
    }
    resetListToAllItemsAndOpen();
  }

  function onEsc(e) {
    if (debug) {
      console.log("onEsc");
    }

    //if (text) return clear();
    e.stopPropagation();
    if (opened) {
      input.focus();
      close();
    }
  }

  function onFocus() {
    if (debug) {
      console.log("onFocus");
    }

    resetListToAllItemsAndOpen();
  }

  function resetListToAllItemsAndOpen() {
    if (debug) {
      console.log("resetListToAllItemsAndOpen");
    }

    filteredListItems = listItems;

    // find selected item
    if (selectedItem) {
      // console.log(
      //   "Searching currently selected value: " + JSON.stringify(value)
      // );
      for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        if (selectedItem == listItem.item) {
          highlightIndex = i;
          if (debug) {
            console.log(
              "Found selected item: " + i + ": " + JSON.stringify(listItem)
            );
          }
          highlight();
          break;
        }
      }
    }

    open();
  }

  function open() {
    if (debug) {
      console.log("open");
    }
    opened = true;
  }

  function close() {
    if (debug) {
      console.log("close");
    }
    opened = false;
  }

  function clear() {
    if (debug) {
      console.log("clear");
    }

    text = "";
    setTimeout(() => input.focus());
  }

  function onBlur() {
    if (debug) {
      console.log("onBlur");
    }
    close();
  }
  // 'item number one'.replace(/(it)(.*)(nu)(.*)(one)/ig, '<b>$1</b>$2 <b>$3</b>$4 <b>$5</b>')
  function highlightFilter(q, fields) {
    const qs = "(" + q.trim().replace(/\s/g, ")(.*)(") + ")";
    const reg = new RegExp(qs, "ig");
    let n = 1,
      len = qs.split(")(").length + 1,
      repl = "";
    for (; n < len; n++) repl += n % 2 ? `<b>$${n}</b>` : `$${n}`;

    return i => {
      const newI = Object.assign({ highlighted: {} }, i);
      if (fields) {
        fields.forEach(f => {
          if (!newI[f]) return;
          newI.highlighted[f] = newI[f].replace(reg, repl);
        });
      }
      return newI;
    };
  }
</script>

<style>
  .autocomplete {
    min-width: 200px;
  }
  .autocomplete * {
    box-sizing: border-box;
  }
  .autocomplete-input {
    font: inherit;
    width: 100%;
    height: 100%;
    padding: 5px 11px;
  }
  .autocomplete-list {
    background: #fff;
    position: relative;
    width: 100%;
    overflow-y: auto;
    z-index: 99;
    padding: 10px 0;
    top: 0px;
    border: 1px solid #999;
    max-height: calc(15 * (1rem + 10px) + 15px);
    user-select: none;
  }
  .autocomplete-list:empty {
    padding: 0;
  }
  .autocomplete-list-item {
    padding: 5px 15px;
    color: #333;
    cursor: pointer;
    line-height: 1;
  }
  .autocomplete-list-item:hover,
  .autocomplete-list-item.selected {
    background-color: #2e69e2;
    color: #fff;
  }
  .autocomplete-list.hidden {
    display: none;
  }
</style>

<div class="{className} autocomplete select is-fullwidth">
  <input
    type="text"
    class="input autocomplete-input"
    {placeholder}
    {name}
    {disabled}
    {title}
    bind:this={input}
    bind:value={text}
    on:input={onInput}
    on:focus={onFocus}
    on:keydown={onKeyDown}
    on:click={onInputClick}
    on:keypress={onKeyPress} />
  <div
    class="autocomplete-list {opened ? '' : 'hidden'} is-fullwidth"
    bind:this={list}>
    {#if filteredListItems}
      {#each filteredListItems as listItem, i}
        <div
          class="autocomplete-list-item {i === highlightIndex ? 'selected' : ''}"
          on:click={() => onListItemClick(listItem)}>
          {#if listItem.highlighted}
            {@html listItem.highlighted.label}
          {:else}
            {@html listItem.label}
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<svelte:window on:click={onDocumentClick} />
