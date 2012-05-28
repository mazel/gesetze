var db;
var shortName = 'Laws';
var version = '1.0';
var displayName = 'Laws';
var maxSize = 5242880;

var checkDBLawsLog = "wupp";

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
                   /*transaction.executeSql(
                                          'DROP TABLE sub_paragraphs;'
                                          );*/
                   transaction.executeSql(
                                          'CREATE TABLE IF NOT EXISTS laws ' +
                                          ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                                          ' first_letter TEXT NOT NULL, ' +
                                          ' name TEXT NOT NULL, ' +
                                          ' description TEXT NOT NULL, ' +
                                          ' link TEXT NOT NULL, ' +
                                          ' date DATE NOT NULL );'
                                          );
                   
                   transaction.executeSql(
                                          'CREATE TABLE IF NOT EXISTS paragraphs ' +
                                          ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                                          ' lawName TEXT NOT NULL, ' +
                                          ' name TEXT NOT NULL, ' +
                                          ' link TEXT, ' +
                                          ' p_link TEXT, ' +
                                          ' seperator BOOLEAN NOT NULL, ' +
                                          ' date DATE NOT NULL );'
                                          );
                   
                   transaction.executeSql(
                                          'CREATE TABLE IF NOT EXISTS sub_paragraphs ' +
                                          ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                                          ' lawName TEXT NOT NULL, ' +
                                          ' paragraph TEXT NOT NULL, ' +
                                          ' text TEXT NOT NULL, ' +
                                          ' date DATE NOT NULL );'
                                          );
                   
                   transaction.executeSql(
                                          'CREATE TABLE IF NOT EXISTS favourites ' +
                                          ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                                          ' lawName TEXT NOT NULL, ' +
                                          ' link TEXT NOT NULL );'
                                          );
                   
                   }
                   );
    console.log("LOG: Connected successful to DB '" + shortName + "'");
}

function saveLaw(first_letter, name, description, link){
    var date = new Date();
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'INSERT INTO laws (first_letter, name, description, link, date) VALUES (?, ?, ?, ?, ?);', 
                                          [first_letter, name, description, link, date], 
                                          doSomethingHandler, 
                                          errorHandler
                                          );
                   }
                   );
    //console.log("Law entry " + name + " saved");
}

function saveParagraph(lawName, name, link, p_link, seperator){
    var date = new Date();
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'INSERT INTO paragraphs (lawName, name, link, p_link, seperator, date) VALUES (?, ?, ?, ?, ?, ?);', 
                                          [lawName, name, link, p_link, seperator, date], 
                                          doSomethingHandler, 
                                          errorHandler
                                          );
                   }
                   );
    //console.log("Paragraph entry " + name + " saved");
}

function saveSubParagraph(lawName, paragraph, text){
    var date = new Date();
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'INSERT INTO sub_paragraphs (lawName, paragraph, text, date) VALUES (?, ?, ?, ?);', 
                                          [lawName, paragraph, text, date], 
                                          doSomethingHandler, 
                                          errorHandler
                                          );
                   }
                   );
    //console.log("SubParagraph ('" + paragraph + "') entry " + text + " saved");
}

function saveFavourite(){
    var lawName = document.getElementById('lawHeader').innerHTML;
    var link = document.getElementById('paragraphLi').getAttribute('lawLink');
    var favButton = document.getElementById('favButton');
    checkDBFavourites(lawName, function(result){
        if (result){
            // Remove Favourite
              db.transaction(
                             function(transaction) {
                             transaction.executeSql(
                                                    'DELETE FROM favourites WHERE lawName = ?;', [lawName],
                                                    function(transaction, result){ 
                                                    console.log("Favourite '" + lawName + "' removed");
                                                    favButton.setAttribute('style', 'color: #c7c7c7;');
                                                    }
                                                    )
                             }
                             );            
        } else {
            // Insert Favourite
            db.transaction(
                           function(transaction) {
                           transaction.executeSql(
                                                  'INSERT INTO favourites (lawName, link) VALUES (?, ?);', 
                                                  [lawName, "."+link], 
                                                  doSomethingHandler, 
                                                  errorHandler
                                                  );
                           }
                           );
            console.log("Favourite '" + lawName + "' saved");
            favButton.setAttribute('style', 'color: #f18b08;');
        }
    });
    $('#favouritesOverview').empty();
    fillFavouritesList();
}

/*function printLaws(transaction, result){
    for (var i=0; i < result.rows.length; i++) {
        var row = result.rows.item(i);
        console.log("Entry ID: " + row.id + ", " + row.name + " - " + row.name);
    }
    console.log("i= " + i + ", result rows length: " + result.rows.length);
}*/

/*function getLawByName(lawName, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT * FROM laws WHERE name = ? LIMIT 1;', [lawName],
                                          function(transaction, result){ 
                                          callBack(result.rows.item(0));
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}*/

