import {fireEvent, render} from "@testing-library/svelte"
import SimpleAutocomplete from "./SimpleAutocomplete.svelte"

const items1 = ['burger', 'salad', 'kebab']
const items2 = ['tea', 'coffee', 'energy drink']

test('test displayed list after initial rendering', async () => {
    const {component} = render(SimpleAutocomplete, {items:items1})
    const displayedList = component.getDisplayedListClone().map(item => item.keywords)
    expect(displayedList).toEqual(expect.arrayContaining(items1))
    expect(items1).toEqual(expect.arrayContaining(displayedList))
})

test('test displayed list after simple item selection', async () => {
    const {component} = render(SimpleAutocomplete, {items:items1})
    await component.$set({ item: items1[0] })
    const displayedList = component.getDisplayedListClone().map(item => item.keywords)
    expect(displayedList).toEqual(expect.arrayContaining(items1))
    expect(items1).toEqual(expect.arrayContaining(displayedList))
})

test('test displayed list after updating items, item selection and click', async () => {
    const { component, getByRole } = render(SimpleAutocomplete, {items:items1})
    await component.$set({
        item: items2[0],
        items: items2
    })
    await fireEvent.click(getByRole('textbox'))
    const displayedList = component.getDisplayedListClone().map(item => item.keywords)
    expect(displayedList).toEqual(expect.arrayContaining(items2))
    expect(items2).toEqual(expect.arrayContaining(displayedList))
})
