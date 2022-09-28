const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.querySelector("[data-quote-display]");
const quoteInputElement = document.querySelector("[data-quote-input]");
const timer = document.querySelector("[data-timer]");

quoteInputElement.addEventListener("input", () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll("span");
    const arrayValue = quoteInputElement.value.split("");
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.remove("correct");
            characterSpan.classList.add("incorrect");
        };
    });

    let correctCharacters = 0;
    const arrayQuoteArray = [...arrayQuote];
    totalCharacters = arrayQuoteArray.length;
    correctCharacters = arrayQuoteArray.filter(item => item.classList.contains("correct")).length;

    if (arrayQuoteArray.length === arrayValue.length) {
        const wpm = Math.floor(updateWPM(parseInt(timer.innerText), setNumWordsInText(quoteDisplayElement.innerText)));
        const accuracy = getAccuracy(totalCharacters, correctCharacters);
        alert(`Your typing speed is ${wpm} words per minute with an accuracy of ${accuracy}%!`);
        renderNewQuote();
    } 
});

function getAccuracy(numberOfTotalCharacters, numberOfCorrectCharacters) {
    return ( numberOfCorrectCharacters / numberOfTotalCharacters ) * 100;
}

function setNumWordsInText(text) {
    let output = text;
    output = output.replace(/(^\s*)|(\s*$)/gi, "");
    output = output.replace(/[ ]{2,}/gi, " ");
    output = output.replace(/\n /, "\n");
    return output.split(" ").length;
}

function updateWPM(seconds, numWordsInText) {
    return (numWordsInText / seconds) * 60;
}

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = "";
    quote .split("").forEach(character => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    startTimer();
}

let startTime;

function startTimer() {
    timer.innerText = 0;
    startTime = new Date();
    setInterval(() => {
       timer.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
   return Math.floor((new Date() - startTime) / 1000);
}


renderNewQuote();