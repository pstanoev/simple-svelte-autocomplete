<script>
  import solarized from "svelte-highlight/styles/solarized-light"

  import { onMount } from "svelte"

  import AutoComplete from "../src/SimpleAutocomplete.svelte"

  import SimpleExample from "./SimpleExample.svelte"
  import AdvancedExample from "./AdvancedExample.svelte"
  import LockedExample from "./LockedExample.svelte"
  import MultipleExample from "./MultipleExample.svelte"
  import CustomizationExample from "./CustomizationExample.svelte"
  import ActivityIndicatorExample from "./ActivityIndicatorExample.svelte"
  import AsyncExample from "./AsyncExample.svelte"
  import MatchingStrategyExample from "./MatchingStrategyExample.svelte"
  import AsyncGeneratorExample from "./AsyncGeneratorExample.svelte"
  import AsyncPreloadedExample from "./AsyncPreloadedExample.svelte"
  import CreatableExample from "./CreatableExample.svelte"
  import CustomFunctionsExample from "./CustomFunctionsExample.svelte"
  import RequiredExample from "./RequiredExample.svelte"
  import ReadOnlyExample from "./ReadOnlyExample.svelte"

  let bulma = true

  function showTab(e, tab) {
    console.log("Show tab", e, tab)
    for (let el of document.getElementsByClassName("tab")) {
      el.classList.remove("is-active")
    }
    if (e) {
      e.classList.add("is-active")
    }

    for (let el of document.getElementsByClassName("tab-content")) {
      el.classList.add("is-hidden")
    }
    for (let el of document.getElementsByClassName(tab)) {
      el.classList.remove("is-hidden")
    }
  }
  onMount(() => {
    console.log("on mount")
    const startTabName = window.location.hash ? window.location.hash.substring(1) : "simple"
    const startTab = document.getElementById(startTabName + "Tab")
    showTab(startTab, startTabName)
  })
</script>

<svelte:head>
  {@html solarized}
  <link rel="stylesheet" href="{bulma ? 'bulma.css': 'default.css' }" />
</svelte:head>

<section class="section">
  <div class="container content">
    <h1 class="title">Svelte Simple Autocomplete Demo</h1>
    <p>
      <a href="https://github.com/pstanoev/simple-svelte-autocomplete">
        <i class="fab fa-github" />
        https://github.com/pstanoev/simple-svelte-autocomplete
      </a>
    </p>
    <div class="field">
      <input class="is-checkradio" id="bulma" type="checkbox" bind:checked={bulma} />
      <label for="bulma">Bulma</label>
    </div>
    <div class="tabs is-centered">
      <ul class="ml-0">
        <li id="simpleTab" on:click={(e) => showTab(e.target.parentElement, "simple")} class="tab">
          <a href={"#simple"}>Basic usage</a>
        </li>
        <li
          id="customizationTab"
          on:click={(e) => showTab(e.target.parentElement, "customization")}
          class="tab"
        >
          <a href={"#customization"}>Customization</a>
        </li>
        <li id="asyncTab" on:click={(e) => showTab(e.target.parentElement, "async")} class="tab">
          <a href={"#async"}>Async</a>
        </li>
        <li
          id="advancedTab"
          on:click={(e) => showTab(e.target.parentElement, "advanced")}
          class="tab"
        >
          <a href={"#advanced"}>Advanced usage</a>
        </li>
      </ul>
    </div>

    <div class="tab-content simple">
      <SimpleExample />
      <AdvancedExample />
      <MultipleExample />
      <ReadOnlyExample />
      <RequiredExample />
    </div>

    <div class="tab-content customization">
      <CustomizationExample />
      <LockedExample />
    </div>

    <div class="tab-content async">
      <AsyncExample />
      <ActivityIndicatorExample />
      <AsyncGeneratorExample />
      <AsyncPreloadedExample />
    </div>

    <div class="tab-content advanced">
      <MatchingStrategyExample />
      <CreatableExample />
      <CustomFunctionsExample />
    </div>
  </div>
</section>
