import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import svelte from "rollup-plugin-svelte"
import pkg from "./package.json"

export default [
  {
    input: "src/SimpleAutocomplete.svelte",
    output: [
      { file: pkg.module, format: "es" },
      { file: pkg.main, format: "umd", name: "Autocomplete" },
    ],
    plugins: [svelte(), commonjs(), resolve()],
  },
]
