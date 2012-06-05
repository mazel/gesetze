$(document).bind("mobileinit", function(){
    //transitions nicht sauber auf android
    //$.mobile.defaultPageTransition = 'slide';
	//$.mobile.defaultDialogTransition = 'pop';
    
	$.mobile.defaultPageTransition = 'none';
	$.mobile.defaultDialogTransition = 'none';
	
	//erlaube cross-domain-calls
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	
	//deaktivieren von jquery mobile empfohlen
	$.mobile.pushStateEnabled = false;
	
});

