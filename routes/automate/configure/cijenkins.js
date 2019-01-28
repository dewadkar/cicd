exports.init = function(req, res){
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
	var path = require('path');
	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team +'.json';
	var teamConfig = require(path.resolve(pathToJson)); 
	console.log("From : " + req.query.from);
	var from = req.query.from;
	//console.log(teamConfig);

	var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');

	var jenkinsPassword = teamConfig.pipeline[from].config.jenkins.password;

	cryptoutil.decrypt(jenkinsPassword, function(err, decryptedjenkinspassword) {
		jenkinsPassword = decryptedjenkinspassword;

		res.render('automate/configure/cijenkins', 
		{ 
			title: 'Devops pipeline as a service',
			email: req.session.email, 
			jenkinshost: teamConfig.pipeline[from].config.jenkins.serveruri,
			username: teamConfig.pipeline[from].config.jenkins.username,
			password: jenkinsPassword,
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
	
	teamConfig.pipeline[from].config.jenkins.serveruri = req.body.jenkinshost;
	teamConfig.pipeline[from].config.jenkins.username = req.body.jenkinsusername;
	teamConfig.pipeline[from].config.jenkins.password = req.body.jenkinspassword;

	var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');
	cryptoutil.encrypt(req.body.jenkinspassword, function(err, response) {
		teamConfig.pipeline[from].config.jenkins.password = response;
	});

	var fs = require('fs');
	fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
		if (err) return console.log(err);
	});
	
	res.redirect("/automate/"+req.body.from);

	//console.log(teamConfig);
	/*var jenkins=require('../../../lib/jenkins/jenkins');
	var jenkinshost=req.body.jenkinshost;
	var username=req.body.jenkinsusername;
	var password=req.body.jenkinspassword;
	jenkins.storeCredentials(jenkinshost,username,password,function(err,credentialId){
	  
	  if(err){
	    res.render('error/toolstitcherror', {
	      title: 'Devops pipeline as a service',
	      errortype: "process",
	      team: req.session.team,
	      email: req.session.email,
	      errmessage: "Error in creating credentials for jenkins, please check jenkins availability: " + err
	    });
	  }else{
	    
	    teamConfig.tools.jenkins.credentials[username]=credentialId;
	    var fs = require('fs')
	    
	    fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
	      if (err) return console.log(err)
	      console.log(JSON.stringify(teamConfig, null, 2))
	      console.log('writing to ' + teamConfig)
	    });
	    res.redirect("/automate/"+req.body.from);
	  }
	});*/

};

function deleteCachedFile(filePath){
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};

//exports.addCredentials=function(prop){
//  var crypto = require('crypto');
//
//  var username = prop.rtcUserid;
//  var password = prop.rtcPassword;
//  var hash = crypto.createHash('md5').update(username + password).digest('hex');
//  console.log(hash);
//
//  /*jshint multistr: true */
//  var reqData = '{"credentials":{"id":"' + hash + '","username":"' + username + '","scope":"GLOBAL", \
//  "stapler-class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","description":"Node Sample", \
//  "$class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","password":"' + password + '"}}';
//
//  request.post({
//  headers: {
//  'content-type' : 'application/x-www-form-urlencoded',
//  'Authorization': 'Basic ' + new Buffer("admin:webahead1").toString('base64')
//  },
//  url: prop.jenkinsHost+'/credential-store/domain/_/createCredentials',
//
//  body: 'json='+reqData
//  }, function(error, response, body){
//  console.log(body);
//  console.log(response.statusCode);
//  });

