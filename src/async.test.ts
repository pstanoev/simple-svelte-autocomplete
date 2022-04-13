import { render, fireEvent, screen } from "@testing-library/svelte"
import SimpleAutocomplete from "./SimpleAutocomplete.svelte"
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'

async function colors(keyword, nb_items_max) {
    return ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"]
}

test("at first, menu is empty", async () => {
  const { component, container } = render(SimpleAutocomplete, {searchFunction: colors})

  expect(await screen.queryByText('White')).not.toBeInTheDocument()
  expect(await screen.queryByText('Red')).not.toBeInTheDocument()
})

test("even with the input is focused, the menu is empty", async () => {
  const { component, container } = render(SimpleAutocomplete, {searchFunction: colors})
  const queryInput = container.querySelector("input[type='text']");

  await fireEvent.focus(queryInput)

  expect(await screen.queryByText('White')).not.toBeInTheDocument()
  expect(await screen.queryByText('Red')).not.toBeInTheDocument()
})
