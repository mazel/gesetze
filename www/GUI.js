function createLawsList(){
    // clear list
    $('#lawsOverview').empty();
    // add entrys 
    addSeperatorToList("lawsOverview", "B");
    addEntryToLawsList("lawsOverview", "BBergG", "ca/fav Icon", "Bundes Berg Gesetz", "#lawOverviewDiv", "BBergG");
    addEntryToLawsList("lawsOverview", "BBesG", "ca/fav Icon", "Bundes Besoldungs Gesetz", "#lawOverviewDiv", "BBesG");
    addEntryToLawsList("lawsOverview", "BGB", "ca/fav Icon", "Bürgerliches Gesetzbuch", "#lawOverviewDiv", "BGB");
    addSeperatorToList("lawsOverview", "C");
    addEntryToLawsList("lawsOverview", "ChemG", "ca/fav Icon", "Gesetz zum Schutz vor gefährlichen Stoffen...", "#lawOverviewDiv", "ChemG");
    addEntryToLawsList("lawsOverview", "ChemKostV", "ca/fav Icon", "Verordnung über Kosten für Amtshandlungen...", "#lawOverviewDiv", "ChemKostV");
    addSeperatorToList("lawsOverview", "D");
    addEntryToLawsList("lawsOverview", "DbAG", "ca/fav Icon", "Gesetz über den Ausgleich für Dienstbeschäd...", "#lawOverviewDiv", "DbAG");
    //$.mobile.changePage( "#lawsOverviewDiv");
}

function createParagraphsList(lawName){
    // clear list
    $('#lawOverview').empty();
    // add entrys 
    //...
    addSeperatorToList("lawOverview", "Kapitel 1");
    addEntryToParagraphsList("lawOverview", "Paragraph", "ca/fav Icon", "Bundes Berg Gesetz", "#paragraphsDiv", "BBergG");
}

function createParagraph(lawName, paragraphId){
    // clear list
    $('#paragraph').empty();
    // add entrys 
    //...
}

// function setTriggers(){
    //$('#lawsOverviewButton').tap(function(){ createLawsList(); });
//}

function addEntryToLawsList(lId, heading, state, subHeading, adress, linkId){
    //alert("wupp");
    var newLi = document.createElement("li");
    //newLi.setAttribute('class', 'arrow');
    newLi.setAttribute('id', linkId);
    var newLawHeading = document.createTextNode(heading);
    var newLawState = document.createTextNode(state);
    var newLawSubHeading = document.createTextNode(subHeading);
    var newBr = document.createElement("br");
    
    var newLawLink = document.createElement("a");
    newLawLink.setAttribute('href', adress);
    newLawLink.setAttribute('id', linkId);
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
    
    // create Trigger
    $('#'+linkId).tap(function(e){
                            $('#lawHeader').text(heading);
                            $('#paragraphHeader').text(heading);
                            //createParagraphsList(heading);
                        });
}


function addSeperatorToList(lId, sepName){
    var newLi = document.createElement("li");
    newLi.setAttribute('data-role', 'list-divider');
    var newSepName = document.createTextNode(sepName);
    newLi.appendChild(newSepName);
    $('#'+lId).append(newLi);
}


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
    $('#lawsOverviewButton').tap(function(){ createLawsList(); });
    
}
