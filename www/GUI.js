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
    
    connectToDb();
    
    initConfigs();
    
	bindButtonsAndEnterToSearch();
	
	$('#favouritesButton').click(function(){ createFavouritesList(); });
	
	//alle gesetze anzeigen ist zu unperformant, viel zu große liste -> vorauswahl des anfangszeichens
    createCharsList();
    
    //now set the scale size and go to home
    getSetting('size', function(result){
		setInterfaceSize(result.rows.item(0).value);
		$.mobile.initializePage();
	});
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
	$('.charButton').click(function(){ createLawsList($(this).attr('char')); });
}

function createLawsList(char){
    $('#lawsOverview').empty();
    $.mobile.changePage('#lawsOverviewDiv');
	fillLawsList(char, "lawsOverview", "lawsHeader", "lawOverviewDiv");
}

function createParagraphsList(lawName, link, fav){
    // set Back-Button direction  
    if (fav==1){
        document.getElementById("backButtonLaw").setAttribute('href', '#favouritesDiv');
    } else {
        document.getElementById("backButtonLaw").setAttribute('href', '#lawsOverviewDiv');
    }
    // change Favourite-Button color
    var favButton = document.getElementById('favButton');
    checkDBFavourites(lawName, function(result){
      if (result){
            favButton.setAttribute('style', 'color: #f18b08;');
        } else {
            favButton.setAttribute('style', 'color: #c7c7c7;');
        }
    });
    
    $('#lawOverview').empty();
    $.mobile.changePage('#lawOverviewDiv');
    fillParagraphsList(lawName, link, "lawOverview", "lawHeader", "paragraphDiv");
}

function createParagraph(title, lawLink, paragraphLink, lawName, prevListElement, nextListElement){
    $('#paragraph').empty();
    $.mobile.changePage('#paragraphDiv');
    fillParagraph(title, lawLink, paragraphLink, "paragraph", "paragraphHeader", lawName, prevListElement, nextListElement);
}

function createFavouritesList(){
    $('#favouritesOverview').empty();
    $.mobile.changePage('#favouritesDiv');
    fillFavouritesList();
}

function addEntryToLawsList(lId, lawName, subHeading, lawLink){
	
    var newLi = document.createElement("li");
    newLi.setAttribute('class', 'lawButton');
    newLi.setAttribute('lawName', lawName);
    newLi.setAttribute('lawLink', lawLink);
    
    var newLawHeading = document.createTextNode(lawName);
    var newLawSubHeading = document.createTextNode(subHeading);
    var newBr = document.createElement("br");
    
    var newLawSubHeadingFont = document.createElement("font");
    newLawSubHeadingFont.setAttribute('class', 'subheading');
    newLawSubHeadingFont.appendChild(newLawSubHeading);
    
    newLi.appendChild(newLawHeading);
    newLi.appendChild(newBr);
    newLi.appendChild(newLawSubHeadingFont);
    $('#'+lId).append(newLi);    
}

