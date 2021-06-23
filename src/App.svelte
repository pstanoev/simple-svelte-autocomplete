<script>
import solarized from "svelte-highlight/src/styles/solarized-light";

import AutoComplete from "./SimpleAutocomplete.svelte";

import SimpleExample from "./SimpleExample.svelte";
import AdvancedExample from "./AdvancedExample.svelte";
import LockedExample from "./LockedExample.svelte";
import MultipleExample from "./MultipleExample.svelte";
import CustomizationExample from "./CustomizationExample.svelte";
import ActivityIndicatorExample from "./ActivityIndicatorExample.svelte";
import AsyncExample from "./AsyncExample.svelte";
import MatchingStrategyExample from "./MatchingStrategyExample.svelte";
import AsyncGeneratorExample from "./AsyncGeneratorExample.svelte";
import AsyncPreloadedExample from "./AsyncPreloadedExample.svelte";

function showTab(e, tab) {
    for(let el of document.getElementsByClassName("tab")) {
        el.classList.remove("is-active");
    }
    e.target.parentElement.classList.add("is-active");

    for(let el of document.getElementsByClassName("tab-content")) {
        el.classList.remove('is-active');
    }
    for(let el of document.getElementsByClassName(tab)) {
        el.classList.add('is-active');
    }
}

</script>

<svelte:head>
  {@html solarized}
</svelte:head>

<style>
    .tab-content{
        display:none;
    }
    .tab-content.is-active{
        display:block;
    }
    h1.title a{
        float: right;
    }
</style>

<section class="section">
    <div class="container content">
        <h1 class="title">
            <a href="https://github.com/pstanoev/simple-svelte-autocomplete" class="icon">
                <i class="fab fa-github"></i>
            </a>
            Svelte Simple Autocomplete Demo
        </h1>

        <div class="tabs is-centered">
            <ul>
                <li on:click={e => showTab(e, "simple")} class="tab is-active"><a>Basic usage</a></li>
                <li on:click={e => showTab(e, "customization")} class="tab"><a>Customization</a></li>
                <li on:click={e => showTab(e, "async")} class="tab"><a>Async</a></li>
                <li on:click={e => showTab(e, "advanced")} class="tab"><a>Advanced usage</a></li>
            </ul>
        </div>

        <div class="tab-content simple is-active">
            <SimpleExample />
            <LockedExample />
            <AdvancedExample />
            <MultipleExample />
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
        </div>
    </div>
</section>
