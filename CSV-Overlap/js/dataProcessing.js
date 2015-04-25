/*###################################
Prints out all the people who are signed up on eventbrite 
but not accepted
Fix to search the columns rather than manual input

Issues - inconsistant emails, first name only, incorrect spellings
->matching people is a pain
###################################*/

//open("data/members_export_249995426d.csv");//all the people confirmed on eventbrite
open("data/report-20150424-203143.csv"); //all ppl self transportation eventbrite confirmed
open("data/MASTER_ACCEPTANCES.csv");//all the people accepted

var numberOfFilesProcessed = 0;
var results = []

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
			results.push(data)
			numberOfFilesProcessed++;
			if(numberOfFilesProcessed == 2){
				process();
			}
		}
	});
}


function clean(str){
	return str.toLowerCase().replace(' ', '');
}

function process(){
	var confirmed = results[0].data;
	var accepted = results[1].data;

	var accepted_email_list = []
	var accepted_name_list = []
	for(p in accepted){
		try{
			accepted_name_list.push(clean(accepted[p][1]) + clean(accepted[p][2]));
		}catch(error){
			console.log(error);
		}
		try{
			accepted_email_list.push(clean(accepted[p][0]).split('@')[0]);
		}catch(error){
			console.log(error);
		}
	}

	var count = 0;
	var rejected = []

	for(p in confirmed){
		var target_name = ''
		try{
			target_name = clean(confirmed[p][2]) + clean(confirmed[p][3]);
		}catch(error){
			console.log(error);
		}
		try{
			target_email = clean(confirmed[p][4]).split('@')[0];
		}catch(error){
			console.log(error);
		}
		//super inefficient fix later
		if(accepted_name_list.indexOf(target_name) < 0 && accepted_email_list.indexOf(target_email) < 0){
			rejected.push(confirmed[p][2] + " " + confirmed[p][3])
			//console.log(confirmed[p][2] + "," + confirmed[p][3] +"," + confirmed[p][4])
			console.log(confirmed[p][4])

			count++
		}
	}
	console.log(rejected.sort())
	console.log(count)
}