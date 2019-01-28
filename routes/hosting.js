exports.hostTool = function(req, res){
	var tool = req.query.tool;
	console.log("Hosting " + tool);
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 	
	var hosttool=require('../lib/hosttool');
	var data={"toolname":req.query.tool,"teamname":req.session.team};
	var namespace = req.session.teamns;
	hosttool.host(data, namespace, function(err,result){
	  res.send("Hosting status for " + result);
	});
};

exports.destroyTool = function(req, res){
	var tool = req.query.tool;
	console.log("Destroying " + tool);
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 
	var decommisionar=require('../lib/decommisionar');
	decommisionar.decommision(teamName,tool,instance,function(err,result){
	  res.send("Hosting status for " + tool);
	})
};

function deleteCachedFile(filePath){
	var path = require('path');
	console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};