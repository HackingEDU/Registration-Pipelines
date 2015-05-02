/*###################################
Anonymises data in CSV file
Currently using md5 hash on:
*first name, last name, email
###################################*/

//open("data/members_export_249995426d.csv");
open("Training-Day-report.csv"); 

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

function replaceAll(str, search, replace){
	if(typeof replace == 'undefined')
		replace = '';
  while(str.indexOf(search) != -1)
  	str = str.replace(search, replace);
  return str;
};

function process(results){
	console.log(results);
	var school = 'School';
	var school_col = -1;

	//getting the column numbers
	var header = results.data[0];
	for(i in header){
		console.log(header[i])
		if(header[i] == school){
			school_col = i;
		}
	}

	var rows = results.data
	var schools = {};
	for(var row = 1; row < rows.length; row++){
		var str = rows[row][school_col];
		if(typeof str != 'undefined'){
			str = str.toLowerCase();

			var toRemove = ['.', '-', 'of', 'college']
			for(i in toRemove){
				str = replaceAll(str, toRemove[i], '')
			}
			str = replaceAll(str, 'highschool', 'hs')
			str = replaceAll(str, 'high', 'hs')
			str = str.split('university')[0]
			str = str.split(',')[0]
			str = str.length >= 3 ? str : '';
			str = replaceAll(str, 'berkeley', 'b')
			str = replaceAll(str, 'davis', 'd')
			str = replaceAll(str, ' ', '')
			str = replaceAll(str, 'santacruz', 'sc')
			str = replaceAll(str, 'santabarbara', 'sb')
			str = replaceAll(str, 'sanjose', 'sj')
			str = replaceAll(str, 'sanfrancisco', 'sf')
			str = replaceAll(str, 'school', '')
			str = replaceAll(str, ' ', '')

		}

		if(str in schools){
			schools[str] = schools[str] + 1;
		}
		else{
			schools[str] = 1;
		}
	}

	//what to do to preserve the original names of the univesity?
	console.log(schools)
	console.log(Object.keys(schools).length);

	var sort = [];
	for(i in schools){
		sort.push(i + " : " + schools[i]);
	}
	sort = sort.sort();
	for(i in sort){
		console.log(sort[i])
	}

}