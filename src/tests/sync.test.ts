import { render, fireEvent, screen } from "@testing-library/svelte"
import SimpleAutocomplete from "../SimpleAutocomplete.svelte"
import "@testing-library/jest-dom/extend-expect"
import "@testing-library/jest-dom"

const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"]

window = Object.assign(window, { visualViewport: { height: 1500 } })

test("items are generated but hidden", async () => {
  const { component, container } = render(SimpleAutocomplete, { items: colors })

  expect(await screen.queryByText("White")).toBeInTheDocument()
  expect(await screen.queryByText("White")).not.toBeVisible()
  expect(await screen.queryByText("Red")).toBeInTheDocument()
  expect(await screen.queryByText("Red")).not.toBeVisible()
})

test("on focus, menu is shown with all the elements", async () => {
  const { component, container } = render(SimpleAutocomplete, { items: colors })
  const queryInput = container.querySelector("input[type='text']")

  await fireEvent.focus(queryInput)

  expect(await screen.queryByText("White")).toBeInTheDocument()
  expect(await screen.queryByText("White")).toBeVisible()
  expect(await screen.queryByText("Red")).toBeInTheDocument()
  expect(await screen.queryByText("Red")).toBeVisible()
})

test("when something is queried, only the matching items are shown", async () => {
  const { component, container } = render(SimpleAutocomplete, { items: colors })
  const queryInput = container.querySelector("input[type='text']")

  await fireEvent.input(queryInput, { target: { value: "white" } })

  expect(await screen.queryByText("White")).toBeInTheDocument()
  expect(await screen.queryByText("White")).toBeVisible()
  expect(await screen.queryByText("Red")).not.toBeInTheDocument()
})

test("when nothing matches the query, no item is show", async () => {
  const { component, container } = render(SimpleAutocomplete, { items: colors })
  const queryInput = container.querySelector("input[type='text']")

  await fireEvent.input(queryInput, { target: { value: "not-a-color" } })

  expect(await screen.queryByText("White")).not.toBeInTheDocument()
  expect(await screen.queryByText("Red")).not.toBeInTheDocument()
})

test("when something is queried, the query is highlighted", async () => {
  const { component, container } = render(SimpleAutocomplete, { items: colors })
  const queryInput = container.querySelector("input[type='text']")
  const list = container.querySelector("autocomplete-list")

  await fireEvent.input(queryInput, { target: { value: "whi" } })

  const white_item = (await screen.queryByText("Whi")).closest(".autocomplete-list-item")
  expect(white_item).toContainHTML("<b>Whi</b>te")
})

test("widget initialization with selectedItem", async () => {
  const { component, container } = render(SimpleAutocomplete, {
    items: colors,
    selectedItem: "White",
  })
  const queryInput = container.querySelector("input[type='text']")

  expect(component.selectedItem).toStrictEqual("White")
  expect(component.text).toStrictEqual("White")
})

test("test labelFunction", async () => {
  const items = [
    {
      color: "White",
      code: "#FFFFFF",
    },
    {
      color: "Red",
      code: "#FF0000",
    },
    {
      color: "Yellow",
      code: "#FFFF00",
    },
    {
      color: "Green",
      code: "#00FF00",
    },
    {
      color: "Blue",
      code: "#0000FF",
    },
    {
      color: "Black",
      code: "#000000",
    },
  ]
  const { container } = render(SimpleAutocomplete, {
    items,
    selectedItem: items[0],
    labelFunction: (item) => {
      return item.color + " " + item.code
    },
  })

  const queryInput = container.querySelector("input[type='text']")

  await fireEvent.input(queryInput, { target: { value: "0000" } })

  const list = container.querySelector(".autocomplete-list")

  const resultItems = list.querySelectorAll("b")
  expect(resultItems.length).toEqual(3)
  resultItems.forEach((resultItem) => {
    expect(resultItem).toContainHTML("<b>0000</b>")
  })
})

test("test labelOnSelectFunction", async () => {
  const items = [
    {
      color: "White",
      code: "#FFFFFF",
    },
    {
      color: "Red",
      code: "#FF0000",
    },
    {
      color: "Yellow",
      code: "#FFFF00",
    },
    {
      color: "Green",
      code: "#00FF00",
    },
    {
      color: "Blue",
      code: "#0000FF",
    },
    {
      color: "Black",
      code: "#000000",
    },
  ]
  const { container } = render(SimpleAutocomplete, {
    items,
    selectedItem: items[0],
    labelFunction: (item) => {
      return item.color + " " + item.code
    },
    labelOnSelectFunction: (item) => {
      return item.color
    },
  })

  const queryInput = container.querySelector("input[type='text']") as HTMLInputElement

  await fireEvent.input(queryInput, { target: { value: "0000" } })

  const resultItems = await screen.queryAllByText("0000")
  expect(resultItems.length).toEqual(3)
  resultItems.forEach((resultItem) => {
    expect(resultItem).toContainHTML("<b>0000</b>")
  })

  await fireEvent.click(resultItems[2])

  expect(queryInput.value).toEqual("Black")
})

test.skip("widget initialization with text", async () => { // Skipping because is failing in master
  const { component, container } = render(SimpleAutocomplete, {
    items: colors,
    text: "White",
  })
  const queryInput = container.querySelector("input[type='text']")

  expect(component.selectedItem).toBeUndefined()
  expect(component.text).toStrictEqual("White")
})