function getLawsByFirst_Letter(first_letter, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT * FROM laws WHERE first_letter = ?;', [first_letter],
                                          function(transaction, result){ 
                                            callBack(result);
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}

function getParagraphsByLaw(lawName, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT * FROM paragraphs WHERE lawName = ?;', [lawName],
                                          function(transaction, result){ 
                                          callBack(result);
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}

function getSubParagraphsByLawAndParagraph(lawName, paragraph, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT text FROM sub_paragraphs WHERE lawName = ? AND paragraph = ?;', [lawName, paragraph],
                                          function(transaction, result){ 
                                          callBack(result);
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}

function getFavourites(callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT * FROM favourites ORDER BY lawName;', [],
                                          function(transaction, result){ 
                                          callBack(result);
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}

function checkDBLaws(first_letter, callBack){
    db.transaction(
                   function(transaction) {
                        transaction.executeSql(
                                          'SELECT name, date FROM laws WHERE first_letter = ? LIMIT 1;', [first_letter],
                                          function(transaction, result){ 
                                            var date = new Date();
                                            var time = date.getTime;
                                            for (var i=0; i < result.rows.length; i++) {
                                                var row = result.rows.item(i);
                                                var entryDate = new Date(row.date);
                                                time = entryDate.getTime();
                                                //console.log("name: " + row.name + time);
                                            }
                                          
                                          if(result.rows.length == 0 || (date.getTime() - time) > (1000*60*60*24*7)) {
                                                    db.transaction(
                                                                     function(transaction) {
                                                                     transaction.executeSql(
                                                                                            'DELETE FROM laws WHERE first_letter = ?;', [first_letter],
                                                                                            function(transaction, result){ 
                                                                                                console.log("cleared cache.");
                                                                                            }
                                                                                            )
                                                                     }
                                                                   );
                                                    console.log("Laws: no entries in DB or entries are not up to date.");
                                                    callBack(false);
                                           } else {
                                                console.log("Laws: entries in DB, entries are up to date.");
                                                callBack(true);
                                           }
                                          },
                                          errorHandler
                                          );
                    }
                   ); 
}

function checkDBParagraphs(lawName, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT name, date FROM paragraphs WHERE lawName = ? LIMIT 1;', [lawName],
                                          function(transaction, result){ 
                                              var date = new Date();
                                              var time = date.getTime;
                                              for (var i=0; i < result.rows.length; i++) {
                                              var row = result.rows.item(i);
                                              var entryDate = new Date(row.date);
                                              time = entryDate.getTime();
                                              //console.log("name: " + row.name + time);
                                          }
                                          
                                          if(result.rows.length == 0 || (date.getTime() - time) > (1000*60*60*24*7)) {
                                          db.transaction(
                                                         function(transaction) {
                                                         transaction.executeSql(
                                                                                'DELETE FROM paragraphs WHERE lawName = ?;', [lawName],
                                                                                function(transaction, result){ 
                                                                                console.log("cleared cache.");
                                                                                }
                                                                                )
                                                         }
                                                         );
                                          console.log("Paragraphs: no entries in DB or entries are not up to date.");
                                          callBack(false);
                                          } else {
                                          console.log("Paragraphs: entries in DB, entries are up to date.");
                                          callBack(true);
                                          }
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}

function checkDBSubParagraphs(lawName, paragraph, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT date FROM sub_paragraphs WHERE lawName = ? AND paragraph = ? LIMIT 1;', [lawName, paragraph],
                                          function(transaction, result){ 
                                              var date = new Date();
                                              var time = date.getTime;
                                              for (var i=0; i < result.rows.length; i++) {
                                              var row = result.rows.item(i);
                                              var entryDate = new Date(row.date);
                                              time = entryDate.getTime();
                                              //console.log("name: " + row.name + time);
                                          }
                                          
                                          if(result.rows.length == 0 || (date.getTime() - time) > (1000*60*60*24*7)) {
                                          db.transaction(
                                                         function(transaction) {
                                                         transaction.executeSql(
                                                                                'DELETE FROM sub_paragraphs WHERE lawName = ? AND paragraph = ?;', [lawName, paragraph],
                                                                                function(transaction, result){ 
                                                                                console.log("cleared cache.");
                                                                                }
                                                                                )
                                                         }
                                                         );
                                          console.log("SubParagraphs: no entries in DB or entries are not up to date.");
                                          callBack(false);
                                          } else {
                                          console.log("SubParagraphs: entries in DB, entries are up to date.");
                                          callBack(true);
                                          }
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}

function checkDBFavourites(lawName, callBack){
    db.transaction(
                   function(transaction) {
                   transaction.executeSql(
                                          'SELECT * FROM favourites WHERE lawName = ? LIMIT 1;', [lawName],
                                          function(transaction, result){ 
                                          if(result.rows.length == 0) {
                                          console.log("Favourite does not already exist.");
                                          callBack(false);
                                          } else {
                                          console.log("Favourite already exists.");
                                          callBack(true);
                                          }
                                          },
                                          errorHandler
                                          );
                   }
                   ); 
}




