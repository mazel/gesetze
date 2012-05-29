function showConnectionInfo() {
    if (typeof navigator != 'undefined' && typeof navigator.network != 'undefined') { 
        alert(navigator.network.connection.type); 
    } 
    if (typeof navigator == 'undefined'){ 
        alert("NAVIGATOR UNDEFINED"); 
    } 
    if (typeof navigator.network == 'undefined'){ 
        alert("NETWORK UNDEFINED"); 
    } 
    function checkConnection() {
        var networkState = navigator.network.connection.type;
        
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        
        alert('Connection type: ' + states[networkState]);
    }
    checkConnection();
}

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
                        addEntryToLawsList(lId, abbr, title, link);                 
                        //console.log(lId + ", " + abbr + ", " + "cache" + ", " + title + ", " + link);
                    }
                    $('.lawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink'), 0); });
                                      
                    //refresh listview for correct rendering
                    removeLoaderFromList();
                    
                    //check if list is empty
					if ($('#'+lId).children('li').length == 0) {
						addMessageToList(lId, "Keine Gesetze gefunden...");	
					}
                    
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
						link = link.substring(1, link.length);
						title = $(this).children('a').first().children('abbr').attr('title');
						abbr = $(this).children('a').first().children('abbr').text();
						addEntryToLawsList(lId, abbr, title, link);
                        saveLaw(char, abbr, title, link);                                       
                        // console.log(lId + ", " + abbr + ", " + "web" + ", " + title + ", " + link);
					});
					
					$('.lawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink'), 0); });
					
					//refresh listview for correct rendering
					removeLoaderFromList();
					
					//check if list is empty
					if ($('#'+lId).children('li').length == 0) {
						addMessageToList(lId, "Keine Gesetze gefunden...");
					}	
							
			    	$('#'+lId).listview("refresh");
                    },
                error: function(data) {
					addMessageToList(lId, "Keine Gesetze gefunden oder Verbindungsproblem...");					
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
                        addEntryToParagraphsList(lId, title, link, paragraphLink);
                        //console.log("Added Para "+lId+", "+title+", "+"cache"+", "+link+", "+paragraphLink);
                    }
                }
            $('.paragraphButton').tap(function(){ createParagraph($(this).attr('paragraph'), $(this).attr('lawLink'), $(this).attr('paragraphLink'), lawName, $(this).prevAll('.paragraphButton').first(), $(this).nextAll('.paragraphButton').first()); });
             
            //refresh listview for correct rendering
            removeLoaderFromList();
            
            //check if list is empty
			if ($('#'+lId).children('li').length == 0) {
				addMessageToList(lId, "Keine Paragraphen gefunden...");	
			}
            
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
                                    addEntryToParagraphsList(lId, title, link, paragraphLink);
                                    saveParagraph(lawName, title, link, paragraphLink, false);
                                    //console.log(lId + ", " + title + ", " + "ca/fav Icon" + ", " + link + ", " + paragraphLink);
                                } else {
                                    text = $(this).children('td').last().text();
                                    addSeperatorToList(lId, text);
                                    saveParagraph(lawName, text, "", "", true);
                                    //console.log("added sep" + lId + ", " + title + ", " + "ca/fav Icon" + ", " + link + ", " + paragraphLink);                            
                                }
                            });
                            
                            $('.paragraphButton').tap(function(){ createParagraph($(this).attr('paragraph'), $(this).attr('lawLink'), $(this).attr('paragraphLink'), lawName, $(this).prevAll('.paragraphButton').first(), $(this).nextAll('.paragraphButton').first()); });
                            
                            //refresh listview for correct rendering
                            removeLoaderFromList();
                            
                            //check if list is empty
							if ($('#'+lId).children('li').length == 0) {
								addMessageToList(lId, "Keine Paragraphen gefunden...");	
							}
							
                            $('#'+lId).listview("refresh");
                        },
                error: function(data) {
                            addMessageToList(lId, "Keine Paragraphen gefunden oder Verbindungsproblem...");					
                            //refresh listview for correct rendering
                            removeLoaderFromList();
                            $('#'+lId).listview("refresh");
                        }
            });
            
        }
    });
                     
}

