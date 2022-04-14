<script>
  // the list of items  the user can select from
  export let items = []

  /**
   * function to use to get all items (alternative to providing items)
   * @type {boolean|function}
   */
  export let searchFunction = false

  // field of each item that's used for the labels in the list
  export let labelFieldName = undefined
  export let keywordsFieldName = labelFieldName
  export let valueFieldName = undefined

  export let labelFunction = function (item) {
    if (item === undefined || item === null) {
      return ""
    }
    return labelFieldName ? item[labelFieldName] : item
  }

  export let keywordsFunction = function (item) {
    if (item === undefined || item === null) {
      return ""
    }
    return keywordsFieldName ? item[keywordsFieldName] : labelFunction(item)
  }

  export let valueFunction = function (item, forceSingle = false) {
    if (item === undefined || item === null) {
      return item
    }
    if (!multiple || forceSingle) {
      return valueFieldName ? item[valueFieldName] : item
    } else {
      return item.map((i) => (valueFieldName ? i[valueFieldName] : i))
    }
  }

  export let keywordsCleanFunction = function (keywords) {
    return keywords
  }

  export let textCleanFunction = function (userEnteredText) {
    return userEnteredText
  }

  // events
  export let beforeChange = function (oldSelectedItem, newSelectedItem) {
    return true
  }
  export let onChange = function (newSelectedItem) {}
  export let onFocus = function () {}
  export let onBlur = function () {}
  export let onCreate = function (text) {
    if (debug) {
      console.log("onCreate: " + text)
    }
  }

  // Behaviour properties
  export let selectFirstIfEmpty = false
  export let minCharactersToSearch = 1
  export let maxItemsToShowInList = 0
  export let multiple = false
  export let create = false

  // ignores the accents when matching items
  export let ignoreAccents = true

  // all the input keywords should be matched in the item keywords
  export let matchAllKeywords = true

  // sorts the items by the number of matchink keywords
  export let sortByMatchedKeywords = false

  // allow users to use a custom item filter function
  export let itemFilterFunction = undefined

  // allow users to use a custom item sort function
  export let itemSortFunction = undefined

  // do not allow re-selection after initial selection
  export let lock = false

  // delay to wait after a keypress to search for new items
  export let delay = 0

  // true to perform local filtering of items, even if searchFunction is provided
  export let localFiltering = true

  // true to perform local sortying of items
  export let localSorting = true

  // true to clean the user entered text (removes spaces)
  export let cleanUserText = true

  // true to close the dropdown when the component loses focus
  export let closeOnBlur = false

  // UI properties

  // option to hide the dropdown arrow
  export let hideArrow = false

  // option to show clear selection button
  export let showClear = false

  // option to show loading indicator when the async function is executed
  export let showLoadingIndicator = false

  // text displayed when no items match the input text
  export let noResultsText = "No results found"

  // text displayed when async data is being loaded
  export let loadingText = "Loading results..."

  // text displayed when the user text matches a lot of items and we can not display them all in the dropdown
  export let moreItemsText = "items not shown"

  // text displayed when async data is being loaded
  export let createText = "Not found, add anyway?"

  // the text displayed when no option is selected
  export let placeholder = undefined

  // apply a className to the control
  export let className = undefined

  // HTML input UI properties
  // apply a className to the input control
  export let inputClassName = undefined
  // apply a id to the input control
  export let inputId = undefined
  // generate an HTML input with this name
  export let name = undefined
  // generate a <select> tag that holds the value
  export let selectName = undefined
  // apply a id to the <select>
  export let selectId = undefined
  // add the title to the HTML input
  export let title = undefined
  // enable the html5 autocompletion to the HTML input
  export let html5autocomplete = undefined
  // make the input readonly
  export let readonly = undefined
  // apply a className to the dropdown div
  export let dropdownClassName = undefined
  // adds the disabled tag to the HTML input
  export let disabled = false
  // remove the autocomplete-input class of the input
  export let noInputStyles = false
  // adds the required attribute to the HTML input
  export let required = null

  export let debug = false

  // add tabindex support for the input
  // set standard to 0: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
  export let tabindex = 0

  // --- Public State ----

  // selected item state
  export let selectedItem = multiple ? [] : undefined
  export let value = undefined
  export let highlightedItem = undefined

  // --- Internal State ----
  const uniqueId = "sautocomplete-" + Math.floor(Math.random() * 1000)

  // HTML elements
  let input
  let list

  // UI state
  let opened = false
  let loading = false
  let highlightIndex = -1
  export let text
  let filteredTextLength = 0

  // view model
  let filteredListItems
  let listItems = []

  // requests/responses counters
  let lastRequestId = 0
  let lastResponseId = 0

  // other state
  let inputDelayTimeout

  // --- Functions ---

  function safeFunction(theFunction, argument) {
    if (typeof theFunction !== "function") {
      console.error("Not a function: " + theFunction + ", argument: " + argument)
      return undefined
    }
    let result
    try {
      result = theFunction(argument)
    } catch (error) {
      console.warn(
        "Error executing Autocomplete function on value: " + argument + " function: " + theFunction
      )
    }
    return result
  }

  function safeStringFunction(theFunction, argument) {
    let result = safeFunction(theFunction, argument)
    if (result === undefined || result === null) {
      result = ""
    }
    if (typeof result !== "string") {
      result = result.toString()
    }
    return result
  }

  function safeLabelFunction(item) {
    // console.log("labelFunction: " + labelFunction);
    // console.log("safeLabelFunction, item: " + item);
    return safeStringFunction(labelFunction, item)
  }

  function safeKeywordsFunction(item) {
    // console.log("safeKeywordsFunction");
    const keywords = safeStringFunction(keywordsFunction, item)
    let result = safeStringFunction(keywordsCleanFunction, keywords)
    result = result.toLowerCase().trim()
    if (ignoreAccents) {
      result = removeAccents(result)
    }

    if (debug) {
      console.log("Extracted keywords: '" + result + "' from item: " + JSON.stringify(item))
    }
    return result
  }

  function prepareListItems() {
    let timerId
    if (debug) {
      timerId = `Autocomplete prepare list ${inputId ? `(id: ${inputId})` : ""}`
      console.time(timerId)
      console.log("Prepare items to search")
      console.log("items: " + JSON.stringify(items))
    }

    if (!Array.isArray(items)) {
      console.warn("Autocomplete items / search function did not return array but", items)
      items = []
    }

    const length = items ? items.length : 0
    listItems = new Array(length)

    if (length > 0) {
      items.forEach((item, i) => {
        const listItem = getListItem(item)
        if (listItem === undefined) {
          console.log("Undefined item for: ", item)
        }
        listItems[i] = listItem
      })
    }

    filteredListItems = listItems

    if (debug) {
      console.log(listItems.length + " items to search")
      console.timeEnd(timerId)
    }
  }

  function getListItem(item) {
    return {
      // keywords representation of the item
      keywords: localFiltering ? safeKeywordsFunction(item) : [],
      // item label
      label: safeLabelFunction(item),
      // store reference to the origial item
      item: item,
    }
  }

  // -- Reactivity --
  $: items, searchFunction || prepareListItems()

  function onSelectedItemChanged() {
    value = valueFunction(selectedItem)
    text = !multiple ? safeLabelFunction(selectedItem) : ""

    filteredListItems = listItems
    onChange(selectedItem)
  }

  $: selectedItem, onSelectedItemChanged()

  $: highlightedItem =
    filteredListItems &&
    highlightIndex &&
    highlightIndex >= 0 &&
    highlightIndex < filteredListItems.length
      ? filteredListItems[highlightIndex].item
      : null

  $: showList = opened && ((items && items.length > 0) || filteredTextLength > 0)

  $: clearable = showClear || ((lock || multiple) && selectedItem)

  function prepareUserEnteredText(userEnteredText) {
    if (userEnteredText === undefined || userEnteredText === null) {
      return ""
    }

    if (!cleanUserText) {
      return userEnteredText
    }

    const textFiltered = userEnteredText.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ").trim()

    const cleanUserEnteredText = safeStringFunction(textCleanFunction, textFiltered)
    const textFilteredLowerCase = cleanUserEnteredText.toLowerCase().trim()

    return textFilteredLowerCase
  }

  function numberOfMatches(listItem, searchWords) {
    if (!listItem) {
      return 0
    }

    const itemKeywords = listItem.keywords

    let matches = 0
    searchWords.forEach((searchWord) => {
      if (itemKeywords.includes(searchWord)) {
        matches++
      }
    })

    return matches
  }

  async function search() {
    let timerId
    if (debug) {
      timerId = `Autocomplete search ${inputId ? `(id: ${inputId})` : ""}`
      console.time(timerId)
      console.log("Searching user entered text: '" + text + "'")
    }

    let textFiltered = prepareUserEnteredText(text)
    if (minCharactersToSearch > 1 && textFiltered.length < minCharactersToSearch) {
      textFiltered = ""
    }
    filteredTextLength = textFiltered.length

    if (debug) {
      console.log("Changed user entered text '" + text + "' into '" + textFiltered + "'")
    }

    // if no search text load all items
    if (textFiltered === "") {
      if (searchFunction) {
        // we will need to rerun the search
        items = []
        if (debug) {
          console.log("User entered text is empty clear list of items")
        }
      } else {
        filteredListItems = listItems
        if (debug) {
          console.log("User entered text is empty set the list of items to all items")
        }
      }
      closeIfMinCharsToSearchReached()
      if (debug) {
        console.timeEnd(timerId)
      }
      return
    }

    if (!searchFunction) {
      // internal search
      processListItems(textFiltered)
    } else {
      // external search which provides items
      lastRequestId = lastRequestId + 1
      const currentRequestId = lastRequestId
      loading = true

      // searchFunction is a generator
      if (searchFunction.constructor.name === "AsyncGeneratorFunction") {
        for await (const chunk of searchFunction(textFiltered, maxItemsToShowInList)) {
          // a chunk of an old response: throw it away
          if (currentRequestId < lastResponseId) {
            return false
          }

          // a chunk for a new response: reset the item list
          if (currentRequestId > lastResponseId) {
            items = []
          }

          lastResponseId = currentRequestId
          items = [...items, ...chunk]
          processListItems(textFiltered)
        }

        // there was nothing in the chunk
        if (lastResponseId < currentRequestId) {
          lastResponseId = currentRequestId
          items = []
          processListItems(textFiltered)
        }
      }

      // searchFunction is a regular function
      else {
        let result = await searchFunction(textFiltered, maxItemsToShowInList)

        // If a response to a newer request has been received
        // while responses to this request were being loaded,
        // then we can just throw away this outdated results.
        if (currentRequestId < lastResponseId) {
          return false
        }

        lastResponseId = currentRequestId
        items = result
        processListItems(textFiltered)
      }

      loading = false
    }

    if (debug) {
      console.timeEnd(timerId)
      console.log("Search found " + filteredListItems.length + " items")
    }
  }

  function defaultItemFilterFunction(listItem, searchWords) {
    const matches = numberOfMatches(listItem, searchWords)
    if (matchAllKeywords) {
      return matches >= searchWords.length
    } else {
      return matches > 0
    }
  }

  function defaultItemSortFunction(obj1, obj2, searchWords) {
    return numberOfMatches(obj2, searchWords) - numberOfMatches(obj1, searchWords)
  }

  function processListItems(textFiltered) {
    // cleans, filters, orders, and highlights the list items
    prepareListItems()

    const textFilteredWithoutAccents = ignoreAccents ? removeAccents(textFiltered) : textFiltered
    const searchWords = textFilteredWithoutAccents.split(/\s+/g).filter(word => word !== "");

    // local search
    let tempfilteredListItems
    if (localFiltering) {
      if (itemFilterFunction) {
        tempfilteredListItems = listItems.filter((item) =>
          itemFilterFunction(item.item, searchWords)
        )
      } else {
        tempfilteredListItems = listItems.filter((item) =>
          defaultItemFilterFunction(item, searchWords)
        )
      }

      if (localSorting) {
        if (itemSortFunction) {
          tempfilteredListItems = tempfilteredListItems.sort((item1, item2) =>
            itemSortFunction(item1.item, item2.item, searchWords)
          )
        } else {
          if (sortByMatchedKeywords) {
            tempfilteredListItems = tempfilteredListItems.sort((item1, item2) =>
              defaultItemSortFunction(item1, item2, searchWords)
            )
          }
        }
      }
    } else {
      tempfilteredListItems = listItems
    }

    const hlfilter = highlightFilter(searchWords, "label")
    filteredListItems = tempfilteredListItems.map(hlfilter)
    closeIfMinCharsToSearchReached()
    return true
  }

  // $: text, search();

  function afterCreate(createdItem) {
    let listItem
    if (debug) {
      console.log("createdItem", createdItem)
    }
    if ("undefined" !== typeof createdItem) {
      prepareListItems()
      filteredListItems = listItems
      let index = findItemIndex(createdItem, filteredListItems)

      // if the items array was not updated, add the created item manually
      if (index <= 0) {
        items = [createdItem]
        prepareListItems()
        filteredListItems = listItems
        index = 0
      }

      if (index >= 0) {
        highlightIndex = index
        listItem = filteredListItems[highlightIndex]
      }
    }
    return listItem
  }

  function selectListItem(listItem) {
    if (debug) {
      console.log("selectListItem", listItem)
    }
    if ("undefined" === typeof listItem && create) {
      // allow undefined items if create is enabled
      const createdItem = onCreate(text)
      if ("undefined" !== typeof createdItem) {
        if (typeof createdItem.then === "function") {
          createdItem.then((newItem) => {
            if ("undefined" !== typeof newItem) {
              const newListItem = afterCreate(newItem)
              if ("undefined" !== typeof newListItem) {
                selectListItem(newListItem)
              }
            }
          })
          return true
        } else {
          listItem = afterCreate(createdItem)
        }
      }
    }

    if ("undefined" === typeof listItem) {
      if (debug) {
        console.log(`listItem is undefined. Can not select.`)
      }
      return false
    }

    if (lock && selectedItem) {
      return true
    }

    const newSelectedItem = listItem.item
    if (beforeChange(selectedItem, newSelectedItem)) {
      // simple selection
      if (!multiple) {
        selectedItem = undefined // triggers change even if the the same item is selected
        selectedItem = newSelectedItem
      }
      // first selection of multiple ones
      else if (!selectedItem) {
        selectedItem = [newSelectedItem]
      }
      // selecting something already selected => unselect it
      else if (selectedItem.includes(newSelectedItem)) {
        selectedItem = selectedItem.filter((i) => i !== newSelectedItem)
      }
      // adds the element to the selection
      else {
        selectedItem = [...selectedItem, newSelectedItem]
      }
    }
    return true
  }

  function selectItem() {
    if (debug) {
      console.log("selectItem", highlightIndex)
    }
    const listItem = filteredListItems[highlightIndex]
    if (selectListItem(listItem)) {
      if (debug) {
        console.log("selectListItem true, closing")
      }
      close()
      if (multiple) {
        input.focus()
      }
    } else {
      if (debug) {
        console.log("selectListItem false, not closing")
      }
    }
  }

  function up() {
    if (debug) {
      console.log("up")
    }

    open()
    if (highlightIndex > 0) {
      highlightIndex--
    }

    highlight()
  }

  function down() {
    if (debug) {
      console.log("down")
    }

    open()
    if (highlightIndex < filteredListItems.length - 1) {
      highlightIndex++
    }

    highlight()
  }

  function highlight() {
    if (debug) {
      console.log("highlight")
    }

    const query = ".selected"
    if (debug) {
      console.log("Seaching DOM element: " + query + " in " + list)
    }

    /**
     * @param {Element} el
     */
    const el = list && list.querySelector(query)
    if (el) {
      if (typeof el.scrollIntoViewIfNeeded === "function") {
        if (debug) {
          console.log("Scrolling selected item into view")
        }
        el.scrollIntoViewIfNeeded()
      } else if (el.scrollIntoView === "function") {
        if (debug) {
          console.log("Scrolling selected item into view")
        }
        el.scrollIntoView()
      } else {
        if (debug) {
          console.warn(
            "Could not scroll selected item into view, scrollIntoViewIfNeeded not supported"
          )
        }
      }
    } else {
      if (debug) {
        console.warn("Selected item not found to scroll into view")
      }
    }
  }

  function onListItemClick(listItem) {
    if (debug) {
      console.log("onListItemClick")
    }

    if (selectListItem(listItem)) {
      close()
      if (multiple) {
        input.focus()
      }
    }
  }

  function onDocumentClick(e) {
    if (debug) {
      console.log("onDocumentClick")
    }
    if (e.composedPath().some((path) => path.classList && path.classList.contains(uniqueId))) {
      if (debug) {
        console.log("onDocumentClick inside")
      }
      // resetListToAllItemsAndOpen();
      highlight()
    } else {
      if (debug) {
        console.log("onDocumentClick outside")
      }
      close()
    }
  }

  function onKeyDown(e) {
    if (debug) {
      console.log("onKeyDown")
    }

    let key = e.key
    if (key === "Tab" && e.shiftKey) key = "ShiftTab"
    const fnmap = {
      Tab: opened ? close() : null,
      ShiftTab: opened ? close() : null,
      ArrowDown: down.bind(this),
      ArrowUp: up.bind(this),
      Escape: onEsc.bind(this),
      Backspace:
        multiple && selectedItem && selectedItem.length && !text ? onBackspace.bind(this) : null,
    }
    const fn = fnmap[key]
    if (typeof fn === "function") {
      fn(e)
    }
  }

  function onKeyPress(e) {
    if (debug) {
      console.log("onKeyPress")
    }

    if (e.key === "Enter") {
      e.preventDefault()
      onEnter()
    }
  }

  function onEnter() {
    selectItem()
  }

  function onInput(e) {
    if (debug) {
      console.log("onInput")
    }

    text = e.target.value
    if (inputDelayTimeout) {
      clearTimeout(inputDelayTimeout)
    }

    if (delay) {
      inputDelayTimeout = setTimeout(processInput, delay)
    } else {
      processInput()
    }
  }

  function unselectItem(tag) {
    if (debug) {
      console.log("unselectItem", tag)
    }
    selectedItem = selectedItem.filter((i) => i !== tag)
    input.focus()
  }

  function processInput() {
    if (search()) {
      highlightIndex = 0
      open()
    }
  }

  function onInputClick() {
    if (debug) {
      console.log("onInputClick")
    }
    resetListToAllItemsAndOpen()
  }

  function onEsc(e) {
    if (debug) {
      console.log("onEsc")
    }

    //if (text) return clear();
    e.stopPropagation()
    if (opened) {
      input.focus()
      close()
    }
  }

  function onBackspace(e) {
    if (debug) {
      console.log("onBackspace")
    }

    unselectItem(selectedItem[selectedItem.length - 1])
  }

  function onFocusInternal() {
    if (debug) {
      console.log("onFocus")
    }

    onFocus()

    resetListToAllItemsAndOpen()
  }

  function onBlurInternal() {
    if (debug) {
      console.log("onBlur")
    }

    if (closeOnBlur) {
      close()
    }

    onBlur()
  }

  function resetListToAllItemsAndOpen() {
    if (debug) {
      console.log("resetListToAllItemsAndOpen")
    }

    if (!text) {
      filteredListItems = listItems
    }

    // When an async component is initialized, the item list
    // must be loaded when the input is focused.
    else if (!listItems.length && selectedItem && searchFunction) {
      search()
    }

    open()

    // find selected item
    if (selectedItem) {
      if (debug) {
        console.log("Searching currently selected item: " + JSON.stringify(selectedItem))
      }

      const index = findItemIndex(selectedItem, filteredListItems)
      if (index >= 0) {
        highlightIndex = index
        highlight()
      }
    }
  }

  function findItemIndex(item, items) {
    if (debug) {
      console.log("Finding index for item", item)
    }
    let index = -1
    for (let i = 0; i < items.length; i++) {
      const listItem = items[i]
      if ("undefined" === typeof listItem) {
        if (debug) {
          console.log(`listItem ${i} is undefined. Skipping.`)
        }
        continue
      }
      if (debug) {
        console.log("Item " + i + ": " + JSON.stringify(listItem))
      }
      if (item === listItem.item) {
        index = i
        break
      }
    }

    if (debug) {
      if (index >= 0) {
        console.log("Found index for item: " + index)
      } else {
        console.warn("Not found index for item: " + item)
      }
    }
    return index
  }

  function open() {
    if (debug) {
      console.log("open")
    }

    // check if the search text has more than the min chars required
    if (notEnoughSearchText()) {
      return
    }

    opened = true
  }

  function close() {
    if (debug) {
      console.log("close")
    }
    opened = false
    loading = false

    if (!text && selectFirstIfEmpty) {
      highlightIndex = 0
      selectItem()
    }
  }

  function notEnoughSearchText() {
    return minCharactersToSearch > 1 && filteredTextLength < minCharactersToSearch
  }

  function closeIfMinCharsToSearchReached() {
    if (notEnoughSearchText()) {
      close()
    }
  }

  function clear() {
    if (debug) {
      console.log("clear")
    }

    text = ""
    selectedItem = multiple ? [] : undefined

    setTimeout(() => {
      input.focus()
      close()
    })
  }

  export function highlightFilter(keywords, field) {
    return (item) => {
      let label = item[field]

      const newItem = Object.assign({ highlighted: undefined }, item)
      newItem.highlighted = label

      const labelLowercase = label.toLowerCase()
      const labelLowercaseNoAc = ignoreAccents ? removeAccents(labelLowercase) : labelLowercase

      if (keywords && keywords.length) {
        const positions = []

        for (let i = 0; i < keywords.length; i++) {
          let keyword = keywords[i]
          if (ignoreAccents) {
            keyword = removeAccents(keyword)
          }
          const keywordLen = keyword.length

          let pos1 = 0
          do {
            pos1 = labelLowercaseNoAc.indexOf(keyword, pos1)
            if (pos1 >= 0) {
              let pos2 = pos1 + keywordLen
              positions.push([pos1, pos2])
              pos1 = pos2
            }
          } while (pos1 !== -1)
        }

        if (positions.length > 0) {
          const keywordPatterns = new Set()
          for (let i = 0; i < positions.length; i++) {
            const pair = positions[i]
            const pos1 = pair[0]
            const pos2 = pair[1]

            const keywordPattern = labelLowercase.substring(pos1, pos2)
            keywordPatterns.add(keywordPattern)
          }
          for (let keywordPattern of keywordPatterns) {
            // FIXME pst: workarond for wrong replacement <b> tags
            if (keywordPattern === "b") {
              continue
            }
            const reg = new RegExp("(" + keywordPattern + ")", "ig")

            const newHighlighted = newItem.highlighted.replace(reg, "<b>$1</b>")
            newItem.highlighted = newHighlighted
          }
        }
      }

      return newItem
    }
  }

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  function isConfirmed(listItem) {
    if (!selectedItem) {
      return false
    }
    if (multiple) {
      return selectedItem.includes(listItem)
    } else {
      return listItem === selectedItem
    }
  }
