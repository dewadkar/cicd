exports.setuppipeline = function(req, res) {
  deleteJobThenCreateJob(req, res);  
};

function deleteJobThenCreateJob(req, res){

  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var path = require('path');
  var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');

  var from = req.body.from;

  console.log("Preparing to delete job at " + from);

  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
  var teamConfig = require(path.resolve(pathToJson));

  cryptoutil.decrypt(teamConfig.pipeline[from].config.jenkins.password,
    function(err, decryptedJenkinsPassword) {
      sendJobRequests(req, res, teamConfig, decryptedJenkinsPassword);
    });  

}

function sendJobRequests(req, res, teamConfig, jenkinsPassword){

  var from = req.body.from;
  var jenkinsHost = teamConfig.pipeline[from].config.jenkins.serveruri;
  var jenkinsUsername = teamConfig.pipeline[from].config.jenkins.username;

  var jenkinsJobName = from + "-" + teamConfig.team;
  
  var urlString = jenkinsHost + "job/" + jenkinsJobName + "/doDelete";

  console.log("Sending request to delete job:" + urlString);

  var request = require('request');
  request.post({
    headers: {
      'content-type' : 'application/xml',
      'Authorization': 'Basic ' + new Buffer(jenkinsUsername+':'+jenkinsPassword).toString('base64')                  
    },
    url:    urlString,
    body:   "",
    rejectUnauthorized: false
  },function(error, response) {    
    console.log(jenkinsJobName + " deleted at " + urlString);    
    console.log("Error status in delete job request :" + error + ", " + urlString);
    console.log("Response status code in delete job request : " + response.statusCode);
    console.log("Calling function to create job.");      
    createJob(req, res);
  });
}

