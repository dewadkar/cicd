 var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');

 exports.init = function(req, res){
 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
 	var path = require('path');
 	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
 	var teamConfig = require(path.resolve(pathToJson));

 	console.log("From : " + req.query.from);
 	var from = req.query.from;

 	var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');

 	var ucdPassword = teamConfig.pipeline[from].config.ucd.password;

 	cryptoutil.decrypt(ucdPassword, function(err, decrypteducdpassword) {
 		ucdPassword = decrypteducdpassword;

 		res.render('automate/configure/deployucd', { 
 			title: 'Devops pipeline as a service',
 			email: req.session.email,
 			serveruri: teamConfig.pipeline[from].config.ucd.serveruri,
 			username: teamConfig.pipeline[from].config.ucd.username,
 			password: ucdPassword,
 			component: teamConfig.pipeline[from].config.ucd.component,
 			version: teamConfig.pipeline[from].config.ucd.version,
 			baseartifactdirectory: teamConfig.pipeline[from].config.ucd.baseartifactdirectory,
 			includeartifacts: teamConfig.pipeline[from].config.ucd.includeartifacts,		
 			process: teamConfig.pipeline[from].config.ucd.process,
 			application: teamConfig.pipeline[from].config.ucd.application,
 			environment: teamConfig.pipeline[from].config.ucd.environment,
 			ignoreUcd: teamConfig.pipeline[from].config.ucd.ignore,
 			from: req.query.from
 		});
 	}); 	
 };

 exports.submit = function(req, res){
 	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
 	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team +'.json';
 	var path = require('path');

 	console.log("From : " + req.body.from);
 	var from = req.body.from;
 	
 	var teamConfig = require(path.resolve(pathToJson)); 

 	teamConfig.pipeline[from].config.ucd.configured = true;

 	teamConfig.pipeline[from].config.ucd.serveruri = req.body.serveruri;
 	teamConfig.pipeline[from].config.ucd.username = req.body.username;
 	
 	if (req.body.password) {
 		cryptoutil.encrypt(req.body.password.trim(), function(err, encryptedpassword) {
 			teamConfig.pipeline[from].config.ucd.password = encryptedpassword;
 		});
 	}

 	console.log("Ignore ucd " + req.body.ignoreUcd);
 	
 	if(req.body.ignoreUcd){
 		teamConfig.pipeline[from].config.ucd.ignore = true;
 	}else{
 		teamConfig.pipeline[from].config.ucd.ignore = false;
 	}

 	teamConfig.pipeline[from].config.ucd.component = req.body.component;
 	teamConfig.pipeline[from].config.ucd.version = req.body.version;
 	teamConfig.pipeline[from].config.ucd.baseartifactdirectory = req.body.baseartifactdirectory;
 	teamConfig.pipeline[from].config.ucd.includeartifacts = req.body.includeartifacts;		
 	teamConfig.pipeline[from].config.ucd.process = req.body.process;
 	teamConfig.pipeline[from].config.ucd.application = req.body.application;
 	teamConfig.pipeline[from].config.ucd.environment = req.body.environment;

 	var fs = require('fs');
 	
 	fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
 		if (err) return console.log(err) 			
 		// console.log('writing to ' + teamConfig)
 	addServerInfoToJenkinsHome(req.body.serveruri, teamConfig, pathToJson, from);
 }); 	

 	res.redirect("/automate/"+req.body.from);
 };

 function addServerInfoToJenkinsHome(serveruri, teamConfig, pathToJson, from){

 	var request = require('request');

 	var filename = 'com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisher.xml';

 	// console.log(teamConfig);
 	/*var content = '<?xml version="1.0" encoding="UTF-8"?>\n\
 					<com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisherDescriptor plugin="moon-ucdeploy-publisher@1.2.7">\n\
  					<sites>\n\
    					<com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeploySite>\n\
      					<profileName>ucd-'+ teamConfig.team +'</profileName>\n\
      					<url>'+serveruri+'</url>\n\
      					<user></user>\n\
      					<password></password>\n\
    					</com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeploySite>\n\
  					</sites>\n\
  					</com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisherDescriptor>';*/

  					var content = '<com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisherDescriptor plugin=\\"moon-ucdeploy-publisher@1.2.7\\">\n\
  					<sites>\n\
  					<com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeploySite>\n\
  					<profileName>ucd-'+ teamConfig.team +'</profileName>\n\
  					<url>' + serveruri + '</url>\n\
  					<user></user>\n\
  					<password></password>\n\
  					</com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeploySite>\n\
  					</sites>\n\
  					</com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisherDescriptor>';

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