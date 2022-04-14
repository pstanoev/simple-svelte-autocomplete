<script>
  import solarized from "svelte-highlight/styles/solarized-light"

  import { onMount } from "svelte"

  import AutoComplete from "./SimpleAutocomplete.svelte"

  import SimpleExample from "./demo/SimpleExample.svelte"
  import AdvancedExample from "./demo/AdvancedExample.svelte"
  import LockedExample from "./demo/LockedExample.svelte"
  import MultipleExample from "./demo/MultipleExample.svelte"
  import CustomizationExample from "./demo/CustomizationExample.svelte"
  import ActivityIndicatorExample from "./demo/ActivityIndicatorExample.svelte"
  import AsyncExample from "./demo/AsyncExample.svelte"
  import MatchingStrategyExample from "./demo/MatchingStrategyExample.svelte"
  import AsyncGeneratorExample from "./demo/AsyncGeneratorExample.svelte"
  import AsyncPreloadedExample from "./demo/AsyncPreloadedExample.svelte"
  import CreatableExample from "./demo/CreatableExample.svelte"
  import CustomFunctionsExample from "./demo/CustomFunctionsExample.svelte"
  import RequiredExample from "./demo/RequiredExample.svelte"

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
  {#if bulma}
    <link rel="stylesheet" href="bulma.css" />
  {:else}
    <link rel="stylesheet" href="default.css" />
  {/if}
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
        <li
          id="simpleTab"
          on:click={(e) => showTab(e.target.parentElement, "simple")}
          class="tab"
        >
          <a href={"#simple"}>Basic usage</a>
        </li>
        <li
          id="customizationTab"
          on:click={(e) => showTab(e.target.parentElement, "customization")}
          class="tab"
        >
          <a href={"#customization"}>Customization</a>
        </li>
        <li
          id="asyncTab"
          on:click={(e) => showTab(e.target.parentElement, "async")}
          class="tab"
        >
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
