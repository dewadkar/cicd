 exports.index = function(req, res){ 	

 	//require() module caches file, so deleting the file so that changes to team.json can be reflected

 	teamName = req.session.team;
 	if (undefined !== req.query.teamToManage && req.query.teamToManage.trim().length > 0){
 		teamName = req.query.teamToManage;
 	}

 	if(undefined !== req.query.nsmessage){
 		var nsmessage = req.query.nsmessage;
 	}

 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+ teamName +'.json');
 	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+teamName+'.json');

 	var nschanged = teamConfig.teamns.indexOf('wwNAMESPACE') > -1;

 	req.session.teamns = teamConfig.teamns;

 	if(req.session.role.indexOf('admin')>-1){
 		var admin = true;
 	}

 	if(req.session.role.indexOf('superadmin')>-1){
 		var superadmin = true;
 		req.session.adminteam = teamName;
 	}

 	// console.log(teamConfig.team + ' ' + teamConfig.tools.jenkins.hosted + ' ' + teamConfig.tools.jenkins.url);
 	
 	res.render('devops', 
 	{ 
 		team: req.session.team, 
 		email: req.session.email, 
 		config: teamConfig,
 		nschanged : nschanged, 
 		nsmessage : nsmessage, 		
 		admin:admin,
 		superadmin:superadmin
 	});
 };

 exports.changeNamespace = function(req,res){ 	
 	var namespace = req.query.teamns; 	
 	updateNameSpaceIfAvailable(namespace, req, res); 	
 }

 function updateNameSpaceIfAvailable(namespace, req, res){
 	var fs = require('fs');
 	fs.readdir(process.env.TOOLSTITCH_HOME + '/teams/', function(err, files) {
 		// console.log(files);

 		for (var i=0; i<files.length; i++) {
 			// console.log("Searching " + files[i].toString());
 			var teamfile = files[i].toString();					
 			var namespacetaken = isnstaken(teamfile, namespace); 			
 			if(namespacetaken){
 				console.log(namespace + " is already present in " + files[i]); 				
 				break;
 			}			
 		}
 		if(!namespacetaken){
 			var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/'+ req.session.adminteam +'.json';
 			fs.readFile(pathToJson, 'utf8', function (err,data) {
 				if (err) {
 					return console.log(err);
 				}
 				var result = data.replace(/NAMESPACE/g, namespace);

 				fs.writeFile(pathToJson, result, 'utf8', function (err) {
 					if (err) return console.log(err);
 					console.log("Namespace " +  namespace + " updated by " + req.session.email + ' at ' + pathToJson);
 					console.log()
 					res.redirect('/devops');
 				});
 			});
 		}else{
 			res.redirect('/devops?nsmessage=' + namespace + " is already taken");
 		}
 	});	
}

function isnstaken(teamfileName, namespace){

	var fs = require('fs');
	var namespacetaken;
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+ teamfileName +'.json');
	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+ teamfileName);

	console.log("Comparing " + teamConfig.teamns + " : " + namespace);
	namespace = "ww" + namespace;
	if(teamConfig.teamns == namespace){
		return true;
	}else{
		return false;
	}
}

function deleteCachedFile(filePath){
	var path = require('path');
 	// console.log(path.resolve(filePath));
 	delete require.cache[path.resolve(filePath)];
 };