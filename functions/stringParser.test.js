const {formatWord} = require('./stringParser');

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