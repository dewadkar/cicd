 exports.superadmin = function(req, res){ 		

 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
 	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 	
console.log("Team config "+teamConfig);
 	if(req.session.role.indexOf('superadmin')<0){
 		redirect("/devops");
 	}

 	req.session.team = req.session.superadminteam;

 	var fs = require('fs');
 	fs.readdir(process.env.TOOLSTITCH_HOME + '/users/', function(err, files) {
 		res.render('superadmin', { team: req.session.team, email: req.session.email , config: teamConfig,teams : files});
 	});
 	
 };

 exports.manageUsers = function(req, res){

 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
 	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 	

 	req.session.adminteam = req.query.teamToManage;
 	res.redirect('/admin');
 	
 };

 exports.addTeam = function(req,res){

 	var fs = require('fs');

 	fs.writeFile(process.env.TOOLSTITCH_HOME + '/users/' + req.query.team + ".txt", "", function(err) {
 		if(err) {
 			return console.log(err);
 		}
 		console.log("Team " + req.query.team + "has been created.");
 		addTeamConfig(req.query.team, res); 		
 	}); 
 }

 function addTeamConfig(team, res){
 	var fs = require('fs');
 	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + team + '.json';
 	// fs.createReadStream('template.json').pipe(fs.createWriteStream(pathToJson)); 	
 	copyTemplate('template.json', pathToJson, addTeamData, team, res)

 }

 function addTeamData(team, res){
 	var fs = require('fs');
 	var path = require('path');

 	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + team + '.json';
 	var teamConfig = require(path.resolve(pathToJson));    

 	teamConfig.team = team;

 	fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
 		if (err) return console.log(err) 		

 			console.log('writing to ' + pathToJson)
 	});

 	res.redirect("/admin/superadmin"); 	
 }

 function copyTemplate(from, to, callback, team, res){

 	var cleanup = function(){
 		dest.removeListener('finish', finish);
 		dest.removeListener('error', error);
 		src.removeListener('error', error);
 	};
 	var finish = function(){
 		cleanup();
 		callback(team, res);
 	};
 	var error = function(err){
 		cleanup();
 		// callback(err);
 	};

 	var fs = require('fs');

 	var src = fs.createReadStream(from);
 	var dest = fs.createWriteStream(to);

 	dest.addListener('finish', finish);
 	dest.addListener('error', error);
 	src.addListener('error', error);

 	src.pipe(dest);
 };

 exports.switchToTeam = function(req,res){
 	req.session.team = req.query.teamToManage;
 	res.redirect("/devops?teamToManage=" + req.query.teamToManage);
 }

 exports.removeTeam = function(req,res){

 	var fs = require('fs'); 	

 	var userFile = process.env.TOOLSTITCH_HOME + '/users/' + req.query.teamToRemove + ".txt";
 	var teamFile = process.env.TOOLSTITCH_HOME + '/teams/' + req.query.teamToRemove + ".json";


 	fs.stat(userFile, function(err, stats) {    
 		if (err) {
 			console.log("File " + teamFile + " not exist"); 			
 		}else {				      
 			fs.unlink(userFile); 			
 			console.log("Deleting " + userFile);	 			
 		}
 		fs.stat(teamFile, function(err, stats) {    
 			if (err) {
 				console.log("File " + teamFile + " does not exist"); 			
 				res.redirect("/admin/superadmin");
 			} else {				      
 				fs.unlink(teamFile); 			
 				console.log("Deleting " + teamFile);
 				res.redirect("/admin/superadmin");
 			}
 		});	
 	}); 	
}


function deleteCachedFile(filePath){
	var path = require('path');
 	// console.log(path.resolve(filePath));
 	delete require.cache[path.resolve(filePath)];
 };