function addEntryToParagraphsList(lId, paragraph, lawLink, paragraphLink, optionalText){
	optionalText = typeof optionalText !== 'undefined' ? optionalText : "";
	
    var newLi = document.createElement("li");
    newLi.setAttribute('class', 'paragraphButton');
    newLi.setAttribute('id', 'paragraphLi');
    newLi.setAttribute('paragraph', paragraph);
    newLi.setAttribute('lawLink', lawLink);
    newLi.setAttribute('paragraphLink', paragraphLink);
    
    var newHeading = document.createTextNode(paragraph);
    var newSubHeading = document.createTextNode(optionalText);
    var newBr = document.createElement("br");
    
    var newSubHeadingFont = document.createElement("font");
    newSubHeadingFont.setAttribute('class', 'subheading');
    newSubHeadingFont.appendChild(newSubHeading);
    
    newLi.appendChild(newHeading);
    newLi.appendChild(newBr);
    newLi.appendChild(newSubHeadingFont);
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

/*
function addLoaderToList(lId) {
    $.mobile.showPageLoadingMsg("c", "Lade...");
}

function removeLoaderFromList() {
	$.mobile.hidePageLoadingMsg();
}
*/

function addLoaderToList(lId) {
	var newLi = document.createElement("li");
	newLi.setAttribute('id', 'loadingList');
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

function addEntryToFavouritesList(lawName, lawLink){
    var newLi = document.createElement("li");
    newLi.setAttribute('class', 'favLawButton');
    newLi.setAttribute('lawName', lawName);
    newLi.setAttribute('lawLink', lawLink);
    
    var newLawHeading = document.createTextNode(lawName);
    var newLawLink = document.createElement("a");
    newLawLink.appendChild(newLawHeading);
    newLi.appendChild(newLawLink);
    $('#favouritesOverview').append(newLi);    
}

function addNextButtonToList(lId, caption) {
 	var newLi = document.createElement("li");
    newLi.setAttribute('id', 'nextButton');
    newLi.style.display = "block";
    
    var newCaption = document.createTextNode(caption);
    
    var newLink = document.createElement("a");
    newLink.setAttribute('data-role', 'button');
    newLink.setAttribute('data-icon', 'arrow-r');
    newLink.setAttribute('data-iconpos', 'right');
 
    newLink.appendChild(newCaption);
    newLi.appendChild(newLink);
   
    $('#'+lId).append(newLi);  
}

function addNavButtonsToParagraph(lId, prevListElement, nextListElement) {
	var newLi = document.createElement("li");
	var newDiv = document.createElement("div");
	newDiv.setAttribute('align', 'center');
	newDiv.setAttribute('data-role', 'controlgroup');
	newDiv.setAttribute('data-type', 'horizontal');
    
	if (typeof prevListElement !== 'undefined' && prevListElement.length > 0) {
    	var newCaption = document.createElement('BR');
    	var newLink = document.createElement("a");
    	newLink.setAttribute('id', 'prevButton');
    	newLink.setAttribute('data-role', 'button');
	    newLink.setAttribute('data-icon', 'arrow-l');
	    newLink.setAttribute('data-iconpos', 'left');
	    newLink.appendChild(newCaption);
    	newDiv.appendChild(newLink);
	}
	if (typeof nextListElement !== 'undefined' && nextListElement.length > 0) {
    	var newCaption = document.createElement('BR');
    	var newLink = document.createElement("a");
    	newLink.setAttribute('id', 'nextButton');
    	newLink.setAttribute('data-role', 'button');
	    newLink.setAttribute('data-icon', 'arrow-r');
	    newLink.setAttribute('data-iconpos', 'right');
	    newLink.appendChild(newCaption);
    	newDiv.appendChild(newLink);
	}

    newLi.appendChild(newDiv);
   
    $('#'+lId).append(newLi);
    $('#'+lId).trigger("create");
    
    $('#prevButton').click(function(){ prevListElement.trigger('click'); });
    $('#nextButton').click(function(){ nextListElement.trigger('click'); });
}

function bindButtonsAndEnterToSearch() {
	$('#titleSearchButton').click(function(){
		var searchtext = $('#title-search').attr("value");
		if(searchtext=="") {
			alert("Bitte Suchtext angegeben.");
		} else {
			$('#searchResult').empty();
			$.mobile.changePage('#searchResultDiv');
			fillSearchList("searchResult", "Titel_bmjhome2005", "and", searchtext);
		}
	});

	$('#title-search').live('keypress', function(e) {
	        if(e.keyCode==13){
				$('#titleSearchButton').trigger('click');
	        }
	});
	
	$('#textSearchButton').click(function(){
		var searchtext = $('#text-search').attr("value");
		if(searchtext=="") {
			alert("Bitte Suchtext angegeben.");
		} else {
			$('#searchResult').empty();
			$.mobile.changePage('#searchResultDiv');
			fillSearchList("searchResult", "Gesamt_bmjhome2005", "and", searchtext);
		}
	});
	
	$('#text-search').live('keypress', function(e) {
	        if(e.keyCode==13){
				$('#textSearchButton').trigger('click');
	        }
	});
	
	$('#directSearchButton').click(function(){
		var law = $('#law-search').attr("value");
		var paragraph = $('#paragraph-search').attr("value");
	                
		if(law=="") {
			alert("Bitte Gesetzeskürzel angegeben.");
		} else {
			findLawAndParagraph(law, paragraph);
		}
	});
	
	$('#law-search').live('keypress', function(e) {
	        if(e.keyCode==13){
				$('#directSearchButton').trigger('click');
	        }
	});
	
	$('#paragraph-search').live('keyup', function(e) {
	        if(e.keyCode==13){
				$('#directSearchButton').trigger('click');
	        }
	});
}