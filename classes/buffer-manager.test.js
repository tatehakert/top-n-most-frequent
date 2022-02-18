const BufferManager = require('./buffer-manager');

test('successfully splits words into an array', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("word1 word2 word3 word4 ", "utf-8")
    expect(buffManager.getWordsFromBufferData(buffer1)).toEqual(["word1","word2","word3","word4", ""])
})

test('successfully splits words into an array', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("word1 word2  word3   word4  ", "utf-8")
    expect(buffManager.getWordsFromBufferData(buffer1)).toEqual(["word1","word2", "", "word3", "", "", "word4", "", ""])
})

test('successfully get words from sequential chunks of buffer data (with overflow) (space delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("I'm a string that isn't finis", "utf-8")
    const buffer2 = Buffer.from("hed yet! Now it is.", "utf-8")
    expect(buffManager.getWordsFromBufferData(buffer1)).toEqual(["I'm", "a", "string", "that", "isn't"])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual(["", "finis"])

    //second call to getStringFromBufferData should prepend the previous overflow and remove new overflow
    expect(buffManager.getWordsFromBufferData(buffer2)).toEqual(["", "finished", "yet!", "Now", "it",])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual(["","is."])
    
})

test('successfully get strings from sequential chunks of buffer data (with overflow) (newLine delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("hi\nMom", "utf-8")
    const buffer2 = Buffer.from(" its me", "utf-8")
    
    expect(buffManager.findLastDelimiterIndex(buffer1)).toEqual(2)
    expect(buffManager.getWordsFromBufferData(buffer1)).toEqual(["hi"])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual(["", "Mom"])

    //second call to getStringFromBufferData should prepend the previous overflow and remove new overflow
    expect(buffManager.getWordsFromBufferData(buffer2)).toEqual(["", "Mom", "its"])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual(["", "me"])
    
})

test('successfully get strings from sequential chunks of buffer data (without overflow) (space delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("I'm a string that is finished! ", "utf-8")
    const buffer2 = Buffer.from("Here's another string", "utf-8")
    expect(buffManager.getWordsFromBufferData(buffer1)).toEqual(["I'm", "a", "string", "that", "is", "finished!", ""])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual([""])

    expect(buffManager.getWordsFromBufferData(buffer2)).toEqual(["Here's", "another"])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual(["", "string"])
})

test('successfully get strings from sequential chunks of buffer data (without overflow) (newLine delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("I'm a string that is finished!\n", "utf-8")
    const buffer2 = Buffer.from("Here's another string", "utf-8")
    expect(buffManager.getWordsFromBufferData(buffer1)).toEqual(["I'm", "a", "string", "that", "is", "finished!", ""])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual([""])

    expect(buffManager.getWordsFromBufferData(buffer2)).toEqual(["Here's", "another"])
    expect(buffManager.getWordsFromOverflowBuffer()).toEqual(["", "string"])
})
