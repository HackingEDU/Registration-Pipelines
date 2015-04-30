/*###################################
Anonymises data in CSV file
Currently using md5 hash on:
*first name, last name, email
###################################*/

open("data/members_export_249995426d.csv");
open("data/MASTER_ACCEPTANCES.csv"); 

function open(fileName){
	var oReq = new XMLHttpRequest();
	oReq.onload = function(){ 
		papaParser(this.responseText); 
	};
	oReq.open("GET", fileName, true);
	oReq.send();
}

function papaParser(file){
	Papa.parse(file, {
		complete: function(data) {
			process(data)
		}
	});
}


function process(results){
	console.log(results);
	var email_address = 'Email Address';
	var email_col = -1;
	var first_name = 'First Name';
	var first_name_col = -1;
	var last_name = 'Last Name';
	var last_name_col = -1;

	//getting the column numbers
	var header = results.data[0];
	var breaker = 0;
	for(i in header){
		console.log(header[i])
		if(header[i] == email_address){
			email_col = i;
			breaker++;
		}
		if(header[i] == first_name){
			first_name_col = i;
			breaker++;
		}
		if(header[i] == last_name){
			last_name_col = i;
			breaker++;
		}
		if(breaker == 3){
			break;
		}
	}
	console.log(email_col, first_name_col, last_name_col);

	//going through the individual cells in the target columns
	var rows = results.data;
	for(var row = 1; row < rows.length; row++){
		if(typeof rows[row][email_col] != 'undefined')
			rows[row][email_col] = hex_md5(rows[row][email_col]);
		if(typeof rows[row][first_name_col] != 'undefined')
			rows[row][first_name_col] = hex_md5(rows[row][first_name_col]);
		if(typeof rows[row][last_name_col] != 'undefined')
			rows[row][last_name_col] = hex_md5(rows[row][last_name_col]);
	}
	console.log(results);

	//convertion to CSV
	exportToCsv('data.csv', results.data);
}

//Code from 'Xavier John' via Stack Overflow
//http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
//I added if statement to turn on and off downloading
function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += '|';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  if(false){//turn on and off downloading
	  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
	  if (navigator.msSaveBlob) { // IE 10+
	    navigator.msSaveBlob(blob, filename);
	  } else {
	    var link = document.createElement("a");
	    if (link.download !== undefined) { // feature detection
	      // Browsers that support HTML5 download attribute
	      var url = URL.createObjectURL(blob);
	      link.setAttribute("href", url);
	      link.setAttribute("download", filename);
	      link.style = "visibility:hidden";
	      document.body.appendChild(link);
	      link.click();
	      document.body.removeChild(link);
	    }
	  }
	}
}