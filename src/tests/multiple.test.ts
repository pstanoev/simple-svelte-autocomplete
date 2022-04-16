import { render, fireEvent, screen } from "@testing-library/svelte"
import SimpleAutocomplete from "../SimpleAutocomplete.svelte"
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'

const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"]

test("when selection is multiple, selectedItem is a list", async () => {
  const { component, container } = render(SimpleAutocomplete, {items: colors, multiple: true})
  const queryInput = container.querySelector("input[type='text']");

  expect(component.selectedItem).toStrictEqual([])

  await fireEvent.input(queryInput, { target: { value: "white" } })
  await fireEvent.click(await screen.queryByText('White'))

  expect(component.selectedItem).toStrictEqual(["White"])

  await fireEvent.input(queryInput, { target: { value: "Red" } })
  await fireEvent.click(await screen.queryByText('Red'))

  expect(component.selectedItem).toStrictEqual(["White", "Red"])
})
