function fillLawsList(char, lId, header, address) {
	$('#'+header).text("Gesetze - "+char);
	
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
    
	//Check Cache
    checkDBLaws(char, function(inCache){
        console.log("inCache:" + inCache);
        if(inCache){
            console.log("Filling List from Cache.");
                //alert("Filling List from Cache.");
                getLawsByFirst_Letter(char, function(result){
                    for (var i=0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
            
                        link = row.link;
                        title = row.description;
                        abbr = row.name;
                        addEntryToLawsList(lId, abbr, "cache", title, link);                 
                        //console.log(lId + ", " + abbr + ", " + "cache" + ", " + title + ", " + link);
                    }
                    $('.lawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink'), 0); });
                                      
                    //refresh listview for correct rendering
                    removeLoaderFromList();
                    $('#'+lId).listview("refresh");
                });
        } else {
            console.log("Filling List from Web.");
                $.ajax({
                url: 'http://www.gesetze-im-internet.de/Teilliste_'+char+'.html',
                success: function(data) {
					//blockiert die gesamte app (javascript läuft in einem einzigen thread)
					$(data).find('#paddingLR12').find('p').each(function() {
						//second <a>-tag contains link to pdf
						link = $(this).children('a').first().attr('href');
						title = $(this).children('a').first().children('abbr').attr('title');
						abbr = $(this).children('a').first().children('abbr').text();
						addEntryToLawsList(lId, abbr, "web", title, link);
                        saveLaw(char, abbr, title, link);                                       
                        // console.log(lId + ", " + abbr + ", " + "web" + ", " + title + ", " + link);
					});
					
					$('.lawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink'), 0); });
					
					//refresh listview for correct rendering
					removeLoaderFromList();
			    	$('#'+lId).listview("refresh");
                    },
                error: function(data) {
					addMessageToList(lId, "Keine Gesetze gefunden bzw. Verbindungsproblem...");					
					//refresh listview for correct rendering
					removeLoaderFromList();
			    	$('#'+lId).listview("refresh");
				}
                });    
        }
    }
    );
    

}

function fillParagraphsList(lawName, link, lId, header, address) {
	$('#'+header).text(lawName);
    //checkDBFavourite(lawName);
	
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
	
	link = link.substring(1, link.length);
    
    //Check Cache
    checkDBParagraphs(lawName, function(inCache){
        console.log("inCache:" + inCache);
        if(inCache){
            console.log("Filling List from Cache.");
            getParagraphsByLaw(lawName, function(result){
                for (var i=0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    title = row.name;
                    paragraphLink = row.p_link;
                    if(row.seperator=="true"){
                        addSeperatorToList(lId, title);
                        //console.log("added Sep "+lId+", "+title);
                    } else {
                        addEntryToParagraphsList(lId, title, "cache", link, paragraphLink);
                        //console.log("Added Para "+lId+", "+title+", "+"cache"+", "+link+", "+paragraphLink);
                    }
                }
            $('.paragraphButton').tap(function(){ createParagraph($(this).attr('paragraph'), $(this).attr('lawLink'), $(this).attr('paragraphLink'), lawName); });
             
            //refresh listview for correct rendering
            removeLoaderFromList();
            $('#'+lId).listview("refresh");                               
            });

                     
        } else {
            console.log("Filling List from Web.");  
            $.ajax({ 
                url: 'http://www.gesetze-im-internet.de'+link,
                success: function(data) {
                            //blockiert die gesamte app (javascript läuft in einem einzigen thread)
                            $(data).find('#paddingLR12').find('tr').each(function() {
                                if($(this).children('td').length == 3) {
                                    title = $(this).children('td').last().text();
                                    paragraphLink = $(this).children('td').last().children('a').attr('href');
                                    addEntryToParagraphsList(lId, title, "web", link, paragraphLink);
                                    saveParagraph(lawName, title, link, paragraphLink, false);
                                    //console.log(lId + ", " + title + ", " + "ca/fav Icon" + ", " + link + ", " + paragraphLink);
                                } else {
                                    text = $(this).children('td').last().text();
                                    addSeperatorToList(lId, text);
                                    saveParagraph(lawName, text, "", "", true);
                                    //console.log("added sep" + lId + ", " + title + ", " + "ca/fav Icon" + ", " + link + ", " + paragraphLink);                            
                                }
                            });
                            
                            $('.paragraphButton').tap(function(){ createParagraph($(this).attr('paragraph'), $(this).attr('lawLink'), $(this).attr('paragraphLink'), lawName); });
                            
                            //refresh listview for correct rendering
                            removeLoaderFromList();
                            $('#'+lId).listview("refresh");
                        },
                error: function(data) {
                            addMessageToList(lId, "Keine Paragraphen gefunden bzw. Verbindungsproblem...");					
                            //refresh listview for correct rendering
                            removeLoaderFromList();
                            $('#'+lId).listview("refresh");
                        }
            });
            
        }
    });
                     
}

function fillParagraph(title, lawLink, paragraphLink, lId, header, lawName) {
	$('#'+header).text(title);
	
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
	
	var link = lawLink.substring(lawLink.indexOf('/'), lawLink.lastIndexOf('/')+1)+paragraphLink;
	
    //Check Cache
    checkDBSubParagraphs(lawName, title, function(inCache){
                      console.log("inCache:" + inCache);
                      if(inCache){
                          console.log("Filling List from Cache.");
                          getSubParagraphsByLawAndParagraph(lawName, title, function(result){
                                             for (var i=0; i < result.rows.length; i++) {
                                                 var row = result.rows.item(i);
                                                 text = row.text;
                                                 addEntryToParagraph(lId, text);
                                                 //console.log("Added SubPara from Cache: " +text);
                                             }
                                             
                                             //refresh listview for correct rendering
                                             removeLoaderFromList();
                                             $('#'+lId).listview("refresh");
                                        });
                          
                      } else {
                        console.log("Filling List from Web.");
                        $.ajax({ 
                            url: 'http://www.gesetze-im-internet.de'+link,
                            success: function(data) {
                                        //blockiert die gesamte app (javascript läuft in einem einzigen thread)
                                        $(data).find('div.jurAbsatz').each(function() {
                                            entry = $(this).text();
                                            addEntryToParagraph(lId, entry);
                                            saveSubParagraph(lawName, title, entry);                               
                                            //console.log("title: " + title + ", lawLink: " + lawLink + ", paragraphLink: " + paragraphLink + ", lId: " + lId + ", header: " + header + ", lawName: " + lawName);
                                        });
                                        
                                        //refresh listview for correct rendering
                                        removeLoaderFromList();
                                        $('#'+lId).listview("refresh");
                                    },
                            error: function(data) {
                                        addMessageToList(lId, "Keine Paragraph gefunden bzw. Verbindungsproblem...");	
                               
                                        //refresh listview for correct rendering
                                        removeLoaderFromList();
                                        $('#'+lId).listview("refresh");
                                    }
                        });
                    }
                });
}

function fillFavouritesList(){
    addLoaderToList("favouritesOverview");	
	$('#favouritesOverview').listview("refresh");
    console.log("Getting favourites from DB.");
    var lawName, link;
    getFavourites(function(result){
              for (var i=0; i < result.rows.length; i++) {
                  var row = result.rows.item(i);
                  lawName = row.lawName;
                  link = row.link;
                  addEntryToFavouritesList(lawName, link);
                  console.log("Added Favourite from DB: " + lawName);
              }
                  removeLoaderFromList();
                  $('#favouritesOverview').listview("refresh");
                  $('.favLawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink'), 1); });
    });    
}