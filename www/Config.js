function initConfigs() {
	
	getSetting('caching', function(result){
		setCaching(result.rows.item(0).value);
	});
	
	getSetting('cachingDuration', function(result){
		setCachingDuration(result.rows.item(0).value);
	});
	
    $('.sizeButton').click(function(){
    	$.mobile.changePage('#configDiv');
    	setInterfaceSize($(this).attr('name'));
    });
    
    $('#cachingButton').click(function(){
    	getSetting('caching', function(result){
    		var caching = result.rows.item(0).value;
    		if (caching == 1) {
    			caching = 0;
    		} else {
    			caching = 1;
    		}
    		setCaching(caching);
    	});
    });
    
    $('.cachingDurationButton').click(function(){
    		setCachingDuration($(this).attr('name'));
    });
    
    $('#clearCacheButton').click(function(){
    	clearCacheTables();
    });
    
    $('#clearFavButton').click(function(){
    	clearFavTable();
    });
}

function setInterfaceSize(size) {
	var sizeText = new Array(4);
	sizeText[0] = "sehr klein";
	sizeText[1] = "klein";
	sizeText[2] = "normal";
	sizeText[3] = "groß";
	sizeText[4] = "sehr groß";
	
	var content = new Array(4);
	content[0] = "width=device-width, height=device-height, initial-scale=0.9, minimum-scale=0.8, maximum-scale=1.7, user-scalable=yes";
	content[1] = "width=device-width, height=device-height, initial-scale=1.0, minimum-scale=0.8, maximum-scale=1.7, user-scalable=yes";
	content[2] = "width=device-width, height=device-height, initial-scale=1.2, minimum-scale=0.8, maximum-scale=1.7, user-scalable=yes";
	content[3] = "width=device-width, height=device-height, initial-scale=1.4, minimum-scale=0.8, maximum-scale=1.7, user-scalable=yes";
	content[4] = "width=device-width, height=device-height, initial-scale=1.6, minimum-scale=0.8, maximum-scale=1.7, user-scalable=yes";

	if(size>=0 && size<5) {
		jQuery('#viewportMeta').attr('content',content[size]);
		$('#sizeText').text(sizeText[size]);
		saveSetting('size', size);
	}
}

function setCaching(caching) {
	var cachingText = new Array(4);
	cachingText[0] = "aus";
	cachingText[1] = "ein";
	
	$('#cachingText').text(cachingText[caching]);
	saveSetting('caching', caching);
}

function setCachingDuration(duration) {
	if(duration>0) {
		$('#cachingDurationText').text(duration + " Tage");
		saveSetting('cachingDuration', duration);
	}
}