</script>

<div
  class="{className ? className : ''}
  {hideArrow || !items.length ? 'hide-arrow' : ''}
  {multiple ? 'is-multiple' : ''} autocomplete select is-fullwidth {uniqueId}"
  class:show-clear={clearable}
  class:is-loading={showLoadingIndicator && loading}
>
  <select name={selectName} id={selectId} {multiple}>
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
        <slot name="tag" label={safeLabelFunction(tagItem)} item={tagItem} {unselectItem}>
          <div class="tags has-addons">
            <span class="tag">{safeLabelFunction(tagItem)}</span>
            <span class="tag is-delete" on:click|preventDefault={unselectItem(tagItem)} />
          </div>
        </slot>
      {/each}
    {/if}
    <input
      type="text"
      class="{inputClassName ? inputClassName : ''} {noInputStyles
        ? ''
        : 'input autocomplete-input'}"
      id={inputId ? inputId : ""}
      autocomplete={html5autocomplete ? "on" : "off"}
      {placeholder}
      {name}
      {disabled}
      {required}
      {title}
      readonly={readonly || (lock && selectedItem)}
      {tabindex}
      bind:this={input}
      bind:value={text}
      on:input={onInput}
      on:focus={onFocusInternal}
      on:blur={onBlurInternal}
      on:keydown={onKeyDown}
      on:click={onInputClick}
      on:keypress={onKeyPress}
    />
    {#if clearable}
      <span on:click={clear} class="autocomplete-clear-button">&#10006;</span>
    {/if}
  </div>
  <div
    class="{dropdownClassName ? dropdownClassName : ''} autocomplete-list {showList ? '' : 'hidden'}
    is-fullwidth"
    bind:this={list}
  >
    {#if filteredListItems && filteredListItems.length > 0}
      {#each filteredListItems as listItem, i}
        {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}
          <div
            class="autocomplete-list-item {i === highlightIndex ? 'selected' : ''}"
            class:confirmed={isConfirmed(listItem.item)}
            on:click={() => onListItemClick(listItem)}
            on:pointerenter={() => {
              highlightIndex = i
            }}
          >
            <slot
              name="item"
              item={listItem.item}
              label={listItem.highlighted ? listItem.highlighted : listItem.label}
            >
              {#if listItem.highlighted}
                {@html listItem.highlighted}
              {:else}
                {@html listItem.label}
              {/if}
            </slot>
          </div>
        {/if}
      {/each}

      {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}
        {#if moreItemsText}
          <div class="autocomplete-list-item-no-results">
            ...{filteredListItems.length - maxItemsToShowInList}
            {moreItemsText}
          </div>
        {/if}
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
    border: 3px solid;
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
