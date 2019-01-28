exports.select = function(req, res){

  if(req.session.role.indexOf('admin')>-1){
    var admin = true;
  }

  if(req.session.role.indexOf('superadmin')>-1){
    var superadmin = true;    
  }

  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 	
  res.render('automate/selectpattern.ejs', { 
    team: req.session.team, 
    email: req.session.email , 
    config: teamConfig, 
    admin:admin, 
    superadmin:superadmin
  });
}

exports.pattern1 = function(req, res){
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 
  var from = "pattern1";
  var jobURL = 	teamConfig.pipeline[from].config.jenkins.serveruri + "job/" + from + "-" + teamConfig.team;
	res.render('patterns/pattern1.ejs', { team: req.session.team, email: req.session.email , jobURL: jobURL, config: teamConfig});
}

exports.pattern2 = function(req, res){
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 
  var from = "pattern2";
  var jobURL =  teamConfig.pipeline[from].config.jenkins.serveruri + "job/" + from + "-" + teamConfig.team;
  res.render('patterns/pattern2.ejs', { team: req.session.team, email: req.session.email , jobURL: jobURL, config: teamConfig});
}

exports.pattern3 = function(req, res){
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');   
  res.render('patterns/pattern3.ejs', { team: req.session.team, email: req.session.email , config: teamConfig});
}


exports.pattern4 = function(req, res){
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');   
  res.render('patterns/pattern4.ejs', { team: req.session.team, email: req.session.email , config: teamConfig});
}

exports.pattern5 = function(req, res){
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');   
  var from = "pattern5";
  var jobURL =  teamConfig.pipeline[from].config.jenkins.serveruri + "job/" + from + "-" + teamConfig.team;
  res.render('patterns/pattern5.ejs', { team: req.session.team, email: req.session.email , jobURL: jobURL, config: teamConfig});
}

exports.pattern10 = function(req, res){
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');   
  var from = "pattern10";
  var jobURL =  teamConfig.pipeline[from].config.jenkins.serveruri + "job/" + from + "-" + teamConfig.team;
  res.render('patterns/pattern10.ejs', { team: req.session.team, email: req.session.email , jobURL: jobURL, config: teamConfig});
}

exports.pattern15 = function(req, res){
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');   
  var from = "pattern15";
  var jobURL =  teamConfig.pipeline[from].config.jenkins.serveruri + "job/" + from + "-" + teamConfig.team;
  res.render('patterns/pattern15.ejs', { team: req.session.team, email: req.session.email , jobURL: jobURL, config: teamConfig});
}

function deleteCachedFile(filePath){
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};