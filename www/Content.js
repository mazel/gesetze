function fillLawsList(char, lId, header, address) {
	$('#'+header).text("Gesetze - "+char);
	
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
	
	$.ajax({
  		url: 'http://www.gesetze-im-internet.de/Teilliste_'+char+'.html',
  		success: function(data) {
					//blockiert die gesamte app (javascript läuft in einem einzigen thread)
					$(data).find('#paddingLR12').find('p').each(function() {
						//second <a>-tag contains link to pdf
						link = $(this).children('a').first().attr('href');
						title = $(this).children('a').first().children('abbr').attr('title');
						abbr = $(this).children('a').first().children('abbr').text();
						addEntryToLawsList(lId, abbr, "ca/fav Icon", title, link);
					});
					
					$('.lawButton').tap(function(){ createParagraphsList($(this).attr('lawName'), $(this).attr('lawLink')); });
					
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

function fillParagraphsList(lawName, link, lId, header, address) {
	$('#'+header).text(lawName);
	
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
	
	link = link.substring(1, link.length);
	
	$.ajax({ 
  		url: 'http://www.gesetze-im-internet.de'+link,
  		success: function(data) {
					//blockiert die gesamte app (javascript läuft in einem einzigen thread)
					$(data).find('#paddingLR12').find('tr').each(function() {
						if($(this).children('td').length == 3) {
							title = $(this).children('td').last().text();
							paragraphLink = $(this).children('td').last().children('a').attr('href');
							addEntryToParagraphsList(lId, title, "ca/fav Icon", link, paragraphLink);
						} else {
							text = $(this).children('td').last().text();
							addSeperatorToList(lId, text);
						}
					});
					
					$('.paragraphButton').tap(function(){ createParagraph($(this).attr('paragraph'), $(this).attr('lawLink'), $(this).attr('paragraphLink')); });
					
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

function fillParagraph(title, lawLink, paragraphLink, lId, header) {
	$('#'+header).text(title);
	
	addLoaderToList(lId);	
	$('#'+lId).listview("refresh");
	
	var link = lawLink.substring(lawLink.indexOf('/'), lawLink.lastIndexOf('/')+1)+paragraphLink;
	
	$.ajax({ 
  		url: 'http://www.gesetze-im-internet.de'+link,
  		success: function(data) {
					//blockiert die gesamte app (javascript läuft in einem einzigen thread)
					$(data).find('div.jurAbsatz').each(function() {
						entry = $(this).text();
						addEntryToParagraph(lId, entry);
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