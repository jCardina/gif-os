
//--------GLOBAL VARIABLES--------//

var myGifs = [];

//Themes variables
let sailorDay = true;
let sailorNight = false;
let sailorDay1, sailorNight1;


//--------FUNCTIONS--------//

function toggleOption(btnTheme1) {

	//Set theme according to the button clicked

	if (btnTheme1 && !sailorDay) {

		sailorDay = true;
		sailorNight = false;
		themeToggle();
		toggleMenu();

		window.sessionStorage.sailorNight1 = false;
		window.sessionStorage.sailorDay1 = true;

	} else if (!btnTheme1 && !sailorNight) {

		sailorDay = false;
		sailorNight = true;
		themeToggle();
		toggleMenu();

		window.sessionStorage.sailorNight1 = true;
		window.sessionStorage.sailorDay1 = false;

	} else {
		return;
	}
}


function autoClose(event) {

	if (!event.target.classList.contains('theme')) {

		var activeDropdown = document.getElementById("dropdownBox");
		var dropdownClass = activeDropdown.classList;

		if (dropdownClass.contains('dropdownOpen')) {
			dropdownClass.remove('dropdownOpen');
		}
	}
}


function toggleMenu(event) {
	
	var dropdown = document.querySelector(".dropdown");
	dropdown.classList.toggle("dropdownOpen");
}


function themeToggle() {

	let elements = document.getElementsByClassName("ref");

	for (i = 0; i < elements.length; i++){

		elements[i].classList.toggle("light");
		elements[i].classList.toggle("dark");
	}

	let logoDiv = document.getElementById("logo");
	let logoImg = document.getElementById("imgLogo");

	if (logoDiv.classList.contains("dark")) {
		logoImg.src = "./images/gifOF_logo_dark.png";
	} else {
		logoImg.src = "./images/gifOF_logo.png";
	}
}


function maintainThemeChoice() {

	if (window.sessionStorage.sailorNight1 && window.sessionStorage.sailorDay1) {

		sailorNight1 = window.sessionStorage.getItem("sailorNight1");
		sailorDay1 = window.sessionStorage.getItem("sailorDay1");

		if (sailorNight1 == "true" && sailorDay1 == "false") {
			themeToggle();
			sailorNight = true;
			sailorDay = false;
		} 
	} else {

		window.sessionStorage.setItem("sailorNight1", false);
		window.sessionStorage.setItem("sailorDay1", true);
	}
}


function addThemeClass(element) {

	if (document.body.classList.contains("light")) {
		element.classList.add("light");
	} else {
		element.classList.add("dark");
	}
}


function getGifInfo(id) {
	const found = fetch('https://api.giphy.com/v1/gifs/' + id + '?' +'&api_key=' + 'BvgTOrMFMNh0BCBlmDtbz185bMocltKH')
	.then((response) => {
		return response.json();
	}).then(data => {
		return data;
	})
	.catch((error) => {
		return error;
	})
	
	return found;
}


function displayGif(container, url, option) {
	let gifBox = document.createElement("div");

	gifBox.classList.add("ref", "gifContainer");
	addThemeClass(gifBox);

	let resultImg = document.createElement("img");

	resultImg.src = url;

	resultImg.onerror = function(){
		resultImg.parentNode.remove();
	};

	gifBox.appendChild(resultImg);

	if (option == "beginning") {
		container.insertBefore(gifBox, container.childNodes[0]);

	} else {

		container.appendChild(gifBox);
	}

	//Copy gif url to clipboard
	let input = document.createElement("input");
	input.className = "originalSizeUrl";
	input.readOnly = true;

	var x = window.matchMedia("(max-width: 1030px) and (hover:none)");

	gifBox.appendChild(input);
	input.value = url;

	resultImg.ondblclick = function() {
		input.style.display = "block";
		input.select();
		document.execCommand("copy");
		input.style.display = "none";
	}

	if (x.matches) {
		resultImg.onclick = function() {
			input.style.display = "block";
			input.select();
			//selection for mobile
			input.setSelectionRange(0, 99999);
			document.execCommand("copy");
			input.style.display = "none";
		}
	}
}



async function guifosDisplay() {

	//Set Guifos gallery

	let containerGuifos = document.getElementById("guifosDisplay");


	for (i = 0; i < myGifs.length; i++) {
		let result = await getGifInfo(myGifs[i].id);
		let gifUrl = result.data.images.original.url;
		let insertOption2 = "end";

		displayGif(containerGuifos, gifUrl, insertOption2);

	}
}


function getMyGifs() {

	if (window.localStorage.guifos) {

		myGifs = JSON.parse(window.localStorage.getItem("guifos"));

		if (myGifs.length > 0) {
			document.getElementById("noGifs").hidden = true;
			guifosDisplay();
		}
	} else {
		window.localStorage.setItem("guifos", JSON.stringify(myGifs));
	}
}


//--------ON LOAD--------//

maintainThemeChoice();

var loadGifs = window.addEventListener("load", function(event) {

	//Get guifos list from local storage
	getMyGifs();
});


//--------ON CLICK HANDLERS--------//

var closeMenu = document.addEventListener("click", autoClose);

let goBack = document.querySelector("#backBtn").addEventListener("click", function() {
	window.location.href = "./index.html";
});

var goToCreateGif = document.getElementById('button1').addEventListener("click", function(event) {
	window.location.href = "./upload.html";
});

var dropdownBtn = document.getElementById("button2").addEventListener("click", toggleMenu);

let sailorDayBtn = document.getElementById("themeToggle1").addEventListener("click", function() {
	toggleOption(true);
});

let sailorNightBtn = document.getElementById("themeToggle2").addEventListener("click", function() {
	toggleOption(false);
});