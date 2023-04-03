const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.querySelector("[data-quote-display]");
const quoteInputElement = document.querySelector("[data-quote-input]");
const timerElement = document.querySelector("[data-timer]");
const quoteResultElement = document.querySelector("[data-quote-result]");
const quoteBtnElement = document.querySelector("[data-quote-btn]");

quoteBtnElement.addEventListener("click", () => {
    renderNewQuote();
});

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
        stopTimer();
        const wpm = Math.floor(updateWPM(parseInt(timerElement.innerText), setNumWordsInText(quoteDisplayElement.innerText)));
        const accuracy = getAccuracy(totalCharacters, correctCharacters);
        quoteResultElement.textContent = `You are ${accuracy}% accurate and your typing speed is ${wpm} wpm!`;
        if (quoteResultElement.classList.contains("hidden")) quoteResultElement.classList.remove("hidden");
        if (quoteBtnElement.classList.contains("hidden")) quoteBtnElement.classList.remove("hidden");
        if (!quoteInputElement.classList.contains("hidden")) quoteInputElement.classList.add("hidden");
    } 
});

function getAccuracy(numberOfTotalCharacters, numberOfCorrectCharacters) {
    return parseInt(( numberOfCorrectCharacters / numberOfTotalCharacters ) * 100);
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
    if (!quoteResultElement.classList.contains("hidden")) quoteResultElement.classList.add("hidden");
    if (!quoteBtnElement.classList.contains("hidden")) quoteBtnElement.classList.add("hidden");
    if (quoteInputElement.classList.contains("hidden")) quoteInputElement.classList.remove("hidden");
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
let interval;

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();

    interval = setInterval(() => {
       timerElement.innerText = getTimerTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function getTimerTime() {
   return Math.floor((new Date() - startTime) / 1000);
}

renderNewQuote();