<script>
  // the list of items  the user can select from
  export let items = [];

  // function to use to get all items (alternative to providing items)
  export let searchFunction = false;

  // field of each item that's used for the labels in the list
  export let labelFieldName = undefined;
  export let keywordsFieldName = labelFieldName;
  export let valueFieldName = undefined;

  export let labelFunction = function(item) {
    if (item === undefined || item === null) {
      return "";
    }
    return labelFieldName ? item[labelFieldName] : item;
  };

  export let keywordsFunction = function(item) {
    if (item === undefined || item === null) {
      return "";
    }
    return keywordsFieldName ? item[keywordsFieldName] : labelFunction(item);
  };

  export let valueFunction = function(item, force_single = false) {
    if (item === undefined || item === null) {
      return item;
    }
    if (!multiple || force_single) {
      return valueFieldName ? item[valueFieldName] : item;
    } else {
      return item.map(i => (valueFieldName ? i[valueFieldName] : i));
    }
  };

  export let keywordsCleanFunction = function(keywords) {
    return keywords;
  };

  export let textCleanFunction = function(userEnteredText) {
    return userEnteredText;
  };

  // events
  export let beforeChange = function(oldSelectedItem, newSelectedItem) {
    return true;
  };
  export let onChange = function(newSelectedItem) {};
  export let onFocus = function() {};
  export let onBlur = function() {};
  export let onCreate = function(text) {
    if (debug) {
      console.log("onCreate: " + text);
    }
  };

  // Behaviour properties
  export let selectFirstIfEmpty = false;
  export let minCharactersToSearch = 1;
  export let maxItemsToShowInList = 0;
  export let multiple = false;
  export let create = false;

  // ignores the accents when matching items
  export let ignoreAccents = true;

  // all the input keywords should be matched in the item keywords
  export let matchAllKeywords = true;

  // sorts the items by the number of matchink keywords
  export let sortByMatchedKeywords = false;

  // allow users to use a custom item filter function
  export let itemFilterFunction = undefined;

  // allow users to use a custom item sort function
  export let itemSortFunction = undefined;

  // do not allow re-selection after initial selection
  export let lock = false;

  // delay to wait after a keypress to search for new items
  export let delay = 0;

  // true to perform local filtering of items, even if searchFunction is provided
  export let localFiltering = true;

  // UI properties

  // option to hide the dropdown arrow
  export let hideArrow = false;

  // option to show clear selection button
  export let showClear = false;

  // option to show loading indicator when the async function is executed
  export let showLoadingIndicator = false;

  // text displayed when no items match the input text
  export let noResultsText = "No results found";

  // text displayed when async data is being loaded
  export let loadingText = "Loading results...";

  // text displayed when async data is being loaded
  export let createText = "Not found, add anyway?";

  // the text displayed when no option is selected
  export let placeholder = undefined;

  // apply a className to the control
  export let className = undefined;

  // HTML input UI properties
  // apply a className to the input control
  export let inputClassName = undefined;
  // apply a id to the input control
  export let inputId = undefined;
  // generate an HTML input with this name
  export let name = undefined;
  // generate a <select> tag that holds the value
  export let selectName = undefined;
  // apply a id to the <select>
  export let selectId = undefined;
  // add the title to the HTML input
  export let title = undefined;
  // enable the html5 autocompletion to the HTML input
  export let html5autocomplete = undefined;
  // make the input readonly
  export let readonly = undefined;
  // apply a className to the dropdown div
  export let dropdownClassName = undefined;
  // adds the disabled tag to the HTML input
  export let disabled = false;

  export let debug = false;

  // --- Public State ----

  // selected item state
  export let selectedItem = undefined;
  export let value = undefined;

  // --- Internal State ----
  const uniqueId = "sautocomplete-" + Math.floor(Math.random() * 1000);

  // HTML elements
  let input;
  let list;

  // UI state
  let opened = false;
  let loading = false;
  let highlightIndex = -1;
  export let text;
  let filteredTextLength = 0;

  // view model
  let filteredListItems;
  let listItems = [];

  // requests/responses counters
  let lastRequestId = 0;
  let lastResponseId = 0;

  // other state
  let inputDelayTimeout;

  // -- Reactivity --
  function onSelectedItemChanged() {
    value = valueFunction(selectedItem);
    text = !multiple ? safeLabelFunction(selectedItem) : "";
    onChange(selectedItem);
  }

  $: selectedItem, onSelectedItemChanged();

  $: showList =
    opened && ((items && items.length > 0) || filteredTextLength > 0);

  $: clearable = showClear || ((lock || multiple) && selectedItem);

  // --- Functions ---
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
        "Error executing Autocomplete function on value: " +
          argument +
          " function: " +
          theFunction
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
    const keywords = safeStringFunction(keywordsFunction, item);
    let result = safeStringFunction(keywordsCleanFunction, keywords);
    result = result.toLowerCase().trim();
    if (ignoreAccents) {
      result = removeAccents(result);
    }

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

  function prepareListItems() {
    let timerId;
    if (debug) {
      timerId = `Autocomplete prepare list ${
        inputId ? `(id: ${inputId})` : ""
      })`;
      console.time(timerId);
      console.log("Prepare items to search");
      console.log("items: " + JSON.stringify(items));
    }

    if (!Array.isArray(items)) {
      console.warn(
        "Autocomplete items / search function did not return array but",
        items
      );
      items = [];
    }

    const length = items ? items.length : 0;
    listItems = new Array(length);

    if (length > 0) {
      items.forEach((item, i) => {
        const listItem = getListItem(item);
        if (listItem == undefined) {
          console.log("Undefined item for: ", item);
        }
        listItems[i] = listItem;
      });
    }

    if (debug) {
      console.log(listItems.length + " items to search");
      console.timeEnd(timerId);
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

  $: items, prepareListItems();

  function prepareUserEnteredText(userEnteredText) {
    if (userEnteredText === undefined || userEnteredText === null) {
      return "";
    }

    const textFiltered = userEnteredText
      .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ")
      .trim();

    filteredTextLength = textFiltered.length;

    if (minCharactersToSearch > 1) {
      if (filteredTextLength < minCharactersToSearch) {
        return "";
      }
    }

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

  function numberOfMatches(listItem, searchWords) {
    if (!listItem) {
      return 0;
    }

    const itemKeywords = listItem.keywords;

    let matches = 0;
    searchWords.forEach(searchWord => {
      if (itemKeywords.includes(searchWord)) {
        matches++;
      }
    });

    return matches;
  }

  async function search() {
    let timerId;
    if (debug) {
      timerId = `Autocomplete search ${inputId ? `(id: ${inputId})` : ""})`;
      console.time(timerId);
      console.log("Searching user entered text: '" + text + "'");
    }

    const textFiltered = prepareUserEnteredText(text);

    if (textFiltered === "") {
      if (searchFunction) {
        // we will need to rerun the search
        items = [];
        if (debug) {
          console.log("User entered text is empty clear list of items");
        }
      } else {
        filteredListItems = listItems;
        if (debug) {
          console.log(
            "User entered text is empty set the list of items to all items"
          );
        }
      }
      closeIfMinCharsToSearchReached();
      if (debug) {
        console.timeEnd(timerId);
      }
      return;
    }

    if (!searchFunction) {
      processListItems(textFiltered);
    }

    // external search which provides items
    else {
      lastRequestId = lastRequestId + 1;
      const currentRequestId = lastRequestId;
      loading = true;

      // searchFunction is a generator
      if (searchFunction.constructor.name === 'AsyncGeneratorFunction') {
        for await (const chunk of searchFunction(textFiltered)) {
          // a chunk of an old response: throw it away
          if (currentRequestId < lastResponseId) {
            return false;
          }

          // a chunk for a new response: reset the item list
          if (currentRequestId > lastResponseId) {
            items = [];
          }

          lastResponseId = currentRequestId;
          items = [...items, ...chunk];
          processListItems(textFiltered);
        }

        // there was nothing in the chunk
        if (lastResponseId < currentRequestId) {
          lastResponseId = currentRequestId
          items = []
          processListItems(textFiltered);
        }
      }

      // searchFunction is a regular function
      else {
        let result = await searchFunction(textFiltered);

        // If a response to a newer request has been received
        // while responses to this request were being loaded,
        // then we can just throw away this outdated results.
        if (currentRequestId < lastResponseId) {
          return false;
        }

        lastResponseId = currentRequestId;
        items = result;
        processListItems(textFiltered);
      }

      loading = false;
    }

    if (debug) {
      console.timeEnd(timerId);
      console.log("Search found " + filteredListItems.length + " items");
    }
  }

  function defaultItemFilterFunction(listItem, searchWords){
    var matches = numberOfMatches(listItem, searchWords);
    if (matchAllKeywords) {
      return matches >= searchWords.length;
    } else {
      return matches > 0;
    }
  }

  function defaultItemSortFunction(obj1, obj2, searchWords) {
    return (
      numberOfMatches(obj2, searchWords) -
      numberOfMatches(obj1, searchWords)
    );
  }

  function processListItems(textFiltered) {
    // cleans, filters, orders, and highlights the list items
    prepareListItems();

    // local search
    let tempfilteredListItems;
    if (localFiltering) {
      if (textFiltered) {
        var searchWords = textFiltered;
        if (ignoreAccents) {
          searchWords = removeAccents(searchWords);
        }
        searchWords = searchWords.split(" ")
      }

      if (itemFilterFunction) {
        tempfilteredListItems = listItems.filter(
          item => itemFilterFunction(item, searchWords)
        );
      } else {
        tempfilteredListItems = listItems.filter(
          item => defaultItemFilterFunction(item, searchWords)
        );
      }

      if (sortByMatchedKeywords) {
        if (itemSortFunction) {
          tempfilteredListItems = tempfilteredListItems.sort(
              (item1, item2) => itemSortFunction(item1, item2, searchWords)
          );
        } else {
          tempfilteredListItems = tempfilteredListItems.sort(
              (item1, item2) => defaultItemSortFunction(item1, item2, searchWords)
          );
        }
      }
    } else {
      tempfilteredListItems = listItems;
    }

    const hlfilter = highlightFilter(textFiltered, ["label"]);
    const filteredListItemsHighlighted = tempfilteredListItems.map(hlfilter);

    filteredListItems = filteredListItemsHighlighted;
    closeIfMinCharsToSearchReached();
    return true;
  }

  // $: text, search();

  function selectListItem(listItem) {
    if (debug) {
      console.log("selectListItem");
    }
    if ("undefined" === typeof listItem) {
      // allow undefined items if create is enabled
      if (create) {
        onCreate(text);
        return true;
      }
      if (debug) {
        console.log(`listItem is undefined. Can not select.`);
      }
      return false;
    }
    const newSelectedItem = listItem.item;
    if (beforeChange(selectedItem, newSelectedItem)) {
      // simple selection
      if (!multiple) {
        selectedItem = newSelectedItem;
      }
      // first selection of multiple ones
      else if (!selectedItem) {
        selectedItem = [newSelectedItem];
      }
      // selecting something already selected => unselect it
      else if (selectedItem.includes(newSelectedItem)) {
        selectedItem = selectedItem.filter(i => i !== newSelectedItem);
      }
      // adds the element to the selection
      else {
        selectedItem = [...selectedItem, newSelectedItem];
      }
    }
    return true;
  }

  function selectItem() {
    if (debug) {
      console.log("selectItem");
    }
    const listItem = filteredListItems[highlightIndex];
    if (selectListItem(listItem)) {
      close();
      if (multiple) {
        input.focus();
      }
    }
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

    const query = ".selected";
    if (debug) {
      console.log("Seaching DOM element: " + query + " in " + list);
    }
    const el = list && list.querySelector(query);
    if (el) {
      if (typeof el.scrollIntoViewIfNeeded === "function") {
        if (debug) {
          console.log("Scrolling selected item into view");
        }
        el.scrollIntoViewIfNeeded();
      } else {
        if (debug) {
          console.warn(
            "Could not scroll selected item into view, scrollIntoViewIfNeeded not supported"
          );
        }
      }
    } else {
      if (debug) {
        console.warn("Selected item not found to scroll into view");
      }
    }
  }

  function onListItemClick(listItem) {
    if (debug) {
      console.log("onListItemClick");
    }

    if (selectListItem(listItem)) {
      close();
      if (multiple) {
        input.focus();
      }
    }
  }

  function onDocumentClick(e) {
    if (debug) {
      console.log("onDocumentClick: " + JSON.stringify(e.target));
    }
    if (e.target.closest("." + uniqueId)) {
      if (debug) {
        console.log("onDocumentClick inside");
      }
      // resetListToAllItemsAndOpen();
      highlight();
    } else {
      if (debug) {
        console.log("onDocumentClick outside");
      }
      close();
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
      Escape: onEsc.bind(this),
      Backspace:
        multiple && selectedItem && selectedItem.length && !text
          ? onBackspace.bind(this)
          : null
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

    if (e.key === "Enter" && opened) {
      e.preventDefault();
      onEnter();
    }
  }

  function onEnter() {
    selectItem();
  }

  function onInput(e) {
    if (debug) {
      console.log("onInput");
    }

    text = e.target.value;
    if (inputDelayTimeout) {
      clearTimeout(inputDelayTimeout);
    }

    if (delay) {
      inputDelayTimeout = setTimeout(processInput, delay);
    } else {
      processInput();
    }
  }

  function unselectItem(tag) {
    if (debug) {
      console.log("unselectItem", tag);
    }
    selectedItem = selectedItem.filter(i => i !== tag);
    input.focus();
  }

  function processInput() {
    if (search()) {
      highlightIndex = 0;
      open();
    }
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

  function onBackspace(e) {
    if (debug) {
      console.log("onBackspace");
    }

    unselectItem(selectedItem[selectedItem.length - 1]);
  }

  function onFocusInternal() {
    if (debug) {
      console.log("onFocus");
    }

    onFocus();

    resetListToAllItemsAndOpen();
  }

  function onBlurInternal() {
    if (debug) {
      console.log("onBlur");
    }

    onBlur();
  }

  function resetListToAllItemsAndOpen() {
    if (debug) {
      console.log("resetListToAllItemsAndOpen");
    }

    if (!text) {
      filteredListItems = listItems;
    }

    // When an async component is initialized, the item list
    // must be loaded when the input is focused.
    else if (!listItems.length && selectedItem && searchFunction) {
      search();
    }

    open();

    // find selected item
    if (selectedItem) {
      if (debug) {
        console.log(
          "Searching currently selected item: " + JSON.stringify(selectedItem)
        );
      }
      for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        if ("undefined" === typeof listItem) {
          if (debug) {
            console.log(`listItem ${i} is undefined. Skipping.`);
          }
          continue;
        }
        if (debug) {
          console.log("Item " + i + ": " + JSON.stringify(listItem));
        }
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
  }

  function open() {
    if (debug) {
      console.log("open");
    }

    // check if the search text has more than the min chars required
    if (isMinCharsToSearchReached()) {
      return;
    }

    opened = true;
  }

  function close() {
    if (debug) {
      console.log("close");
    }
    opened = false;
    loading = false;

    if (!text && selectFirstIfEmpty) {
      highlightFilter = 0;
      selectItem();
    }
  }

  function isMinCharsToSearchReached() {
    return (
      minCharactersToSearch > 1 && filteredTextLength < minCharactersToSearch
    );
  }

  function closeIfMinCharsToSearchReached() {
    if (isMinCharsToSearchReached()) {
      close();
    }
  }

  function clear() {
    if (debug) {
      console.log("clear");
    }

    text = "";
    selectedItem = undefined;

    setTimeout(() => {
      input.focus();
      close();
    });
  }

  export function highlightFilter(keywords, fields) {
    keywords = keywords.split(/\s+/g);
    return item => {
      const newItem = Object.assign({ highlighted: {} }, item);
      if (fields) {
        fields.forEach(field => {
          if (newItem[field] && !newItem.highlighted[field]) {
            newItem.highlighted[field] = newItem[field];
          }
          if (newItem.highlighted[field]) {
            keywords.forEach(keyword => {
              var keyword_pattern = ignoreAccents
                ? make_accent_insensitive_pattern(removeAccents(keyword))
                : keyword;
              const reg = new RegExp("(" + keyword_pattern + ")", "ig");
              newItem.highlighted[field] = newItem.highlighted[field].replace(
                reg,
                "<b>$1</b>"
              );
            });
          }
        });
      }
      return newItem;
    };
  }

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /**
   * Creates a RegExp that matches the words in the search string.
   * Case and accent insensitive.
   */
  function make_accent_insensitive_pattern(search_string) {
    var accented = {
      'A': '[Aa\xaa\xc0-\xc5\xe0-\xe5\u0100-\u0105\u01cd\u01ce\u0200-\u0203\u0226\u0227\u1d2c\u1d43\u1e00\u1e01\u1e9a\u1ea0-\u1ea3\u2090\u2100\u2101\u213b\u249c\u24b6\u24d0\u3371-\u3374\u3380-\u3384\u3388\u3389\u33a9-\u33af\u33c2\u33ca\u33df\u33ff\uff21\uff41]',
      'B': '[Bb\u1d2e\u1d47\u1e02-\u1e07\u212c\u249d\u24b7\u24d1\u3374\u3385-\u3387\u33c3\u33c8\u33d4\u33dd\uff22\uff42]',
      'C': '[Cc\xc7\xe7\u0106-\u010d\u1d9c\u2100\u2102\u2103\u2105\u2106\u212d\u216d\u217d\u249e\u24b8\u24d2\u3376\u3388\u3389\u339d\u33a0\u33a4\u33c4-\u33c7\uff23\uff43]',
      'D': '[Dd\u010e\u010f\u01c4-\u01c6\u01f1-\u01f3\u1d30\u1d48\u1e0a-\u1e13\u2145\u2146\u216e\u217e\u249f\u24b9\u24d3\u32cf\u3372\u3377-\u3379\u3397\u33ad-\u33af\u33c5\u33c8\uff24\uff44]',
      'E': '[Ee\xc8-\xcb\xe8-\xeb\u0112-\u011b\u0204-\u0207\u0228\u0229\u1d31\u1d49\u1e18-\u1e1b\u1eb8-\u1ebd\u2091\u2121\u212f\u2130\u2147\u24a0\u24ba\u24d4\u3250\u32cd\u32ce\uff25\uff45]',
      'F': '[Ff\u1da0\u1e1e\u1e1f\u2109\u2131\u213b\u24a1\u24bb\u24d5\u338a-\u338c\u3399\ufb00-\ufb04\uff26\uff46]',
      'G': '[Gg\u011c-\u0123\u01e6\u01e7\u01f4\u01f5\u1d33\u1d4d\u1e20\u1e21\u210a\u24a2\u24bc\u24d6\u32cc\u32cd\u3387\u338d-\u338f\u3393\u33ac\u33c6\u33c9\u33d2\u33ff\uff27\uff47]',
      'H': '[Hh\u0124\u0125\u021e\u021f\u02b0\u1d34\u1e22-\u1e2b\u1e96\u210b-\u210e\u24a3\u24bd\u24d7\u32cc\u3371\u3390-\u3394\u33ca\u33cb\u33d7\uff28\uff48]',
      'I': '[Ii\xcc-\xcf\xec-\xef\u0128-\u0130\u0132\u0133\u01cf\u01d0\u0208-\u020b\u1d35\u1d62\u1e2c\u1e2d\u1ec8-\u1ecb\u2071\u2110\u2111\u2139\u2148\u2160-\u2163\u2165-\u2168\u216a\u216b\u2170-\u2173\u2175-\u2178\u217a\u217b\u24a4\u24be\u24d8\u337a\u33cc\u33d5\ufb01\ufb03\uff29\uff49]',
      'J': '[Jj\u0132-\u0135\u01c7-\u01cc\u01f0\u02b2\u1d36\u2149\u24a5\u24bf\u24d9\u2c7c\uff2a\uff4a]',
      'K': '[Kk\u0136\u0137\u01e8\u01e9\u1d37\u1d4f\u1e30-\u1e35\u212a\u24a6\u24c0\u24da\u3384\u3385\u3389\u338f\u3391\u3398\u339e\u33a2\u33a6\u33aa\u33b8\u33be\u33c0\u33c6\u33cd-\u33cf\uff2b\uff4b]',
      'L': '[Ll\u0139-\u0140\u01c7-\u01c9\u02e1\u1d38\u1e36\u1e37\u1e3a-\u1e3d\u2112\u2113\u2121\u216c\u217c\u24a7\u24c1\u24db\u32cf\u3388\u3389\u33d0-\u33d3\u33d5\u33d6\u33ff\ufb02\ufb04\uff2c\uff4c]',
      'M': '[Mm\u1d39\u1d50\u1e3e-\u1e43\u2120\u2122\u2133\u216f\u217f\u24a8\u24c2\u24dc\u3377-\u3379\u3383\u3386\u338e\u3392\u3396\u3399-\u33a8\u33ab\u33b3\u33b7\u33b9\u33bd\u33bf\u33c1\u33c2\u33ce\u33d0\u33d4-\u33d6\u33d8\u33d9\u33de\u33df\uff2d\uff4d]',
      'N': '[Nn\xd1\xf1\u0143-\u0149\u01ca-\u01cc\u01f8\u01f9\u1d3a\u1e44-\u1e4b\u207f\u2115\u2116\u24a9\u24c3\u24dd\u3381\u338b\u339a\u33b1\u33b5\u33bb\u33cc\u33d1\uff2e\uff4e]',
      'O': '[Oo\xba\xd2-\xd6\xf2-\xf6\u014c-\u0151\u01a0\u01a1\u01d1\u01d2\u01ea\u01eb\u020c-\u020f\u022e\u022f\u1d3c\u1d52\u1ecc-\u1ecf\u2092\u2105\u2116\u2134\u24aa\u24c4\u24de\u3375\u33c7\u33d2\u33d6\uff2f\uff4f]',
      'P': '[Pp\u1d3e\u1d56\u1e54-\u1e57\u2119\u24ab\u24c5\u24df\u3250\u3371\u3376\u3380\u338a\u33a9-\u33ac\u33b0\u33b4\u33ba\u33cb\u33d7-\u33da\uff30\uff50]',
      'Q': '[Qq\u211a\u24ac\u24c6\u24e0\u33c3\uff31\uff51]',
      'R': '[Rr\u0154-\u0159\u0210-\u0213\u02b3\u1d3f\u1d63\u1e58-\u1e5b\u1e5e\u1e5f\u20a8\u211b-\u211d\u24ad\u24c7\u24e1\u32cd\u3374\u33ad-\u33af\u33da\u33db\uff32\uff52]',
      'S': '[Ss\u015a-\u0161\u017f\u0218\u0219\u02e2\u1e60-\u1e63\u20a8\u2101\u2120\u24ae\u24c8\u24e2\u33a7\u33a8\u33ae-\u33b3\u33db\u33dc\ufb06\uff33\uff53]',
      'T': '[Tt\u0162-\u0165\u021a\u021b\u1d40\u1d57\u1e6a-\u1e71\u1e97\u2121\u2122\u24af\u24c9\u24e3\u3250\u32cf\u3394\u33cf\ufb05\ufb06\uff34\uff54]',
      'U': '[Uu\xd9-\xdc\xf9-\xfc\u0168-\u0173\u01af\u01b0\u01d3\u01d4\u0214-\u0217\u1d41\u1d58\u1d64\u1e72-\u1e77\u1ee4-\u1ee7\u2106\u24b0\u24ca\u24e4\u3373\u337a\uff35\uff55]',
      'V': '[Vv\u1d5b\u1d65\u1e7c-\u1e7f\u2163-\u2167\u2173-\u2177\u24b1\u24cb\u24e5\u2c7d\u32ce\u3375\u33b4-\u33b9\u33dc\u33de\uff36\uff56]',
      'W': '[Ww\u0174\u0175\u02b7\u1d42\u1e80-\u1e89\u1e98\u24b2\u24cc\u24e6\u33ba-\u33bf\u33dd\uff37\uff57]',
      'X': '[Xx\u02e3\u1e8a-\u1e8d\u2093\u213b\u2168-\u216b\u2178-\u217b\u24b3\u24cd\u24e7\u33d3\uff38\uff58]',
      'Y': '[Yy\xdd\xfd\xff\u0176-\u0178\u0232\u0233\u02b8\u1e8e\u1e8f\u1e99\u1ef2-\u1ef9\u24b4\u24ce\u24e8\u33c9\uff39\uff59]',
      'Z': '[Zz\u0179-\u017e\u01f1-\u01f3\u1dbb\u1e90-\u1e95\u2124\u2128\u24b5\u24cf\u24e9\u3390-\u3394\uff3a\uff5a]'
      };

    // escape meta characters
    search_string = search_string.replace(/([|()[{.+*?^$\\])/g,"\\$1");

    // split into words
    var words = search_string.split(/\s+/);

    // sort by length
    var length_comp = function (a,b) {
        return b.length - a.length;
    };
    words.sort(length_comp);

    // replace characters by their compositors
    var accent_replacer = function(chr) {
        return accented[chr.toUpperCase()] || chr;
    }
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/\S/g,accent_replacer);
    }

    // join as alternatives
    var regexp = words.join("|");
    return regexp
  }

  function isConfirmed(listItem) {
    if (!selectedItem) {
      return false;
    }
    if (multiple) {
      return selectedItem.includes(listItem);
    } else {
      return listItem == selectedItem;
    }
  }
</script>

<style>
  .autocomplete {
    min-width: 200px;
    display: inline-block;
    max-width: 100%;
    position: relative;
    vertical-align: top;
    height: 2.25em;
  }

  .autocomplete:not(.hide-arrow):not(.is-loading)::after {
    border: 3px solid transparent;
    border-radius: 2px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: 0.625em;
    margin-top: -0.4375em;
    pointer-events: none;
    position: absolute;
    top: 50%;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: center;
    transform-origin: center;
    width: 0.625em;
    border-color: #3273dc;
    right: 1.125em;
    z-index: 4;
  }

  .autocomplete.show-clear:not(.hide-arrow)::after {
    right: 2.3em;
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

  .autocomplete:not(.hide-arrow) .autocomplete-input {
    padding-right: 2em;
  }
  .autocomplete.show-clear:not(.hide-arrow) .autocomplete-input {
    padding-right: 3.2em;
  }
  .autocomplete.hide-arrow.show-clear .autocomplete-input {
    padding-right: 2em;
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

  .autocomplete-list-item.confirmed {
    background-color: #789fed;
    color: #fff;
  }
  .autocomplete-list-item.selected {
    background-color: #2e69e2;
    color: #fff;
  }
  .autocomplete-list-item-no-results {
    padding: 5px 15px;
    color: #999;
    line-height: 1;
  }
  .autocomplete-list-item-create {
    padding: 5px 15px;
    line-height: 1;
  }
  .autocomplete-list-item-loading {
    padding: 5px 15px;
    line-height: 1;
  }

  .autocomplete-list.hidden {
    display: none;
  }

  .autocomplete.show-clear .autocomplete-clear-button {
    cursor: pointer;
    display: block;
    text-align: center;
    position: absolute;
    right: 0.1em;
    padding: 0.3em 0.6em;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    z-index: 4;
  }

  .autocomplete:not(.show-clear) .autocomplete-clear-button {
    display: none;
  }

  .autocomplete select {
    display: none;
  }

  .autocomplete.is-multiple .input-container {
    height: auto;
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    border-radius: 4px;
    border: 1px solid #b5b5b5;
    padding-left: 0.4em;
    padding-right: 0.4em;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    background-color: #fff;
  }

  .autocomplete.is-multiple .tag {
    display: flex;
    margin-top: 0.5em;
    margin-bottom: 0.3em;
  }

  .autocomplete.is-multiple .tag.is-delete {
    cursor: pointer;
  }

  .autocomplete.is-multiple .tags {
    margin-right: 0.3em;
    margin-bottom: 0;
  }

  .autocomplete.is-multiple .autocomplete-input {
    display: flex;
    width: 100%;
    flex: 1 1 50px;
    min-width: 3em;
    border: none;
    box-shadow: none;
    background: none;
  }
</style>

<div
  class="{className ? className : ''}
  {hideArrow || !items.length ? 'hide-arrow' : ''}
  {multiple ? 'is-multiple' : ''} autocomplete select is-fullwidth {uniqueId}"
  class:show-clear={clearable}
  class:is-loading={showLoadingIndicator && loading}>
  <select name={selectName} id={selectId} multiple="{multiple}">
    {#if !multiple && value}
      <option {value} selected>{text}</option>
    {:else if multiple && selectedItem}
      {#each selectedItem as i}
        <option value={valueFunction(i, true)} selected>
          {safeLabelFunction(i)}
        </option>
      {/each}
    {/if}
  </select>
  <div class="input-container">
    {#if multiple && selectedItem}
      {#each selectedItem as tagItem}
        <slot
          name="tag"
          label={safeLabelFunction(tagItem)}
          item={tagItem}
          {unselectItem}>
          <div class="tags has-addons">
            <span class="tag">{safeLabelFunction(tagItem)}</span>
            <span
              class="tag is-delete"
              on:click|preventDefault={unselectItem(tagItem)} />
          </div>
        </slot>
      {/each}
    {/if}
    <input
      type="text"
      class="{inputClassName ? inputClassName : ''} input autocomplete-input"
      id={inputId ? inputId : ''}
      autocomplete={html5autocomplete ? 'on' : 'off'}
      {placeholder}
      {name}
      {disabled}
      {title}
      readonly={readonly || (lock && selectedItem)}
      bind:this={input}
      bind:value={text}
      on:input={onInput}
      on:focus={onFocusInternal}
      on:blur={onBlurInternal}
      on:keydown={onKeyDown}
      on:click={onInputClick}
      on:keypress={onKeyPress} />
    {#if clearable}
      <span on:click={clear} class="autocomplete-clear-button">&#10006;</span>
    {/if}
  </div>
  <div
    class="{dropdownClassName ? dropdownClassName : ''} autocomplete-list {showList ? '' : 'hidden'}
    is-fullwidth"
    bind:this={list}>
    {#if filteredListItems && filteredListItems.length > 0}
      {#each filteredListItems as listItem, i}
        {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}
          {#if listItem}
            <div
              class="autocomplete-list-item {i === highlightIndex ? 'selected' : ''}"
              class:confirmed={isConfirmed(listItem.item)}
              on:click={() => onListItemClick(listItem)}
              on:pointerenter={() => {
                highlightIndex = i;
              }}>
              <slot
                name="item"
                item={listItem.item}
                label={listItem.highlighted ? listItem.highlighted.label : listItem.label}>
                {#if listItem.highlighted}
                  {@html listItem.highlighted.label}
                {:else}
                  {@html listItem.label}
                {/if}
              </slot>
            </div>
          {/if}
        {/if}
      {/each}

      {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}
        <div class="autocomplete-list-item-no-results">
          ...{filteredListItems.length - maxItemsToShowInList} results not shown
        </div>
      {/if}
    {:else if loading && loadingText}
      <div class="autocomplete-list-item-loading">
        <slot name="loading" {loadingText}>{loadingText}</slot>
      </div>
    {:else if create}
      <div class="autocomplete-list-item-create" on:click={selectItem}>
        <slot name="create" {createText}>{createText}</slot>
      </div>
    {:else if noResultsText}
      <div class="autocomplete-list-item-no-results">
        <slot name="no-results" {noResultsText}>{noResultsText}</slot>
      </div>
    {/if}
  </div>
</div>

<svelte:window on:click={onDocumentClick} />
