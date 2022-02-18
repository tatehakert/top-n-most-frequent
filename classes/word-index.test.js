const WordIndex = require('./word-index');

test("successfully adds a new unique word to the index", () => {
    let wi = new WordIndex()
    let word = "testing"

    expect(wi.uniqueWordCount).toEqual(0)
    wi.addWordToIndex(word)
    expect(wi.dict[word]).toEqual(1)
    expect(wi.uniqueWordCount).toEqual(1)
})

test("successfully increments an existing word in the index", () => {
    let wi = new WordIndex()
    let word = "testing"
    wi.addWordToIndex(word)
    wi.addWordToIndex(word)
    expect(wi.dict[word]).toEqual(2)
    expect(wi.uniqueWordCount).toEqual(1)
})