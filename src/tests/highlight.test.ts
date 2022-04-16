import { render } from "@testing-library/svelte"
import SimpleAutocomplete from "../SimpleAutocomplete.svelte"

test("test simple hightlights", async () => {
  const { component } = render(SimpleAutocomplete)
  var item = {
    label: "foobar",
  }
  const result = component.highlightFilter(["foo"], "label")(item).highlighted
  expect(result).toStrictEqual("<b>foo</b>bar")
})

test("test accented words highlights", async () => {
  const { component } = render(SimpleAutocomplete)
  var item = {
    label: "foobär",
  }
  const result = component.highlightFilter(["föobar"], "label")(item).highlighted
  expect(result).toStrictEqual("<b>foobär</b>")
})
