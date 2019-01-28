 exports.admin = function(req, res){ 		

 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');

 	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');

 	if(undefined != req.query.status){
 		var message = req.query.user + " is already member of " + req.query.status; 		
 	} 	

 	var fs = require('fs');
 	var content = fs.readFileSync(process.env.TOOLSTITCH_HOME + '/users/'+req.session.adminteam+'.txt');
 	var endOfLine = require('os').EOL;
 	var users = content.toString().replace('""',"").split(endOfLine+',');

 	if(req.session.role.indexOf('superadmin')>-1){
 		var superadmin = true;
 	}

 	res.render('admin', 
 		{ 
 			team: req.session.team, 
 			email: req.session.email, 
 			config: teamConfig,
 			message: message,
 			users : users, 
 			superadmin:superadmin
 		});
 };

 exports.addMember = function(req,res){

 	console.log("Adding memeber : " + req.query.email + ", isAdmin : " + req.query.isAdmin);

 	var endOfLine = require('os').EOL;

 	var role = 'member';
 	if(req.query.isAdmin == 'true'){
 		role = 'admin';
 	}
 	var lineToAdd = endOfLine + req.query.email + ',' + req.session.adminteam + ',' + role;

 	addUserIfNotAlreadyPresent(req.query.email, req, res, lineToAdd); 	

 }

 function addUserIfNotAlreadyPresent(email, req, res, lineToAdd){
 	var fs = require('fs');
 	var team = "";
 	fs.readdir(process.env.TOOLSTITCH_HOME + '/users/', function(err, files) {
 		console.log(files);

 		for (var i=0; i<files.length; i++) {
 			console.log("Searching " + files[i].toString());					
 			var userPresent = isUserInFile(files[i], email);			
 			if(userPresent){
 				console.log(email + " is already present in " + files[i]);
 				team = files[i].replace(".txt", "");
 				break;
 			}			
 		}
 		if(!userPresent){
 			console.log("User not already added, adding as a new user.")
 			fs.appendFile(process.env.TOOLSTITCH_HOME + '/users/'+req.session.adminteam+'.txt', lineToAdd, function (err) {
 				console.log("Added member : " + lineToAdd);
 				res.redirect('/admin');
 			});
 		}else{
 			res.redirect('/admin?status=' + team + '&user=' + email);
 		}
 	});	
 }

 function isUserInFile(filename, email){
 	var fs = require('fs');
 	var userPresent;
 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/users/'+filename);
 	var content = fs.readFileSync(process.env.TOOLSTITCH_HOME + '/users/'+filename);
 	var endOfLine = require('os').EOL;
 	var users = content.toString().split(endOfLine);
 	for(i in users) {
 		console.log("Reading users synchronously " + users[i]);
 		var parts = users[i].split(',');
 		console.log(parts[0]);
 		if(parts[0] == email){

 			console.log("Team ************* " + parts[1]);			
 			console.log(email + ' found in ' + filename);										
 			userPresent = true;
 			break;
 		}	
 	}
 	return userPresent;
 }

 exports.removeMember = function(req,res){

 	console.log("Request to remove member : " + req.query.email);

 	var fs = require('fs');
 	fs.readFile(process.env.TOOLSTITCH_HOME + '/users/'+req.session.adminteam+'.txt', function read(err, data) { 		
 		if (err) {
 			throw err;
 		}
 		var endOfLine = require('os').EOL;
 		var data_array = data.toString().split(endOfLine);
 		var lastIndex = getIndexOfLine(data_array, req.query.email);

 		console.log("Removing : " + lastIndex + data_array[lastIndex]);
 		delete data_array[lastIndex];

 		var updatedFile = data_array.join(endOfLine);

 		fs.writeFile(process.env.TOOLSTITCH_HOME + '/users/'+req.session.adminteam+'.txt', updatedFile, function read(err, data) { 		
 			console.log("Updated file after removing user");
 			removeEmptyLines(req, res); 			
 		});

 	});

 } 

 function removeEmptyLines(req, res){
 	var fs = require('fs');
 	fs.readFile(process.env.TOOLSTITCH_HOME + '/users/'+req.session.adminteam+'.txt', function read(err, data) { 		
 		var nonemptylines = [];
 		if (err) {
 			throw err;
 		}
 		var endOfLine = require('os').EOL;
 		var data_array = data.toString().split(endOfLine);
 		var j=0;
 		for (var i = 0; i < data_array.length; i++){ 			
 			if (!data_array[i].trim().length < 1){ 					
 				nonemptylines[j++] = data_array[i];
 			}
 		}

 		var nonemptylinesusers = nonemptylines.join(endOfLine); 		

 		fs.writeFile(process.env.TOOLSTITCH_HOME + '/users/'+req.session.adminteam+'.txt', nonemptylinesusers, function read(err, data) { 		
 			console.log("Updated file after removing user");
 			res.redirect('/admin');
 		});

 	});
 }

 function getIndexOfLine(data_array, email){
 	for (var i = data_array.length - 1; i > -1; i--){
 		// console.log("Line : " + data_array[i]);

 		if (data_array[i].indexOf(email) > -1){ 					
 			console.log("User found : " + data_array[i].toString());
 			return i;
 		}
 	}
 } 

 function deleteCachedFile(filePath){
 	var path = require('path');
 	// console.log(path.resolve(filePath));
 	delete require.cache[path.resolve(filePath)];
 };