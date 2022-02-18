const BufferManager = require('./buffer-manager');


test('successfully get strings from sequential chunks of buffer data (with overflow) (space delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("I'm a string that isn't finis", "utf-8")
    const buffer2 = Buffer.from("hed yet! Now it is.", "utf-8")
    expect(buffManager.getStringFromBufferData(buffer1)).toEqual("I'm a string that isn't")
    expect(buffManager.getOverflowString()).toEqual(" finis")

    //second call to getStringFromBufferData should prepend the previous overflow and remove new overflow
    expect(buffManager.getStringFromBufferData(buffer2)).toEqual(" finished yet! Now it", "utf-8")
    expect(buffManager.getOverflowString()).toEqual(" is.")
    
})

test('successfully get strings from sequential chunks of buffer data (with overflow) (newLine delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("hi\nMom", "utf-8")
    const buffer2 = Buffer.from(" its me", "utf-8")
    
    expect(buffManager.findLastDelimiterIndex(buffer1)).toEqual(2)
    expect(buffManager.getStringFromBufferData(buffer1)).toEqual("hi")
    expect(buffManager.getOverflowString()).toEqual("\nMom")

    //second call to getStringFromBufferData should prepend the previous overflow and remove new overflow
    expect(buffManager.getStringFromBufferData(buffer2)).toEqual("\nMom its", "utf-8")
    expect(buffManager.getOverflowString()).toEqual(" me")
    
})

test('successfully get strings from sequential chunks of buffer data (without overflow) (space delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("I'm a string that is finished! ", "utf-8")
    const buffer2 = Buffer.from("Here's another string", "utf-8")
    expect(buffManager.getStringFromBufferData(buffer1)).toEqual("I'm a string that is finished! ")
    expect(buffManager.getOverflowString()).toEqual("")

    expect(buffManager.getStringFromBufferData(buffer2)).toEqual("Here's another", "utf-8")
    expect(buffManager.getOverflowString()).toEqual(" string")
})

test('successfully get strings from sequential chunks of buffer data (without overflow) (newLine delimiter)', () => {
    const buffManager = new BufferManager()

    const buffer1 = Buffer.from("I'm a string that is finished!\n", "utf-8")
    const buffer2 = Buffer.from("Here's another string", "utf-8")
    expect(buffManager.getStringFromBufferData(buffer1)).toEqual("I'm a string that is finished!\n")
    expect(buffManager.getOverflowString()).toEqual("")

    expect(buffManager.getStringFromBufferData(buffer2)).toEqual("Here's another", "utf-8")
    expect(buffManager.getOverflowString()).toEqual(" string")
})