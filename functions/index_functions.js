
//--------GLOBAL VARIABLES--------//

//Themes variables
let sailorDay = true;
let sailorNight = false;
let sailorDay1, sailorNight1;

//Preset search suggestions for recommended gifs on first load
let searchHistory = [{name: "love", searches: 0}, {name: "laugh", searches: 0}, {name: "funny", searches: 0}, {name: "fun", searches: 0}];

//Autocomplete variables
let suggestions = [];
let focus;
let topSug = [];
const invalidINDEX = -1;

let searched = false;



//--------FUNCTIONS--------//

function removeFocus(links) {

	for (i = 0; i < 3; i++) {

		links[i].classList.remove("btnHover");
	}
}


function addFocus(input, links) {
	
	if (!input) {
		return false;
	}
	
	//Remove the "active" class of all items
	removeFocus(links);

	//Loop when reaching the first or last element
	if (focus >= input.length) {
		focus = 0;
	}

	if (focus < 0) {
		focus = (input.length - 1);
	}
	
	links[focus].classList.add("btnHover");
}


function closeLists(element) {

	//Reset autocomplete list

	let bar = document.getElementById("searchBar");
	let container = document.getElementById("suggestions");
	let links = container.getElementsByTagName("button");

	if (element != bar && element != container) {
		
		for (var i = 0; i < links.length; i++) {

			links[i].textContent = "";
			links[i].style.display = "none";
			suggestions = [];
			container.style.display = "none";
			container.style.height = "60px";
			removeFocus(links);
			topSug = [];
		}
	}
}


function checkSearch(input, array) {

	//Check if the searched term is new

	for (i = 0; i < array.length; i++) {

		if (input == array[i].name) {
			return i;
		}
	}

	return invalidINDEX;
}


function noReload() {

	var container = document.getElementById("suggestions");
	var searchButton = document.getElementById("searchButton");

	if (event.key === "Enter") {

		//Prevent form submit
		event.preventDefault();

		if (container.style.display == "flex") {

			//Search selected suggested term
			var button = document.querySelector(".btnHover");
			var bar = document.getElementById("searchBar");
			bar.value = button.textContent;
			searchButton.click();

		} else {

			//Search term typed
			searchButton.click();
		}
	}
}


function getCopyLink(url, container) {

	let input = document.createElement("input");
	input.className = "originalSizeUrl";
	input.readOnly = true;

	var x = window.matchMedia("(max-width: 1030px) and (hover:none)");

	container.appendChild(input);
	input.value = url;

	//Copy original size url to clipboard
	container.ondblclick = function() {
		input.style.display = "block";
		input.select();
		document.execCommand("copy");
		input.style.display = "none";
	}

	if (x.matches) {
		container.onclick = function() {
			input.style.display = "block";
			input.select();
			//selection for mobile
			input.setSelectionRange(0, 99999);
			document.execCommand("copy");
			input.style.display = "none";
		}
	}
}


function clearSearch() {

	document.getElementById("searchResults").innerHTML = "";
	document.querySelector(".resultsTitle").style.display = "none";
	document.querySelector("#searchedTerm").style.display = "none";
}


