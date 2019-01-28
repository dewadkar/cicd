exports.init = function(req, res){
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
	var path = require('path');
	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
	var teamConfig = require(path.resolve(pathToJson));

	console.log("From : " + req.query.from);
	var from = req.query.from;

	var cryptoutil = require('../../../../lib/security/encrypt/cryptoutil');

	var bluemixPassword = teamConfig.pipeline[from].config.bluemix.password;

	cryptoutil.decrypt(bluemixPassword, function(err, decryptedbluemixpassword) {
		bluemixPassword = decryptedbluemixpassword;

		res.render('automate/configure/travisci/deploybluemix', { 
			title: 'Devops pipeline as a service',
			email: req.session.email,
			target: teamConfig.pipeline[from].config.bluemix.target,
			username: teamConfig.pipeline[from].config.bluemix.username,
			password: bluemixPassword,
			organization: teamConfig.pipeline[from].config.bluemix.organization,
			cloudSpace: teamConfig.pipeline[from].config.bluemix.cloudSpace,
			manifestFile: teamConfig.pipeline[from].config.bluemix.manifestFile,
			ignoreBluemix: teamConfig.pipeline[from].config.bluemix.ignore,
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
	var cryptoutil = require('../../../../lib/security/encrypt/cryptoutil');

	var teamConfig = require(path.resolve(pathToJson));

	teamConfig.pipeline[from].config.bluemix.configured = true;

	teamConfig.pipeline[from].config.bluemix.target = req.body.target;
	teamConfig.pipeline[from].config.bluemix.username = req.body.username;

	if (req.body.password) {
		cryptoutil.encrypt(req.body.password, function(err, encryptedpassword) {
			teamConfig.pipeline[from].config.bluemix.password = encryptedpassword;
		});
	}

	console.log("Ignore bluemix " + req.body.ignoreBluemix);
	
	if(req.body.ignoreBluemix){
		teamConfig.pipeline[from].config.bluemix.ignore = true;
	}else{
		teamConfig.pipeline[from].config.bluemix.ignore = false;
	}
	
	teamConfig.pipeline[from].config.bluemix.organization = req.body.organization;
	teamConfig.pipeline[from].config.bluemix.cloudSpace = req.body.cloudSpace;
	teamConfig.pipeline[from].config.bluemix.manifestFile = req.body.manifestFile;	

				var fs = require('fs');
				fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4),function(err) {
					if (err){           
						res.redirect("/automate/" + req.body.from + "?error=true");
					}else{
						console.log("Credentials added successfully to Jenkins.")
						console.log("Redirecting to automate");
						res.redirect("/automate/" + req.body.from);
					}    
				});				
};

function deleteCachedFile(filePath){
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};