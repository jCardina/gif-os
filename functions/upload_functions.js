

//--------GLOBAL VARIABLES--------//

var myGifs = [];

let stopLoading = false;
let redoingGif = false;
let uploadCanceled = false;
let playing = false;
let stopTimeout = false;

//Theme variables
let sailorNight1 = window.sessionStorage.getItem("sailorNight1");
let sailorDay1 = window.sessionStorage.getItem("sailorDay1");

//Timer variables
var count = 0;
var timeOut;
var gifLength = 0;
var seconds = 0, minutes = 0, hours = 0;
var secs, mins, hrs;



//--------FUNCTIONS--------//

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


function addThemeClass(element) {

	if (document.body.classList.contains("light")) {
		element.classList.add("light");
	} else {
		element.classList.add("dark");
	}
}


function createColorButton(container, id, type, mainClass, secondaryClass, textC) {

	let newButton = document.createElement("button");
	newButton.id = id;

	newButton.classList.add("ref");
	addThemeClass(newButton);

	if (type == "single") {

		if (mainClass != "forward") {
			newButton.textContent = textC;
		}

		newButton.classList.add("navButtons", mainClass);

		if (secondaryClass != "none") {

			newButton.classList.add(secondaryClass);
		}

	} else if (type == "double") {

		let icon = document.createElement("span");
		let text = document.createElement("span");

		text.textContent = textC;

		icon.classList.add("ref", "navButtons", mainClass);
		text.classList.add("ref", "navButtons", secondaryClass);

		addThemeClass(icon);
		addThemeClass(text);

		newButton.appendChild(icon);
		newButton.appendChild(text);
	}

	if (mainClass == "gifInfo") {

		let doneRow = document.getElementById("doneC");
		container.insertBefore(newButton, doneRow);

	} else {

		container.appendChild(newButton);
	}

	return newButton;
}


function createButtonX(container, id, secondaryClass) {
	
	let newButton = document.createElement("button");
	newButton.id = id;
	newButton.classList.add("close");

	if (secondaryClass != "none") {
		newButton.classList.add(secondaryClass);
	}

	container.appendChild(newButton);

	return newButton;
}

function watch() {

	secs = (seconds < 10) ? '0' + seconds : seconds;
	mins = (minutes < 10) ? '0' + minutes + ':' : minutes + ':';
	hrs = (hours < 10) ? '0' + hours + ':' : hours + ':';

	if (seconds === 59) {

		var timer = document.getElementById("timer");
		timer.textContent = hrs + mins + secs;

		hours = (minutes === 59) ? hours + 1 : hours;
		minutes = (seconds === 59) ? (minutes === 59) ? 0 : minutes + 1 : minutes;
		seconds = 0;

	} else {

		var timer = document.getElementById("timer");
		timer.textContent = hrs + mins + secs;

		seconds++;
	}

	if (hours > 1 && !playing) {
		document.getElementById("stop").click();
		setTimeout(function() {alert("Tiempo máximo de grabación alcanzado")}, 100);
		return;

	}

	timeOut = setTimeout(watch, 1000);
}


function startTime() {

	if (seconds === 0 && minutes === 0 && hours === 0) {
		watch();
	}
}


