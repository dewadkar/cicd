exports.init = function(req, res){
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
	var path = require('path');
	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
	var teamConfig = require(path.resolve(pathToJson));

	console.log("From : " + req.query.from);
	var from = req.query.from;

	res.render('automate/configure/travisci/codequality', { 
		title: 'Devops pipeline as a service',
		email: req.session.email,
		language : teamConfig.pipeline[from].config.sonar.language,
		serveruri: teamConfig.pipeline[from].config.sonar.serveruri,
		sourcefolder: teamConfig.pipeline[from].config.sonar.sourcefolder,
		ignoreSonar: teamConfig.pipeline[from].config.sonar.ignore,
		from: req.query.from
	});
};

exports.submit = function(req, res){

	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team +'.json';
	var path = require('path');

	console.log("From : " + req.body.from);
	var from = req.body.from;
	
	var teamConfig = require(path.resolve(pathToJson));

	console.log("Ignore sonar " + req.body.ignoreSonar);

	if(req.body.ignoreSonar){
		teamConfig.pipeline[from].config.sonar.ignore = true;
	}else{
		teamConfig.pipeline[from].config.sonar.ignore = false;
	}

	teamConfig.pipeline[from].config.sonar.configured = true;

	teamConfig.pipeline[from].config.sonar.language = req.body.language;
	teamConfig.pipeline[from].config.sonar.serveruri = req.body.serveruri;
	teamConfig.pipeline[from].config.sonar.sourcefolder = req.body.sourcefolder;

	var fs = require('fs');
	
	fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
		if (err){
		  return console.log(err)	
		}else{
		  console.log("Adding sonar server info");
		  res.redirect("/automate/"+req.body.from);
		}
	});

};


function deleteCachedFile(filePath){
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};