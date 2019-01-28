exports.init = function(req, res){
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
	var path = require('path');
	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
	var teamConfig = require(path.resolve(pathToJson));

	console.log("From : " + req.query.from);
	var from = req.query.from;

	res.render('automate/configure/codequality', { 
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
		if (err) return console.log(err)	
			teamConfig.pipeline[from].config.jenkins.restartJenkins = true;	
		console.log("Adding sonar server info");
			addSonarServerInfoToJenkinsHome(req.body.serveruri, teamConfig, pathToJson, from);
	});

	res.redirect("/automate/"+req.body.from);
};

function addSonarServerInfoToJenkinsHome(serveruri, teamConfig, pathToJson, from){

	var request = require('request');

	var filename = 'hudson.plugins.sonar.SonarPublisher.xml';

	var content = '<hudson.plugins.sonar.SonarPublisher_-DescriptorImpl plugin=\\"sonar@2.3\\">\n\
					  <installations>\n\
					    <hudson.plugins.sonar.SonarInstallation>\n\
					      <name>sonar-' + teamConfig.team + '</name>\n\
					      <disabled>false</disabled>\n\
					      <serverUrl>' + serveruri + '</serverUrl>\n\
					      <mojoVersion></mojoVersion>\n\
					      <databaseUrl></databaseUrl>\n\
					      <databaseLogin></databaseLogin>\n\
					      <additionalProperties></additionalProperties>\n\
					      <additionalAnalysisProperties></additionalAnalysisProperties>\n\
					      <triggers>\n\
					        <skipScmCause>false</skipScmCause>\n\
					        <skipUpstreamCause>false</skipUpstreamCause>\n\
					        <envVar></envVar>\n\
					      </triggers>\n\
					      <sonarLogin></sonarLogin>\n\
					      <databaseSecret>FlTuq7PiijOt6quwWRbvJg==</databaseSecret>\n\
					      <sonarSecret>FlTuq7PiijOt6quwWRbvJg==</sonarSecret>\n\
					    </hudson.plugins.sonar.SonarInstallation>\n\
					  </installations>\n\
					  <buildWrapperEnabled>false</buildWrapperEnabled>\n\
					</hudson.plugins.sonar.SonarPublisher_-DescriptorImpl>';

	var urlString = "http://dpev380.innovate.moon.com:3000/kubernetes/api/list/namespace/copyFileContent";

	request.post({
		headers : {
			'content-type' : 'application/json'
		},
		url : urlString,
		body:    { 
			"content": content,
			"namespace" : teamConfig.teamns,
			"filename" : filename
		},
		json : true
	}, function(error, response) {
		if (error) {
			console.log("Error : " + error + ", Response : " + response);				
		} else {
			var fs = require('fs');
			teamConfig.pipeline[from].config.jenkins.restartJenkins = true;
			fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
				if (err) return console.log(err)
					console.log("Jenkins restart flag marked true.");
			}); 
			console.log("Successfully made request to copy file. Response status code : " +  response.statusCode.toString());								
		}
	});
}

function deleteCachedFile(filePath){
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};