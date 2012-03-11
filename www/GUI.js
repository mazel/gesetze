function onBodyLoad()
{		
    document.addEventListener("deviceready", onDeviceReady, false);
}

/* When this function is called, PhoneGap has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
function onDeviceReady()
{          
    //alert("onDeviceReady");
    
    //transitions flackern auf android, eventuell verschiedene ausprobieren
	$.mobile.defaultPageTransition = 'none';
	$.mobile.defaultDialogTransition = 'none';
	
	//alle gesetze anzeigen ist zu unperformant, viel zu große liste -> vorauswahl des anfangszeichens
    createCharsList();
    
}

function createCharsList(lId) {
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	for(var i=0; i<alphabet.length; i++) {
		var char = alphabet.charAt(i);
		var li = document.createElement("li"); 
		var link = document.createElement("a");
    	var text = document.createTextNode(char);
    	link.appendChild(text);
    	li.appendChild(link);
    	li.setAttribute('class', 'charButton');
    	li.setAttribute('char', char);
		$('#charsOverview').append(li);  
	}
	$('.charButton').tap(function(){ createLawsList($(this).attr('char')); });
}

function createLawsList(char){
    $('#lawsOverview').empty();
    $.mobile.changePage('#lawsOverviewDiv');
	fillLawsList(char, "lawsOverview", "lawsHeader", "lawOverviewDiv");
}

function createParagraphsList(lawName, link){
    $('#lawOverview').empty();
    $.mobile.changePage('#lawOverviewDiv');
    fillParagraphsList(lawName, link, "lawOverview", "lawHeader", "paragraphDiv");
}

function createParagraph(title, lawLink, paragraphLink){
    $('#paragraph').empty();
    $.mobile.changePage('#paragraphDiv');
    fillParagraph(title, lawLink, paragraphLink, "paragraph", "paragraphHeader");
}

function addEntryToLawsList(lId, lawName, state, subHeading, lawLink){
    var newLi = document.createElement("li");
    newLi.setAttribute('class', 'lawButton');
    newLi.setAttribute('lawName', lawName);
    newLi.setAttribute('lawLink', lawLink);
    
    var newLawHeading = document.createTextNode(lawName);
    var newLawState = document.createTextNode(state);
    var newLawSubHeading = document.createTextNode(subHeading);
    var newBr = document.createElement("br");
    
    var newLawLink = document.createElement("a");
    var newLawSubHeadingFont = document.createElement("font");
    newLawSubHeadingFont.setAttribute('class', 'subheading');
    newLawSubHeadingFont.appendChild(newLawSubHeading);
    var newLawStateFont = document.createElement("small");
    newLawStateFont.appendChild(newLawState);
    
    newLawLink.appendChild(newLawHeading);
    newLawLink.appendChild(newLawStateFont);
    newLawLink.appendChild(newBr);
    newLawLink.appendChild(newLawSubHeadingFont);
    newLi.appendChild(newLawLink);
    $('#'+lId).append(newLi);    
}

function addEntryToParagraphsList(lId, paragraph, state, lawLink, paragraphLink){
    var newLi = document.createElement("li");
    newLi.setAttribute('class', 'paragraphButton');
    newLi.setAttribute('paragraph', paragraph);
    newLi.setAttribute('lawLink', lawLink);
    newLi.setAttribute('paragraphLink', paragraphLink);
    
    var newHeading = document.createTextNode(paragraph);
    var newState = document.createTextNode(state);
    var newBr = document.createElement("br");
    
    var newLink = document.createElement("a");
    var newStateFont = document.createElement("small");
    newStateFont.appendChild(newState);
    
    newLink.appendChild(newHeading);
    newLink.appendChild(newStateFont);
    newLink.appendChild(newBr);
    newLi.appendChild(newLink);
    $('#'+lId).append(newLi);    
}

function addEntryToParagraph(lId, entry){
    var newLi = document.createElement("li");
    
    var newEntry = document.createTextNode(entry);
    newLi.appendChild(newEntry);
    
    $('#'+lId).append(newLi);    
}

function addSeperatorToList(lId, sepName){
    var newLi = document.createElement("li");
    newLi.setAttribute('data-role', 'list-divider');
    var newSepName = document.createTextNode(sepName);
    newLi.appendChild(newSepName);
    $('#'+lId).append(newLi);
}

function addLoaderToList(lId) {
	var newLi = document.createElement("li");
	//newLi.setAttribute('data-role', 'list-divider');
	newLi.setAttribute('id', 'loadingList');
	
	//gif freezes while parsing
	//var loader = document.createElement("img");
    //loader.setAttribute('src', 'jquery/mobile/images/ajax-loader-lists.gif');
    
    var loader = document.createTextNode("Lade...");
    
    newLi.appendChild(loader);
    $('#'+lId).append(newLi);
}

function removeLoaderFromList() {
	$('#loadingList').remove();
}

function addMessageToList(lId, message) {
	var newLi = document.createElement("li");
    var message = document.createTextNode(message);
    newLi.appendChild(message);
    
    $('#'+lId).append(newLi);
}
