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
</script>

<svelte:head>
  {@html solarized}
</svelte:head>

<section class="section">
    <div class="container content">
        <h1>Svelte Simple Autocomplete Demo</h1>

        <p>
            Github:
            <a href="https://github.com/pstanoev/simple-svelte-autocomplete">
                https://github.com/pstanoev/simple-svelte-autocomplete
            </a>
        </p>

        <SimpleExample />
        <LockedExample />
        <AdvancedExample />
        <MultipleExample />
        <CustomizationExample />
        <ActivityIndicatorExample />
        <AsyncExample />
        <MatchingStrategyExample />
        <AsyncGeneratorExample />
    </div>
</section>
