const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";

interface Elements {
	quoteDisplayElement: HTMLDivElement;
	quoteInputElement: HTMLTextAreaElement;
	timerElement: HTMLDivElement;
	quoteResultElement: HTMLParagraphElement;
	quoteBtnElement: HTMLButtonElement;
}

const elements = {
	quoteDisplayElement: document.querySelector("[data-quote-display]"),
	quoteInputElement: document.querySelector("[data-quote-input]"),
	timerElement: document.querySelector("[data-timer]"),
	quoteResultElement: document.querySelector("[data-quote-result]"),
	quoteBtnElement: document.querySelector("[data-quote-btn]"),
} as Elements;

const elementsUndefined = Object.values(elements).some(
	(element: keyof Elements) => element == undefined || element == null
);

if (elementsUndefined) {
	throw Error("One or more of the required ui elements is currenly undefined!");
}

const {
	quoteDisplayElement,
	quoteInputElement,
	timerElement,
	quoteResultElement,
	quoteBtnElement,
} = elements;

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
		}
	});

	let correctCharacters = 0;
	const arrayQuoteArray = [...arrayQuote];
	const totalCharacters = arrayQuoteArray.length;
	correctCharacters = arrayQuoteArray.filter((item) =>
		item.classList.contains("correct")
	).length;

	if (arrayQuoteArray.length === arrayValue.length) {
		stopTimer();
		const wpm = Math.floor(
			updateWPM(
				Number(timerElement.innerText),
				setNumWordsInText(quoteDisplayElement.innerText)
			)
		);
		const accuracy = getAccuracy(totalCharacters, correctCharacters);
		quoteResultElement.textContent = `You are ${accuracy}% accurate and your typing speed is ${wpm} wpm!`;
		if (quoteResultElement.classList.contains("hidden"))
			quoteResultElement.classList.remove("hidden");
		if (quoteBtnElement.classList.contains("hidden"))
			quoteBtnElement.classList.remove("hidden");
		if (!quoteInputElement.classList.contains("hidden"))
			quoteInputElement.classList.add("hidden");
	}
});

function getAccuracy(
	numberOfTotalCharacters: number,
	numberOfCorrectCharacters: number
) {
	return Number((numberOfCorrectCharacters / numberOfTotalCharacters) * 100);
}

function setNumWordsInText(text: string) {
	let output = text;
	output = output.replace(/(^\s*)|(\s*$)/gi, "");
	output = output.replace(/[ ]{2,}/gi, " ");
	output = output.replace(/\n /, "\n");
	return output.split(" ").length;
}

function updateWPM(seconds: number, numWordsInText: number) {
	return (numWordsInText / seconds) * 60;
}

async function getRandomQuote(): Promise<string> {
	return await fetch(RANDOM_QUOTE_API_URL)
		.then((response) => response.json())
		.then((data) => data.content);
}

async function renderNewQuote() {
	if (!quoteResultElement.classList.contains("hidden"))
		quoteResultElement.classList.add("hidden");
	if (!quoteBtnElement.classList.contains("hidden"))
		quoteBtnElement.classList.add("hidden");
	if (quoteInputElement.classList.contains("hidden"))
		quoteInputElement.classList.remove("hidden");
	const quote = await getRandomQuote();
	quoteDisplayElement.innerHTML = "";
	quote.split("").forEach((character) => {
		const characterSpan = document.createElement("span");
		characterSpan.innerText = character;
		quoteDisplayElement.appendChild(characterSpan);
	});
	quoteInputElement.value = "";
	startTimer();
}

let startTime: Date;
let interval: number;

function startTimer() {
	timerElement.innerText = "0";
	startTime = new Date();

	interval = setInterval(() => {
		timerElement.innerText = getTimerText();
	}, 1000);
}

function stopTimer() {
	clearInterval(interval);
}

function getTimerText() {
	if (!startTime) {
		return "0";
	} else {
		return Math.floor(
			(new Date().getTime() - startTime.getTime()) / 1000
		).toString();
	}
}

renderNewQuote();

