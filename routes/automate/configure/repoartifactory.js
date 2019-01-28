exports.init = function(req, res){
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
	var path = require('path');
	var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
	var teamConfig = require(path.resolve(pathToJson));

	console.log("From : " + req.query.from);
	var from = req.query.from;

	res.render('automate/configure/repoartifactory', { 
		title: 'Devops pipeline as a service',
		email: req.session.email,
		serveruri: teamConfig.pipeline[from].config.artifactory.serveruri,
		username : teamConfig.pipeline[from].config.artifactory.username,		
		password: teamConfig.pipeline[from].config.artifactory.password,
		ignoreArtifactory: teamConfig.pipeline[from].config.artifactory.ignore,
		pomconfigured: teamConfig.pipeline[from].config.artifactory.pomconfigured,
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

	console.log("Ignore artifactory " + req.body.ignoreSonar);

	if(req.body.ignoreArtifactory){
		teamConfig.pipeline[from].config.artifactory.ignore = true;
	}else{
		teamConfig.pipeline[from].config.artifactory.ignore = false;
	}

	teamConfig.pipeline[from].config.artifactory.configured = true;

	teamConfig.pipeline[from].config.artifactory.serveruri = req.body.serveruri;
	teamConfig.pipeline[from].config.artifactory.username = req.body.username;	
	teamConfig.pipeline[from].config.artifactory.password = req.body.password;

	console.log("Ignore artifactory " + req.body.pomconfigured);

	if(req.body.pomconfigured){
		teamConfig.pipeline[from].config.artifactory.pomconfigured = true;
	}else{
		teamConfig.pipeline[from].config.artifactory.pomconfigured = false;
	}	

	var fs = require('fs');
	
	fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
		if (err) return console.log(err)	
			teamConfig.pipeline[from].config.artifactory.restartJenkins = true;	
		console.log("Adding artifactory server info");
			addArtifactoryServerInfoToJenkinsHome(req.body.serveruri, teamConfig, pathToJson, from);
			addSettingsXMLToJenkinsMavenHome(req.body.serveruri, teamConfig, pathToJson, from);
	});

	res.redirect("/automate/"+req.body.from);
};

function addArtifactoryServerInfoToJenkinsHome(serveruri, teamConfig, pathToJson, from){

	var request = require('request');

	var filename = 'org.jfrog.hudson.ArtifactoryBuilder.xml';

	var content = '<org.jfrog.hudson.ArtifactoryBuilder_-DescriptorImpl plugin=\\"artifactory@2.4.7\\"> \n\
					  <useCredentialsPlugin>false</useCredentialsPlugin> \n\
					  <artifactoryServers> \n\
					    <org.jfrog.hudson.ArtifactoryServer> \n\
					      <url>' + teamConfig.pipeline[from].config.artifactory.serveruri + '</url> \n\
					      <id>' + teamConfig.teamns + '-artifactory</id> \n\
					      <timeout>300</timeout> \n\
					      <bypassProxy>false</bypassProxy> \n\
					      <deployerCredentialsConfig> \n\
					        <credentials> \n\
					          <username></username> \n\
					          <password></password> \n\
					        </credentials> \n\
					        <credentialsId></credentialsId> \n\
					        <overridingCredentials>false</overridingCredentials> \n\
					      </deployerCredentialsConfig> \n\
					    </org.jfrog.hudson.ArtifactoryServer> \n\
					  </artifactoryServers> \n\
					</org.jfrog.hudson.ArtifactoryBuilder_-DescriptorImpl>';

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

function addSettingsXMLToJenkinsMavenHome(serveruri, teamConfig, pathToJson, from){

	var request = require('request');

	var filename = '.m2/settings.xml';

	var content = '<settings xsi:schemaLocation=\\"http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd\\" xmlns=\\"http://maven.apache.org/SETTINGS/1.1.0\\" xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\"> \n\
			  <servers> \n\
			    <server> \n\
			      <username>admin</username> \n\
			      <password>password</password> \n\
			      <id>central</id> \n\
			    </server> \n\
			    <server> \n\
			      <username>admin</username> \n\
			      <password>password</password> \n\
			      <id>snapshots</id> \n\
			    </server> \n\
			  </servers> \n\
			  <profiles> \n\
			    <profile> \n\
			      <repositories> \n\
			        <repository> \n\
			          <snapshots> \n\
			            <enabled>false</enabled> \n\
			          </snapshots> \n\
			          <id>central</id> \n\
			          <name>libs-release</name> \n\
			          <url>http://artifactory-' + teamConfig.teamns + '.ciodevcld.innovate.moon.com/artifactory/libs-release</url> \n\
			        </repository> \n\
			        <repository> \n\
			          <snapshots /> \n\
			          <id>snapshots</id> \n\
			          <name>libs-snapshot</name> \n\
			          <url>http://artifactory-' + teamConfig.teamns + '.ciodevcld.innovate.moon.com/artifactory/libs-snapshot</url> \n\
			        </repository> \n\
			      </repositories> \n\
			      <pluginRepositories> \n\
			        <pluginRepository> \n\
			          <snapshots> \n\
			            <enabled>false</enabled> \n\
			          </snapshots> \n\
			          <id>central</id> \n\
			          <name>plugins-release</name> \n\
			          <url>http://artifactory-' + teamConfig.teamns + '.ciodevcld.innovate.moon.com/artifactory/plugins-release</url> \n\
			        </pluginRepository> \n\
			        <pluginRepository> \n\
			          <snapshots /> \n\
			          <id>snapshots</id> \n\
			          <name>plugins-snapshot</name> \n\
			          <url>http://artifactory-' + teamConfig.teamns + '.ciodevcld.innovate.moon.com/artifactory/plugins-snapshot</url> \n\
			        </pluginRepository> \n\
			      </pluginRepositories> \n\
			      <id>artifactory</id> \n\
			    </profile> \n\
			  </profiles> \n\
			  <activeProfiles> \n\
			    <activeProfile>artifactory</activeProfile> \n\
			  </activeProfiles> \n\
			</settings>';

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