function getSearchResults(value) {
	const found = fetch('https://api.giphy.com/v1/gifs/search?q=' + value +'&api_key=' + 'BvgTOrMFMNh0BCBlmDtbz185bMocltKH' + '&limit=20')
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


function getTrending() {
	const found = fetch('https://api.giphy.com/v1/gifs/trending?' + '&api_key=' + 'BvgTOrMFMNh0BCBlmDtbz185bMocltKH' + '&limit=14')
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


function getRecommended(tag) {

	const found = fetch('https://api.giphy.com/v1/gifs/random?' + 'api_key=' + 'BvgTOrMFMNh0BCBlmDtbz185bMocltKH' + '&tag=' + tag)
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


function displayGifs(id, container, urlF, urlO) {

	//Display each gif (search and trending)

	let gifBox = document.createElement("div");
	gifBox.classList.add("ref", "gifContainer");

	if (sailorDay) {
		gifBox.classList.add("light");

	} else {
		gifBox.classList.add("dark");
	}

	let resultImg = document.createElement("img");
	resultImg.id = id;
	resultImg.src = urlF;

	resultImg.onerror = function(){
		resultImg.parentNode.remove();
	}; 

	container.appendChild(gifBox);
	gifBox.appendChild(resultImg);

	getCopyLink(urlO, gifBox);
}


async function trending() {

	//Display "trending" gallery

	var result = await getTrending();
	var container = document.getElementById("trendingContainer");

	for (i = 0; i < result.data.length; i++) {

		let gifUrlFixed = result.data[i].images.fixed_height.url;
		let gifUrlOriginal = result.data[i].images.original.url;
		let gifId = i + "trendingGif";

		displayGifs(gifId, container, gifUrlFixed, gifUrlOriginal);
	}
}


async function changeGif(gifContainer) {

	gifContainer.style.display = "none";
	let image = gifContainer.querySelector("img");
	let gifTag = image.className;

	let result = await getRecommended(gifTag);

	image.src = result.data.images.fixed_height.url;
	urlToCopy = result.data.images.original.url;
	gifContainer.style.display = "flex";

	let input = gifContainer.getElementsByClassName("originalSizeUrl")[0];
	input.value = urlToCopy;
}


function seeMore(tagName) {
	let bar = document.querySelector("#searchBar");
	bar.focus();
	bar.value = tagName;
	document.querySelector("#searchButton").disabled = false;

	search();
}


function createBtns() {

	let searchesList = document.getElementById("related");
	searchesList.innerHTML = "";
	searchesList.style.display = "flex";

	let containerWidth = document.getElementById("related").clientWidth;

	let totalWidth = 0;

	for (i = 0; i < searchHistory.length; i++) {

		//Set maximum number of buttons
		if (i == 40) {
			return;
		}

		let sugBtn = document.createElement("button");
		sugBtn.classList.add("relatedBtn", "ref");

		if (document.body.classList.contains("light")) {
			sugBtn.classList.add("light");
		} else {
			sugBtn.classList.add("dark");
		}

		let tagName = searchHistory[i].name;

		sugBtn.onclick = function(){
			seeMore(tagName);
		}

		sugBtn.textContent = "#" + tagName;
		
		searchesList.appendChild(sugBtn);

		//Hide overflow-X displaying the last button in full width
		let btnWidth = sugBtn.offsetWidth + 8;

		totalWidth = totalWidth + btnWidth;

		if (totalWidth > containerWidth) {

			searchesList.childNodes[i].style.display = "none";
		}
	}
}


async function recommended() {

	var container = document.getElementById("recommendedContainer");

	//Sort list by most searched
	let tags = searchHistory.sort(function(value1, value2) {
		if (value1.searches < value2.searches) {
			return 1;
		} else {
			return -1;
		}
	});

	//Display top 4 searched terms

	for (j = 0; j < 4; j++) {

		let	result = await getRecommended(tags[j].name);

		let gifBox = document.createElement("div");
		let topBar = document.createElement("div");
		let text = document.createElement("p");

		gifBox.classList.add("ref");
		topBar.classList.add("ref");
		topBar.classList.add("topBar");
		gifBox.classList.add("recContainer");

		if (sailorDay) {
			gifBox.classList.add("light");
			topBar.classList.add("light");

		} else {
			gifBox.classList.add("dark");
			topBar.classList.add("dark");
		}

		let resultImg = document.createElement("img");

		resultImg.id = j + "recommendedGif";

		let tagNameOriginal = tags[j].name;
		tagName = tagNameOriginal.replace(/\s+/g, '');
		text.textContent = "#" + tagName;

		resultImg.classList.add(tagName);
		resultImg.src = result.data.images.fixed_height.url;


		resultImg.onerror = function() {
			changeGif(gifBox);
		}

		let closeButton = document.createElement("button");
		closeButton.className = "close";

		closeButton.onclick = function() {
			changeGif(gifBox);
		}

		let moreButton = document.createElement("button");
		moreButton.className = "more";
		moreButton.textContent = "Ver más...";

		moreButton.onclick = function() {

			seeMore(tagNameOriginal);
		}
		
		container.appendChild(gifBox);
		gifBox.appendChild(topBar);
		topBar.appendChild(text);
		gifBox.appendChild(resultImg);
		topBar.appendChild(closeButton);
		gifBox.appendChild(moreButton);

		let urlToCopy = result.data.images.original.url;
		getCopyLink(urlToCopy, gifBox);
	}
}


async function search(event) {

	let button = document.getElementById("searchButton");

	//Delete old search
	clearSearch();

	let titleBar = document.querySelector(".resultsTitle");
	let value = document.getElementById("searchBar").value;
	let container = document.getElementById("searchResults");

	let check = checkSearch(value, searchHistory);

	var result = await getSearchResults(value);

	if (result.data == 0) {
		let noResults = document.createElement("div");
		noResults.id = "noGifs";
		noResults.classList.add("ref");

		if (document.body.classList.contains("light")) {
			noResults.classList.add("light");
		} else {
			noResults.classList.add("dark");
		}

		let text = document.createElement("p");
		text.textContent = "No se encontraron gifs para: " + value;

		noResults.appendChild(text);
		container.appendChild(noResults);

		return;
	}

	//Save searched term in local storage
	if (check == invalidINDEX) {

		let object = {name: value, searches: 1};
		searchHistory.push(object);

	} else {

		let searchesNumber = searchHistory[check].searches + 1;
		searchHistory[check].searches = searchesNumber;
	}

	window.localStorage.history = JSON.stringify(searchHistory);

	//Display button list of searched terms
	createBtns();

	//Adapt list to container size on resize
	if (!searched) {
		window.addEventListener("resize", createBtns);
	}

	searched = true;


	titleBar.style.display = "block";
	titleBar.parentNode.style.display = "block";
	let title = titleBar.querySelector("h5");
	title.textContent = value[0].toUpperCase() +  
	value.slice(1); 
	
	//Auto-scroll to search results
	window.location.href = "#searchedTerm";

	for (i = 0; i < result.data.length; i++) {

		let gifUrlFixed = result.data[i].images.fixed_height.url;
		let gifUrlOriginal = result.data[i].images.original.url;
		let gifId = i + "searchGif";

		displayGifs(gifId, container, gifUrlFixed, gifUrlOriginal);
	}
}


function suggestionClick(container, buttons) {

	//Search suggested term on click

	for (i = 0; i < buttons.length; i++) {

		buttons[i].addEventListener("click", function(x, event) {

			let bar = document.getElementById("searchBar");
			bar.value = this.textContent;
			bar.focus();
			search();
		});

		buttons[i].addEventListener("mousedown", function(event) {

			removeFocus(buttons);
		});
	}
}


function enableSearchBtn(bar) {

	let button = document.getElementById("searchButton");

	if (bar.value.length > 0) {
		button.disabled = false;

	} else {
		button.disabled = true;
	}
}


function autocomplete(input, array) {
	
	let container = document.getElementById("suggestions");
	let links = container.getElementsByTagName("button");

	input.addEventListener("input", function(event) {

		enableSearchBtn(input);
		
		var value = input.value;
		
		closeLists();
		
		focus = 0;

		if (!value) {

			return false;
		}

		for (i = 0; i < array.length; i++) { 

			//Check if input matches previous searches
			if (array[i].name.substr(0, value.length).toUpperCase() == value.toUpperCase()) {
				let suggestion = {name: array[i].name, searches: array[i].searches};
				suggestions.push(suggestion);
			}
		}

		//Sort by most searched
		suggestions.sort(function(value1, value2) {
			if (value1.searches < value2.searches) {
				return 1;
			} else {
				return -1;
			}
		});

		//Display top 3 matches
		for (i = 0; i < 3; i++) {

			if (i < suggestions.length) {
				
				links[i].textContent = suggestions[i].name;
				links[i].style.display = "block";
				topSug.push(suggestions[i]);
				container.style.display = "flex";
				links[0].classList.add("btnHover");
				
				if (links[1].style.display == "block" && links[2].style.display == "none") {
					container.style.height = "110px";
					
				} else if (links[2].style.display == "block") {
					container.style.height = "160px";
				}
			} else {
				return;
			}
		}
	});

	input.addEventListener("keydown", function(event) {

		//Prevent form submit on enter
		noReload();

		//Change selected term
		if (container.style.display == "flex") {

			if (event.keyCode == '40') {
				focus++;
				addFocus(topSug, links);

			} else if (event.keyCode == '38') {
				//Prevent cursor from going back
				event.preventDefault();
				focus--;

				addFocus(topSug, links);

			} else if (event.keyCode == '39') {
				//Discard suggestions
				closeLists();
			}
		}
	});

	document.addEventListener("click", function (event) {
		closeLists(event.target);
	});

	suggestionClick(container, links);
}


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


function getHistory() {

	if (window.localStorage.history) {

		searchHistory = JSON.parse(window.localStorage.getItem("history"));

	} else {
		window.localStorage.setItem("history", JSON.stringify(searchHistory));
	}

	let bar = document.getElementById("searchBar");
	autocomplete(bar, searchHistory);
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



//--------ON LOAD HANDLER--------//


maintainThemeChoice();

var loadElements = window.addEventListener("load", function() {

	//Set list of searches and launch autocomplete
	getHistory();

	recommended();
	setTimeout(trending, 2000);

});


//--------ON CLICK HANDLERS--------//

//Close dropdown menu when other elements are clicked
var closeMenu = document.addEventListener("click", autoClose);

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

var searchClick = document.getElementById('searchButton').addEventListener("click", search);