function fillParagraph(title, lawLink, paragraphLink, lId, header, lawName, prevListElement, nextListElement) {
	$('#'+header).text(lawName + title);
	
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
                                             
                                             addNavButtonsToParagraph(lId, prevListElement, nextListElement);
                                             
                                             //refresh listview for correct rendering
                                             removeLoaderFromList();
                                             
                                             //check if list is empty
											if ($('#'+lId).children('li').length == 0) {
												addMessageToList(lId, "Paragraph leer...");	
											}
										
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
                                        
                                        addNavButtonsToParagraph(lId, prevListElement, nextListElement);
                                        
                                        //refresh listview for correct rendering
                                        removeLoaderFromList();
                                        
                                        //check if list is empty
										if ($('#'+lId).children('li').length == 0) {
											addMessageToList(lId, "Paragraph leer...");		
										}

                                        $('#'+lId).listview("refresh");
                                    },
                            error: function(data) {
                                        addMessageToList(lId, "Paragraph leer oder Verbindungsproblem...");	
                               
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
  
function fillSearchList(lId, config, method, words, optionalLink) {
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
	
	// http://www.gesetze-im-internet.de/cgi-bin/htsearch?config=Gesamt_bmjhome2005&method=and&words=b%FCrger+einkommen
	
	if (typeof optionalLink == 'undefined') {
		words = words.replace(" ", "+");
		words = escape(words);
		link = "/cgi-bin/htsearch?config="+config+"&method="+method+"&words="+words;
	} else {
		link = optionalLink;
	}
	
	$.ajax({ 
  		url: 'http://www.gesetze-im-internet.de'+link,
  		success: function(data) {
					//blockiert die gesamte app (javascript läuft in einem einzigen thread)
					$(data).find('#paddingLR12').find('dl').each(function() {
							link = $(this).children('dt').find('a').attr('href');
							title = $(this).children('dt').find('a').text();
							text = $(this).children('dd').text();
							
							if(title.search("Inhaltsverzeichnis")>0) {
								title = title.substring(0, title.lastIndexOf('-'));
								lawLink = link.substring(33, link.lastIndexOf('/')+1);
								addEntryToLawsList(lId, title, text, lawLink);
							} else if(title.search("Einzelnorm")>0) {
								lawLink = link.substring(33, link.lastIndexOf('/')+1);
								paragraphLink = link.substring(link.lastIndexOf('/')+1, link.length);
								addEntryToParagraphsList(lId, title, lawLink, paragraphLink, text);
							}
					});
					
					$('.lawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink')); });
					$('.paragraphButton').tap(function(){ createParagraph($(this).attr('paragraph'), $(this).attr('lawLink'), $(this).attr('paragraphLink'), ''); });
					
					//more results button
					if ( $(data).find('#paddingLR12').children('a').last().children('img').length > 0 ) {
						next = $(data).find('#paddingLR12').children('a').last().attr('href');
						addNextButtonToList(lId, "Weitere Treffer");
						$('#nextButton').tap(function(){ $('#nextButton').remove(); fillSearchList(lId, '', '', '', next); });
					}
					
					//refresh listview for correct rendering
					removeLoaderFromList();
					
					//check if list is empty
					if ($('#'+lId).children('li').length == 0) {
						addMessageToList(lId, "Keine Treffer...");		
					}
					
			    	$('#'+lId).listview("refresh");
				},
		error: function(data) {
					addMessageToList(lId, "Keine Treffer gefunden bzw. Verbindungsproblem...");					
					//refresh listview for correct rendering
					removeLoaderFromList();
			    	$('#'+lId).listview("refresh");
				}
	});
}

function findLawAndParagraph(law, paragraph) {
	// http://www.gesetze-im-internet.de/cgi-bin/htsearch?config=Gesamt_bmjhome2005&method=and&words=b%FCrger+einkommen
	
	words = law.replace(" ", "+");
	words = escape(words);
	link = "/cgi-bin/htsearch?config=Titel_bmjhome2005&method=and&words="+words;
	
	//suche nach kuerzel um link zum gesetz zu finden
	$.ajax({ 
  		url: 'http://www.gesetze-im-internet.de'+link,
  		success: function(data) {
					//blockiert die gesamte app (javascript läuft in einem einzigen thread)
					result = $(data).find('#paddingLR12').find('dl').first();
					link = result.children('dt').find('a').attr('href');
					title = result.children('dt').find('a').text();
							
					title = title.substring(0, title.lastIndexOf('-')-1);
					
					//vergleiche eingabe und suchtreffer
					if(title.toLowerCase()==law.toLowerCase()) {
						link = link.substring(33, link.lastIndexOf('/')+1);
						
						if(paragraph=="") {
							createParagraphsList(title+' ', link);
						} else {
							//versuche für $1 zu __1.html bzw. art_1.html zu verbinden
							$.ajax({ 
  								url: 'http://www.gesetze-im-internet.de'+link+'__'+paragraph+'.html',
  								success: function(data) {
  									createParagraph(paragraph, link, '__'+paragraph+'.html', title+' ');
  								},
								error: function(data) {
									$.ajax({ 
		  								url: 'http://www.gesetze-im-internet.de'+link+'art_'+paragraph+'.html',
		  								success: function(data) {
		  									createParagraph(paragraph, link, 'art_'+paragraph+'.html', title+' ');
		  								},
										error: function(data) {
											alert("Der angegebenen Paragraph konnte nicht gefunden werden.");
										}
									});
								}
							});
						}
						
					} else {
						alert("Zum angegebenen Kürzel konnte nichts gefunden werden.");
					}
				},
		error: function(data) {
					alert("Verbindungsproblem");		
				}
	});
}