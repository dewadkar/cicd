
exports.saveBuildStep = function(req, res){

	var gitHTTPURL=req.query.giturl;
	console.log(gitHTTPURL);

	var buildsteps = req.query.buildsteps;
	console.log(buildsteps);

	var path=require('path');
	
	var fs = require('node-fs');

	var repoDirFullPath = req.session.repoDirFullPath;
	var configFilePath = repoDirFullPath + "toolstitch.config";

	console.log("Config file path : " + configFilePath + " Full path : " + repoDirFullPath);

	var EOL = require('os').EOL;
	var buildStepsWithNewline = buildsteps.replace(/\r\n|\r|\n/g,EOL);
	console.log("Blah " + buildStepsWithNewline);

	fs.mkdir(repoDirFullPath, 0777, true, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('Directory ' + repoDirFullPath + ' created.');
			
			fs.writeFile(configFilePath, buildStepsWithNewline, function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The config file was saved!");
			}); 
		}
	});

	res.writeHead(200,{"Content-Type" : "text/html"});
	res.write(buildsteps);
	res.end("");
};

exports.viewBuildStep = function(req,res){
	var path=require('path');
	console.log(req.query.giturl);
	var repoDir = getRepoDir(req.query.giturl);
	
	var repoDirFullPath = path.join(__dirname, repoDir);
	req.session.repoDir = repoDir;
	req.session.repoDirFullPath = repoDirFullPath;
	console.log("repoDir : " + repoDir);
	console.log("repoDirFullPath : " + repoDirFullPath);

	var fs = require('fs');
	var text = " ";
	fs.readFile(repoDirFullPath + "/toolstitch.config", {encoding: 'utf-8'}, function(err,data){
		if (!err){
			text = data;
			console.log('received data: ' + data);
		}else{
			console.log("Not found " + repoDirFullPath);
		}
		res.writeHead(200,{"Content-Type" : "text/html"});
		res.write(text);
		res.end(" ");
	});
};

function getRepoDir(gitHttpURL){
	var path=require('path');
	var tempURL = gitHttpURL.replace("https://github.moon.com/",":");
	var giturl = "git@github.moon.com" + tempURL + '.git';
	var dirPart = path.dirname(giturl);

	var repositoryName = path.basename(giturl,'.git');
	console.log("Repository : " + repositoryName);

	var usernameOrOrg = dirPart.substring(dirPart.indexOf(":") + 1);
	console.log("Username : " + usernameOrOrg);

	var repoDir = "../" + usernameOrOrg + "/" + repositoryName + "/";

	return repoDir;	
}