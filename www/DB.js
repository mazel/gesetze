var db;
var shortName = 'Laws';
var version = '1.0';
var displayName = 'Laws';
var maxSize = 5242880;

function errorHandler(transaction, error) {
    alert('Error '+error.message+' (Code '+error.code+')');
    return true; // causes a rollback of the transaction
}

function doSomethingHandler(transaction, results) {
    //
}

function connectToDb(){
    db = openDatabase(shortName, version, displayName, maxSize);
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'CREATE TABLE IF NOT EXISTS laws ' +
                                          ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                                          ' shortcut TEXT NOT NULL, ' +
                                          ' name TEXT NOT NULL );'
                                          );
                   }
                   );
    console.log("LOG: Connected successful to DB '" + shortName + "'");
}

function insertLaw(shortcut, name){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'INSERT INTO laws (shortcut, name) VALUES (?,?);', 
                                          [shortcut, name], 
                                          doSomethingHandler, 
                                          errorHandler
                                          );
                   }
                   );
    console.log("LOG: Law entry " + shortcut + " saved");
}

function printLaws(transaction, result){
    for (var i=0; i < result.rows.length; i++) {
        var row = result.rows.item(i);
        console.log("Entry ID: " + row.id + ", " + row.shortcut + " - " + row.name);
    }
}

function getLawByShortcut(shortcut){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT * FROM laws WHERE shortcut = ?;', [shortcut],
                                          printLaws, 
                                          errorHandler
                                          );
                   }
                   );
    /**/
    console.log("LOG: Entry printed");  
}