function createJob(req,res){

  // read json here and select files which need to copy to NFS folder on docker
  // jenkins

  console.log("Setting up pattern 2");  
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var path = require('path');
  var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');

  var from = req.body.from;
  console.log("Patternsetup From : " + from);

  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
  var teamConfig = require(path.resolve(pathToJson));
  var prop = {};
  var isConfigValidated = true;

  try {

    prop.slackuserAuthtoken = teamConfig.pipeline[from].config.slack.slacktoken;
    prop.slackteamdomain = teamConfig.pipeline[from].config.slack.teamdomain;
    prop.slackslackchannel = teamConfig.pipeline[from].config.slack.slackchannel;

    // prop.antversion=teamConfig.pipeline[from].config.ant.antversion;  
    prop.antbuildfile=teamConfig.pipeline[from].config.ant.antbuildfile;
    prop.anttargets=teamConfig.pipeline[from].config.ant.anttargets;
    prop.antproperties=teamConfig.pipeline[from].config.ant.antproperties;
    
    
    prop.jenkinsHost = teamConfig.pipeline[from].config.jenkins.serveruri;
    prop.jenkinsUsername = teamConfig.pipeline[from].config.jenkins.username;
    cryptoutil.decrypt(teamConfig.pipeline[from].config.jenkins.password,
      function(err, decryptedJenkinsPassword) {
        prop.jenkinsPassword = decryptedJenkinsPassword;
      });
    // var random = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
    prop.jenkinsJobName = from + "-" + teamConfig.team;
    
    prop.rtcVersion = teamConfig.pipeline[from].config.rtc.version;
    prop.rtcRepositoryurl = teamConfig.pipeline[from].config.rtc.serveruri;
    prop.rtcworkspace = teamConfig.pipeline[from].config.rtc.workspace;
    prop.rtcUsername = teamConfig.pipeline[from].config.rtc.username;
    cryptoutil.decrypt(teamConfig.pipeline[from].config.rtc.password, function(
      err, decryptedRTCPassword) {
      prop.rtcPassword = decryptedRTCPassword;
    });
    prop.rtcBuilDefination = teamConfig.team;
    // prop.jenkinsCredentialID = 'a586a172-25ce-46d7-9ddf-1f5905927419';
    prop.jenkinsCredentialID = teamConfig.pipeline[from].config.rtc.credentialsId;

    prop.sonarprojectkey = teamConfig.team;
    prop.sonarprojectname = teamConfig.team;
    prop.sonarsourcefolder = teamConfig.pipeline[from].config.sonar.sourcefolder;
    prop.sonarlanguage = teamConfig.pipeline[from].config.sonar.language;
    
    prop.ucdserveruri = teamConfig.pipeline[from].config.ucd.serveruri;
    prop.ucdusername = teamConfig.pipeline[from].config.ucd.username;
    cryptoutil.decrypt(teamConfig.pipeline[from].config.ucd.password, function(
      err, response) {
      prop.ucdpassword = response;
    });
    prop.ucdcomponent = teamConfig.pipeline[from].config.ucd.component;
    prop.ucdversion = teamConfig.pipeline[from].config.ucd.version;
    prop.ucdprocess = teamConfig.pipeline[from].config.ucd.process;
    prop.ucdapplication = teamConfig.pipeline[from].config.ucd.application;
    prop.ucdenvironment = teamConfig.pipeline[from].config.ucd.environment;
    prop.ucdincludeartifacts = teamConfig.pipeline[from].config.ucd.includeartifacts;
    prop.baseartifactdirectory = teamConfig.pipeline[from].config.ucd.baseartifactdirectory;

    prop.team = teamConfig.team;

    var missingConfigTool = "";
    for ( var propkey in prop) {
      console.log(propkey + " " + prop[propkey]);
      var configValue = prop[propkey];
      if (!configValue) {
        isConfigValidated = false;
        missingConfigTool += propkey + ", ";        
      }
    }

    if (!isConfigValidated) {

      res.render('error/toolstitcherror', {
        title: 'Devops pipeline as a service',
        errortype: "process",
        team: req.session.team,
        email: req.session.email,
        errmessage: missingConfigTool
      });
    }
  } catch (err) {
    console.log(err);
    console.log(err);
    res.render('error/toolstitcherror', {
      title: 'Devops pipeline as a service',
      errortype: "process",
      team: req.session.team,
      email: req.session.email,
      errmessage: "Validate provided configuration : " + err
    });
  }
  if (isConfigValidated) {
    var async = require('async');
    var configxml = '';
    async.waterfall([function(callback) {
      var selectedTools = ['slack', 'ucd', 'sonar', 'rtc', 'ant'];
      var fs = require("fs");
      var data = fs.readFileSync('./resources/default-config2.xml');
      data = data.toString();
      for (var i = 0; i < selectedTools.length; i++) {
        try {
          var toolName = selectedTools[i].toLowerCase();          
          console.log(" toolName " + toolName + ", Ignored :" + teamConfig.pipeline[from].config[toolName].ignore);
          if(!teamConfig.pipeline[from].config[toolName].ignore){
            var tool = require('../../../lib/jenkins/' + toolName);
            console.log(" toolName completed :" + toolName);
            configxml = tool.createxml(prop, data);
            data = configxml;
          }
        } catch (err) {
          error = 'error ' + err;
        }
      }
      configxml = data;
      console.log("Config file completed.");
      callback(null, configxml);
    }, function(configxml, callback) {
      var jenkins = require('../../../lib/jenkins/jenkins');
      console.log("Jenkins hit for job creation");

      createdJob = jenkins.createJob(prop, configxml, function(err, result) {
        if (err) {
          console.log("Job creation failed for " + from);
          res.redirect("/automate/pattern2?error=true");
        }
        if (result === null) {
          console.log("Job created successfully. Response from Jenkins: " + result);
          callback(result, null);
        } else {
          console.log("Job created successfully. Response from Jenkins: " + result);
          callback(null, result);
        }
      });
    }, ], function(err, result) {
      if (result) {
        var progress = {};
        console.log("Pipeline is set");        
        if(teamConfig.pipeline[from].config.jenkins.restartJenkins){
          console.log("Restarting Jenkins");
          var jenkins = require('../../../lib/jenkins/jenkins');
          teamConfig.pipeline[from].config.jenkins.restartJenkins = false;
          jenkins.restartJenkins(prop, teamConfig, pathToJson, function(err,result){
            console.log(result);
          });
        }
        progress.jenkins = "100";
        res.render('toolscicdprogress', {
          title: 'Devops Pattern Setup Successful',
          success: 'true',
          progress: progress,
          team: req.session.team,
          email: req.session.email,
          from: "pattern2",
          jenkinsJobName: prop.jenkinsJobName,
          jenkinsHost: prop.jenkinsHost,
          travisRepoName: 'jenkins'
        });
      } else {
        console.log("Error..." + err);
        res.render('error/toolstitcherror', {
          title: 'Devops pipeline as a service',
          errortype: "process",
          team: req.session.team,
          email: req.session.email,
          errmessage: err
        });
      }
    });
}
}

function deleteCachedFile(filePath) {
  var path = require('path');
  delete require.cache[path.resolve(filePath)];
};