import { render } from '@testing-library/svelte'
import SimpleAutocomplete from "./SimpleAutocomplete.svelte"

test('test simple hightlights', async () => {
    const { component } = render(SimpleAutocomplete)
    var item = {
        keywords: "foobar"
    }
    const result = component.highlightFilter("foo", ["keywords"])(item).highlighted.keywords
    expect(result).toStrictEqual("<b>foo</b>bar")
})

test('test accented words highlights', async () => {
    const { component } = render(SimpleAutocomplete)
    var item = {
        keywords: "foobär"
    }
    const result = component.highlightFilter("föobar", ["keywords"])(item).highlighted.keywords
    expect(result).toStrictEqual("<b>foobär</b>")
})
