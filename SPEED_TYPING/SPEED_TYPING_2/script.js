//HTML document needs to fully load before running js or errors may occur
window.onload=function() {

// Global Variables
// -------------------------------------------
const subbtn = document.querySelector("#sub-button")
const restartbtn = document.querySelector("#restart");
const textbtn = document.querySelector("#new-text");
const text = document.querySelector("#typing-box");
const dropdownChoice = document.querySelector(".select-box");
const wpmHTML = document.querySelector(".WPM");
const cpmHTML = document.querySelector(".CPM");
const timer = document.querySelector(".timer");

let testText = document.querySelector("#quote-api");
let APIurl = " "; // change the API url to request from based on user input
let minutes = 0, seconds = 0, ms = 0; // starting value for the timer
let alertMessage = "Congratulations, you completed the test in "  + minutes + " minutes and " + seconds + "." + ms + " seconds";
let interval;
let completeRandomText = "";
let APItextData = "abc";
let spanArray = [];
let letterArray = [];
let WPM = 0;
let CPM = 0;
let numWords = 0;
let letterIndex = 0; 
let wordIndex = 0;
let numberOfMistakes = 0;
let randomLetter; 
let randomWordsString = "";
let errorState;

// Function Defitions
// -------------------------------------------------------
function dropdownSelection() {	
	switch(dropdownChoice.value){
		case 'alphanumeric':	
			APIurl = "https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1";
			break;
		case 'paragraph':
			APIurl = "https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1";
			break;
		case 'words':
			APIurl = "https://api.datamuse.com/words?sp="+randomLetter+"*";
			break;
	}
}

// adds the leading zeros to the timer when they're single digit
function displayZero(time){
	if(time <= 9) {
		time = "0" + time;
	}
	return time;
}

// concatenates the different timer values with colons to display timer up to minutes
function runTimer(){ 
	timer.innerHTML = displayZero(minutes) + ":" + displayZero(seconds) + ":" + displayZero(ms);
	ms++;

	displayWPM_and_CPM(minutes, seconds, ms);
	createHTML();

	// time conversions
	if(seconds == "60"){
		seconds = "0";
		minutes++;
	}

	if(ms === 100){
		ms=0;
		seconds++;
	}
}

// checks when user begins typing, then calls runTimer to start the timer
function startTimer(){
	let textLength = text.value.length;

	if(textLength === 0){
		interval = setInterval(runTimer, 10) // run function every hundred of a second
	}
}

// reset timer and input box when button is pressed
function restartTest(){
	clearInterval(interval);
	timer.innerHTML = "00:00:00";
	text.value = "";
	minutes = 0; seconds = 0; ms = 0;
	text.style.border = "6px solid grey";
	wpmHTML.innerHTML = "WPM: 00";
	cpmHTML.innerHTML = "CPM: 00";
	letterIndex = 0;
	wordIndex = 0;
	WPM = 0;
	CPM = 0;
	numWords = 0;
	numberOfMistakes = 0;
	
	spanArray.map(char => {
		char.style.background = 'lightblue';
		char.style.color = 'black';
	});
}

// counts the number of words by counting spaces (may be slightly inaccurate)
// - have not accounted for backspaces (will add an extra word if included a space)
//   and last word of the entire text (ends with a period, but so do all sentences)
function countWords(){
	let textLength = text.value.length;
	// create a substring that checks if each new key typed is a space	
	if(text.value.substring((textLength-1), textLength) == " ")
		numWords++;
}

// calculates and displays the words per min and characters per min
function displayWPM_and_CPM(mins, secs, ms){
	let totalSeconds = (mins*60) + secs + (ms/100);
	let textInput = text.value;
	let numChars = textInput.length;
	let wpmHTML2 = "CPM: " + CPM;
	let cpmHTML2 = "WPM: " + WPM;
	CPM = Math.floor((numChars / totalSeconds) * 60); // characters per min
	WPM = Math.floor((numWords / totalSeconds) * 60); // words per min
	wpmHTML.innerHTML = wpmHTML2;
	cpmHTML.innerHTML = cpmHTML2;	
}

// check if input text equals test text, then changes border color accordingly
function checkStringEquality() {
	let textInput = text.value;
	let completeTestText;
	let parsedTestText;

	if(dropdownChoice.value == 'alphanumeric'){
		completeTestText = completeRandomText;
		parsedTestText = completeRandomText.substring(0, textInput.length);
	}
	// testTest.innerHTML is full of spans when createHTML is called
	// so use global variable APItextData instead
	else {
		completeTestText = APItextData;
		parsedTestText = APItextData.substring(0, textInput.length);
	}

	// check for equality to input
	if(textInput == completeTestText){
		text.style.border = "8px solid green";
		clearInterval(interval);
		alert(("Congratulations! You completed the " + dropdownChoice.value + " test in " + minutes + " minutes and " + seconds + "." + ms + " seconds!"));
		alert(("You made " + numberOfMistakes + " mistakes."));
	} else if(textInput == parsedTestText){
		errorState = false;
		text.style.border = "8px solid lightblue";
	} else{
		if(!errorState)
			numberOfMistakes++;
		errorState = true;
		text.style.border = "8px solid pink";
	}
}
	
// checks for character equality to input text and highlights the word
function highlightWords(){
	console.log(text.value)
	let textInput = text.value;
	let textLength = textInput.length;
	let inputLetter = textInput.substring((textLength - 1), textLength);

	// dont listen for shift and ctrl
	if(event.which != 16 && event.which != 17){
		if(dropdownChoice.value == 'alphanumeric'){
			if(event.which == 8){
				letterArray[(letterIndex-1)].style.background = "lightblue";
				letterIndex = letterIndex-2;
			}
			let completeTestText = completeRandomText;
			let parsedTestText = completeRandomText.substring(0, textLength);

			if(textInput == parsedTestText){
				letterArray[letterIndex].style.background = "lightgreen";
				letterIndex++;
			}
			else{
				letterArray[letterIndex].style.background = "pink";				
				letterIndex++;
			}
		}

		// non-alphanumeric tests
		else{
			if(letterArray[letterIndex] == inputLetter){
				letterIndex++;
				spanArray[wordIndex].style.background = "green";
				spanArray[wordIndex].style.borderRadius = "5px";
				if(letterArray[letterIndex] == " "){
					spanArray[wordIndex].style.background = "lightgreen";
					spanArray[wordIndex].style.color = "white";
					spanArray[wordIndex].style.borderRadius = "5px";
					wordIndex++;
				}
			}
			else {
				spanArray[wordIndex].style.background = "red";
				spanArray[wordIndex].style.borderRadius = "5px";
			}
		}
	}
}

// creates an array of the text parsed into letters
function createLetterArray(){
	for(let i = 0; i < spanArray.length; i++){
		let separatedWord = spanArray[i].innerHTML;
		separatedLetter = separatedWord.split("");
		for(let j = 0; j < separatedWord.length; j++){
			letterArray.push(separatedLetter[j]);
		}
	}
}

// function creates a string a random alphanumberic characters
// change the value of the second parameter of the for loop to control length
function createRandomText() {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  testText.innerHTML = "";
  letterArray = [];
  completeRandomText = "";

  for (let i = 0; i < 50; i++) {
  		let randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
  		completeRandomText += randomChar;
  		let separatedRandomChar = document.createElement("span");
  		let node = document.createTextNode(randomChar);
  		separatedRandomChar.appendChild(node);
  		letterArray.push(separatedRandomChar);
  		testText.appendChild(separatedRandomChar);
	}
}

// takes the response text from the API call and splits it into an array of substrings
// containing each separated word
// It creates a span HTML element to separate every word from the text
function createHTML(APIdata, isAPItext){
	// only create the HTML elements if data is from an API call
	if(isAPItext){
		let testTextValue = APIdata;
		let separatedText = testTextValue.split(" ");
		// reset the contents of the array to store new data when called again
		spanArray = [];
		letterArray = []; 
		testText.innerHTML = ""; // reset current html for appendage below

		for(let i = 0; i < separatedText.length; i++){
			let separatedWord = document.createElement("span");
			let node = document.createTextNode((separatedText[i] + " "));
			separatedWord.appendChild(node);
			spanArray.push(separatedWord); 
			testText.appendChild(separatedWord);
		}
		createLetterArray();
	}
}

// create a string of a lot of words through concatenation
function createRandomWordsString(){
	randomWordsString = "";

	for(let i = 6; i < 60; i++)
		randomWordsString = APItextData[i].word + " " + randomWordsString;
}

// selects the type of text and passes the corresponding response text from 
// the API call to the createHTML function
function changeTestText() {
	restartTest();
	let isAPItext;

	if(dropdownChoice.value == 'words'){
		createRandomWordsString();
	}

	// changes innerHTML based on what is selected from the dropdown menu
	if(dropdownChoice.value == 'quote'){
		isAPItext = true;
		APItextData = APItextData.quote;
		createHTML(APItextData, isAPItext);
	}
	else if(dropdownChoice.value == 'alphanumeric') {
		isAPItext = false;
		createRandomText();
	}
	else if(dropdownChoice.value == 'paragraph'){
		isAPItext = true;
		APItextData = APItextData[0];
		createHTML(APItextData, isAPItext);
	}
	else if(dropdownChoice.value == 'words'){
		APItextData = randomWordsString;
	  	isAPItext = true;
		createHTML(APItextData, isAPItext);
	}
}

// makes the API request to the designated server and sends the reponse text to 
// changeTestText as a callback
function APIcall(callback){
	let possibleChars = "abcdefghijklmnopqrstuvwxyz";
	randomLetter = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	dropdownSelection();

	let AJAXrequest = new XMLHttpRequest();
	AJAXrequest.onreadystatechange = () => {
		if (AJAXrequest.readyState == XMLHttpRequest.DONE) {
			APItextData = JSON.parse(AJAXrequest.responseText);
			console.log(APItextData);
			callback();
		}
		else if (AJAXrequest.status >= 400){
			console.log('Error 400');
		} 
	};
	AJAXrequest.onerror = () => {
		alert('Please check your internet connection!');
	}
	AJAXrequest.open('GET', APIurl);
	AJAXrequest.send();
}

// main()
// ----------------------------------------------------
text.addEventListener("keyup", checkStringEquality, false);
text.addEventListener("keydown", highlightWords, false);
text.addEventListener("keypress", startTimer, false);
text.addEventListener("keyup", countWords, false);
textbtn.addEventListener("click", () => { APIcall(changeTestText) });
restartbtn.addEventListener("click", restartTest, false);
}