function stopTime() {

	if (seconds !== 0 || minutes !== 0 || hours !== 0) {

		if (!playing) {

			gifLength = hours * 3600 + minutes * 60 + seconds;
		}

		seconds = 0;
		minutes = 0;
		hours = 0;

		secs = '0' + seconds;
		mins = '0' + minutes + ':';
		hrs = '0' + hours + ':';

		var timer = document.getElementById ("timer");

		var resetTime = hrs + mins + secs;

		timer.textContent = resetTime;

		clearTimeout(timeOut);
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

	gifBox.appendChild(input);
	input.value = url;

	resultImg.ondblclick = function() {
		input.style.display = "block";
		input.select();
		document.execCommand("copy");
		input.style.display = "none";
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



function createLoadingBar(containerBox, id) {

	var container = document.createElement("div");
	container.id = id;
	container.className = "loading";

	containerBox.appendChild(container);

	for (i = 0; i < 20; i++) {

		var bars = document.createElement("div");
		bars.classList.add("bars");
		bars.classList.add("inactive");
		bars.classList.add("ref");

		addThemeClass(bars);

		container.appendChild(bars);
	}
}


function loadBars(lBar, length) {

	//Start play/loading bar

	let bars = lBar.getElementsByClassName("bars");
	
	let bar;

	bar = 0;

	//Set the bar duration according to the length of the original video recorded
	//Length * percentage / 100 * 1000 milliseconds
	var interv = setInterval(frame, (length * 50));


	function frame() {

		if (stopLoading) {
			//Stop and reset the bar when not displayed
			
			clearInterval(interv);

			for (j = 0; j < bars.length; j++) {
				bars[j].classList.remove("active");
				bars[j].classList.add("inactive");
			}

			bar = 0;
			stopLoading = false;

			return;
		}

		if (bar == 19) {
			
			//Default stop and reset

			bars[bar].classList.remove("inactive");
			bars[bar].classList.add("active");

			setTimeout(function() {

				clearInterval(interv);

				for (j = 0; j < bars.length; j++) {
					bars[j].classList.remove("active");
					bars[j].classList.add("inactive");
				}
			}, 500);

			bar = 0;

		} else {
			
			bars[bar].classList.remove("inactive");
			bars[bar].classList.add("active");
			bar++;
		}
	}
}


function closeStream(button, stream, video, box, title, mainCard, recordBtn) {

	//Stop video stream and reset elements

	redoingGif = false;
	
	button.remove();

	recordBtn.remove();

	mainCard.style.display = "block";
	box.style.display = "none";
	
	stream.stop();
	video.style.display = "none";
	
	title.textContent = "Un Chequeo Antes de Empezar";
	stopTime();
	gifLength = 0;

	var controlBox = document.getElementById("controls");
	controlBox.style.justifyContent = "flex-end";

	var timer = document.getElementById("timerBox");
	timer.style.display = "none";	
}



function uploadDone(previousCard) {

	//Reset elements after a gif is created

	previousCard.style.display = "none";
	document.getElementById("instrc").style.display = "block";
	gifLength = 0;

	let gifs = document.getElementById("gifs");
	gifs.style.display = "none";
	
	document.getElementById("timerBox").style.display = "none";
	document.getElementById("controls").style.justifyContent = "flex-end";
	document.getElementById("loadContainer").remove();
	document.getElementById("loadContainer2").remove();

	let container1 = document.getElementById("videoBox");
	let container2 = document.getElementById("uploadingCard");
	let container3 = document.getElementById("uploaded");

	let playbackBtns = container1.getElementsByTagName("button");
	let uploadingBtns = container2.getElementsByTagName("button");
	let uploadedBtns = container3.getElementsByTagName("button");

	for (i = 0; i < 3; i++) {
		playbackBtns[0].remove();
	}

	for (j = 0; j < 2; j++) {
		uploadingBtns[0].remove();
	}

	for (x = 0; x < 4; x++) {
		uploadedBtns[0].remove();
	}
}


async function setUploaded (form, thisButton, upCard, barBox, blob, blobUrl, videoBox) {

	//Call for gif upload, set elements and display gif information

	let newGif = await uploadGif(form, thisButton, barBox, videoBox);

	if (uploadCanceled) {
		uploadCanceled = false;
		return;
	}

	gifId = newGif.data.id;

	//Save gif ID in local Storage, adding newest first
	myGifs.unshift({type: "gif", id: gifId});
	window.localStorage.guifos = JSON.stringify(myGifs);


	let gifInfo = await getGifInfo(gifId);

	let gifUrl = gifInfo.data.images.original.url;

	let urlInput = document.getElementById("guifoUrl");
	urlInput.value = gifUrl;

	let myGifPrev = document.getElementById("gifThumb");
	myGifPrev.src = blobUrl;

	upCard.style.display = "none";

	let uploadedCard = document.getElementById("uploaded");
	uploadedCard.style.display = "flex";

	let infoContainer = document.getElementById("textCard");
	let doneRow = document.getElementById("doneC");

	let copyBtn = createColorButton(infoContainer, "info1", "single", "gifInfo", "secondary", "Copiar Enlace Guifo");

	//Copy public url to clipboard
	copyBtn.addEventListener("click", function() {
		urlInput.style.display = "block";
		urlInput.select();
		document.execCommand("copy");
		urlInput.style.display = "none";
	});

	let downloadBtn = createColorButton(infoContainer, "info2", "single", "gifInfo", "secondary", "Descargar Guifo");

	downloadBtn.addEventListener("click", function() {
		invokeSaveAsDialog(blob);
	});

	let doneBtn = createColorButton(doneRow, "done", "single", "gifDone", "none", "Listo");

	let titleBarUploaded = uploadedCard.firstElementChild;

	let closeBtnDone = createButtonX(titleBarUploaded, "closeWindowDone", "gifDone");

	let doneButtons = document.getElementsByClassName("gifDone");

	Array.prototype.forEach.call(doneButtons, element => {
		element.addEventListener("click", function() {
			uploadDone(uploadedCard);
		});
	});

	//Display new gif in gallery

	let containerNewGif = document.getElementById("guifosDisplay");
	let newGifUrl = gifInfo.data.images.fixed_height.url;
	let insertOption1 = "beginning";

	document.getElementById("noGifs").hidden = true;

	displayGif(containerNewGif, newGifUrl, insertOption1);
}


function setUpload(thisButton, blob, blobUrl, sizeMB, size, redo, gifs) {

	//Prevent double click
	thisButton.disabled = true;

	//Reset gif player when active
	if (playing) {
		stopLoading = true;
		stopTime();
		gifs.src = "./images/black.png";
		stopTimeout = true;
		playing = false;
	}

	//Check file size
	if (sizeMB > 99) {
		alert("Error: El tamaño máximo por archivo es de 100 MB." + "\n" + "Tamaño del archivo: " + size);
		redo.click();
		return;
	}

	//Set elements for upload

	let videoBox = document.getElementById("videoBox");
	videoBox.style.display = "none";

	let upCard = document.getElementById("uploadingCard");
	upCard.style.display = "flex";

	let barBox = document.querySelector("#barBox");

	createLoadingBar(barBox, "loadContainer2");

	let upControls = document.getElementById("controls2");

	let cancelUp = createColorButton(upControls, "cancelUpload", "single", "stopUpload", "secondary", "Cancelar");

	let titleBar = upCard.firstElementChild;

	let closeBtn = createButtonX(titleBar, "closeWindowUp", "stopUpload");

	let form = new FormData();
	form.append('file', blob, 'myGif.gif');

	setUploaded(form, thisButton, upCard, barBox, blob, blobUrl, videoBox);
}


function uploadGif(form, uploadBtn, barBox, videoBox) {

	//Start loading bar

	let loadingBar;

	setTimeout(function(){
		loadBars(barBox, 5);
		loadingBar = setInterval(function() {loadBars(barBox, 5);}, 5500);
	}, 500);

	//Controller to cancel fetch
	const controller = new AbortController();
	const signal = controller.signal;

	let noError = false;
	
	let cancelBtns = document.getElementsByClassName("stopUpload");

	function resetItems() {
		//Reset elements whe the upload is cancelled or returns an error
		clearInterval(loadingBar);
		stopLoading = true;
		barBox.innerHTML = "";
		uploadBtn.disabled = false;
		cancelBtns[1].remove();
		cancelBtns[0].remove();
		barBox.parentNode.parentNode.style.display = "none";
		videoBox.style.display = "flex";
	}

	//Set handlers to cancel, delayed to avoid errors with the loading bar
	setTimeout(function() {
		for (j = 0; j < 2; j++) {
			cancelBtns[j].addEventListener("click",	function cancelApiUpload() {
				noError = true;
				controller.abort();
			});
		}
	}, 600);


	//fetch upload endpoint
	const Url = 'https://upload.giphy.com/v1/gifs' + '?api_key=' + 'BvgTOrMFMNh0BCBlmDtbz185bMocltKH';

	const found = fetch(Url, {
		method: 'POST',
		body: form,
		signal: signal

	})
	.then((response) => {
		return response.json();
	}).then(data => {

		clearInterval(loadingBar);
		stopLoading = true;
		stopTimeout = false;

		return data;
	})
	.catch((error) => {

		if (!noError) {

			uploadCanceled = true;
			setTimeout(function() {
				alert("Ha ocurrido un error al subir el guifo.");
				resetItems();
			}, 600);

			return error;

		} else {
			uploadCanceled = true;
			resetItems();
		}
	})
	return found;
}


function redoGif() {

	//Reset elements before re-recording

	let uploadBtn = document.getElementById("upload");
	let redoBtn = document.getElementById("redo");

	redoBtn.remove();
	uploadBtn.remove();

	var controlBox = document.getElementById("controls");

	controlBox.style.justifyContent = "flex-end";

	var playBox = document.getElementById("playBox");

	playBox.style.display = "none";

	if (playing) {
		stopLoading = true;
	}

	playBox.innerHTML = "";

	var timer = document.getElementById("timerBox");
	timer.style.display = "none";

	let gifs = document.getElementById("gifs");
	gifs.style.display = "none";

	let title = document.getElementById("titleBar4").firstElementChild;

	title.textContent = "Un Chequeo Antes de Empezar";
}


function playGif(url, container) {

	if (!playing) {

		playing = true;

		let gifs = document.getElementById("gifs");
		gifs.src = url;
		
		loadBars(container, gifLength);

		startTime();

		setTimeout(function() {

			if (!stopTimeout) {
				gifs.src = "./images/black.png";
				stopTime();
				playing = false;

			} else {
				stopTimeout = false;
				playing = false;
				return;
			}
		}, gifLength * 1000);
	}

	return;
}


function stopRecordingGif(thisButton, stream, recorder, title) {

	let blob;
	let blobUrl;
	let blobSize;

	recorder.stopRecording( function() {
		blob = recorder.getBlob();
		blobUrl = URL.createObjectURL(blob);
		blobSize = bytesToSize(blob.size);
	});

	let sizeBytes = blob.size;
	let sizeMB = sizeBytes / 1e+6;

	stopTime();

	stream.stop();

	thisButton.remove();

	//Set elements to play gif
	
	let closeStreamBtn = document.getElementById("closeStream");
	closeStreamBtn.remove();

	title.textContent = "Vista Previa";

	let video = document.getElementById("video");
	video.style.display = "none";
	let gifs = document.getElementById("gifs");
	gifs.style.display = "block";

	var playBox = document.getElementById("playBox");
	playBox.style.display = "flex";

	var controlBox = document.getElementById("controls");
	
	var redoBtn = createColorButton(controlBox, "redo", "single", "secondary", "none", "Repetir Captura");

	var uploadBtn = createColorButton(controlBox, "upload", "single", "upld", "none", "Subir Guifo");

	let play = createColorButton(playBox, "play", "single", "forward", "none");

	createLoadingBar(playBox, "loadContainer");

	play.addEventListener("click", function() {
		playGif(blobUrl, playBox);
	});

	redoBtn.addEventListener("click", function() {
		redoingGif = true;
		recorder.clearRecordedData();
		startStream();
	});

	uploadBtn.addEventListener("click", function() {
		setUpload(this, blob, blobUrl, sizeMB, blobSize, redoBtn, gifs);
	});
}


function recordGif(controlBox, captureBtn, title, stream, closeBtn) {

	var timer = document.getElementById("timerBox");
	timer.style.display = "flex";

	controlBox.style.justifyContent = "space-between";

	startTime();

	let recorder = RecordRTC(stream, {
		type: 'gif',
		frameRate: 1,
		quality: 10,
		width: 360,
		hidden: 240,
	});

	recorder.startRecording();

	captureBtn.remove();

	title.textContent = "Capturando tu Guifo";
	
	let stopBtn = createColorButton(controlBox, "stop", "double", "camera", "cptText", "Listo");
	stopBtn.disabled = true;

	//Delay to avoid recorder error
	setTimeout(function() {
		stopBtn.disabled = false;
	}, 1000);

	stopBtn.addEventListener("click", function() {
		stopRecordingGif(this, stream, recorder, title);
	});

	closeBtn.addEventListener("click", function() {
		stopBtn.remove();
		recorder.stopRecording();
		recorder.clearRecordedData();
	});
}


function startStream() {
	
	//Disable button to avoid double click
	let button = this;
	button.disabled = true;

	let instructions = document.getElementById("instrc");
	let box = document.getElementById("videoBox");
	let video = document.getElementById("video");
	
	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			height: { max: 480 }
		}
	})
	.then(function(stream) {

		button.disabled = false;

		if(redoingGif) {
			redoGif();
		} else {

			instructions.style.display = "none";
			box.style.display = "flex";
		}

		video.style.display = "block";
		video.srcObject = stream;
		video.play();

		let videoStream = stream;
		let titleBar = document.getElementById("titleBar4");
		let title = titleBar.firstElementChild;
		var controlBox = document.getElementById("controls");
		
		let closeStreamBtn = createButtonX(titleBar, "closeStream", "none");

		closeStreamBtn.addEventListener("click", function() {
			closeStream(closeStreamBtn, videoStream, video, box, title, instructions, captureBtn);
		});

		let captureBtn = createColorButton(controlBox, "capture", "double", "camera", "cptText", "Capturar");

		captureBtn.addEventListener("click", function() {
			recordGif(controlBox, captureBtn, title, videoStream, closeStreamBtn);
		});
	})
	.catch((error) => {
		button.disabled = false;
		return error;
	})
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


//--------ON LOAD HANDLER--------//

//Set theme
if (sailorNight1 == "true" && sailorDay1 == "false") {
	themeToggle();	
}

var loadGifs = window.addEventListener("load", function(event) {

	//Get guifos list from local storage
	getMyGifs();
});



//--------ON CLICK HANDLERS--------//

let goBack = document.querySelector("#backBtn").addEventListener("click", function() {
	window.location.href = "./index.html";
});

let cancel = document.querySelector("#cancel").addEventListener("click", function() {
	window.location.href = "./index.html";
});

let startRcrd = document.getElementById("startBtn").addEventListener("click", startStream);