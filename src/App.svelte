<script>
  import solarized from "svelte-highlight/src/styles/solarized-light";

  import { onMount } from "svelte";

  import AutoComplete from "./SimpleAutocomplete.svelte";

  import SimpleExample from "./demo/SimpleExample.svelte";
  import AdvancedExample from "./demo/AdvancedExample.svelte";
  import LockedExample from "./demo/LockedExample.svelte";
  import MultipleExample from "./demo/MultipleExample.svelte";
  import CustomizationExample from "./demo/CustomizationExample.svelte";
  import ActivityIndicatorExample from "./demo/ActivityIndicatorExample.svelte";
  import AsyncExample from "./demo/AsyncExample.svelte";
  import MatchingStrategyExample from "./demo/MatchingStrategyExample.svelte";
  import AsyncGeneratorExample from "./demo/AsyncGeneratorExample.svelte";
  import AsyncPreloadedExample from "./demo/AsyncPreloadedExample.svelte";
  import CreatableExample from "./demo/CreatableExample.svelte";
  import CustomFunctionsExample from "./demo/CustomFunctionsExample.svelte";

  function showTab(e, tab) {
    console.log("Show tab", e, tab);
    for (let el of document.getElementsByClassName("tab")) {
      el.classList.remove("is-active");
    }
    if (e) {
      e.classList.add("is-active");
    }

    for (let el of document.getElementsByClassName("tab-content")) {
      el.classList.add("is-hidden");
    }
    for (let el of document.getElementsByClassName(tab)) {
      el.classList.remove("is-hidden");
    }
  }
  onMount(() => {
    console.log("on mount");
    const simpleTab = document.getElementById("simpleTab");
    showTab(simpleTab, "simple");
  });
</script>

<svelte:head>
  {@html solarized}
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

    <div class="tabs is-centered">
      <ul class="ml-0">
        <li
          id="simpleTab"
          on:click={e => showTab(e.target.parentElement, 'simple')}
          class="tab is-active">
          <a>Basic usage</a>
        </li>
        <li
          on:click={e => showTab(e.target.parentElement, 'customization')}
          class="tab">
          <a>Customization</a>
        </li>
        <li
          on:click={e => showTab(e.target.parentElement, 'async')}
          class="tab">
          <a>Async</a>
        </li>
        <li
          on:click={e => showTab(e.target.parentElement, 'advanced')}
          class="tab">
          <a>Advanced usage</a>
        </li>
      </ul>
    </div>

    <div class="tab-content simple">
      <SimpleExample />
      <AdvancedExample />
      <MultipleExample />

      <LockedExample />
    </div>

    <div class="tab-content customization">
      <CustomizationExample />
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
