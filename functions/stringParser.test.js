const {replaceNewLines, splitIntoWordArray, formatWord} = require('./stringParser');

test('properly replaces newLine characters', () => {
    const string = "hello\nworld! its nice to see\n you";
    expect(replaceNewLines(string)).toEqual("hello world! its nice to see  you")
})

//All newline characters must be removed before splitting 
test('properly splits into word array', () => {
    const string1 = "hello world! its nice to see you";
    expect(splitIntoWordArray(string1)).toEqual(["hello", "world!", "its", "nice", "to", "see", "you"])

    const string2 = " hello  world!  its nice to see you ";
    expect(splitIntoWordArray(string2)).toEqual(["hello", "world!", "its", "nice", "to", "see", "you"])
})

test('properly formats words before indexing them', ()=> {
    const testData = [
        {
            "expected": "hello",
            "try": ["Hello", " Hello", "Hello ", "hel--lo", " Hello ","  Hello", "!Hello!", "*&hell#o "]
        },
        {
            "expected": "",
            "try": [".", ": ", "\\", " !", "-", "$"]
        }
    ]
    
    testData.forEach((test) => {
        test["try"].forEach((t)=>{
            expect(formatWord(t)).toEqual(test["expected"])
        })
    })
})