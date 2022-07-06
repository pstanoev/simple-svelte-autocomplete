import { render, fireEvent, screen } from "@testing-library/svelte"
import SimpleAutocomplete from "../SimpleAutocomplete.svelte"
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'

async function colors() {
    return ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"]
}

window = Object.assign(window, { visualViewport: { height: 1500 } })

test("at first, menu is empty", async () => {
  render(SimpleAutocomplete, {searchFunction: colors})

  expect(await screen.queryByText('White')).not.toBeInTheDocument()
  expect(await screen.queryByText('Red')).not.toBeInTheDocument()
})

test("even with the input is focused, the menu is empty", async () => {
  const { container } = render(SimpleAutocomplete, {searchFunction: colors})
  const queryInput = container.querySelector("input[type='text']");

  await fireEvent.focus(queryInput)

  expect(await screen.queryByText('White')).not.toBeInTheDocument()
  expect(await screen.queryByText('Red')).not.toBeInTheDocument()
})

test("when something is queried, only the matching items are shown", async () => {
  const { container } = render(SimpleAutocomplete, {searchFunction: colors})
  const queryInput = container.querySelector("input[type='text']");

  await fireEvent.input(queryInput, { target: { value: "white" } })

  expect(await screen.queryByText('White')).toBeInTheDocument()
  expect(await screen.queryByText('White')).toBeVisible()
  expect(await screen.queryByText('Red')).not.toBeInTheDocument()
})

test("when nothing matches the query, no item is show", async () => {

  const { container } = render(SimpleAutocomplete, {searchFunction: colors})
  const queryInput = container.querySelector("input[type='text']");

  await fireEvent.input(queryInput, { target: { value: "not-a-color" } })

  expect(await screen.queryByText('White')).not.toBeInTheDocument()
  expect(await screen.queryByText('Red')).not.toBeInTheDocument()
})

test("when something is queried, the query is highlighted", async () => {
  const { container } = render(SimpleAutocomplete, {searchFunction: colors})
  const queryInput = container.querySelector("input[type='text']");

  await fireEvent.input(queryInput, { target: { value: "whi" } })

  const white_item = (await screen.queryByText('Whi')).closest(".autocomplete-list-item")
  expect(white_item).toContainHTML('<b>Whi</b>te')
})
