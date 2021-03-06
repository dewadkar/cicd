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

      var jobName = from + "-" + teamConfig.team;
      var urlString = "http://dpev380.innovate.moon.com:3001/kubernetes/api/list/namespace/deleteFile";

      var request = require('request');
      request.post({
        headers : {
          'content-type' : 'application/json'
        },
        url : urlString,
        body:    {           
          "namespace" : teamConfig.teamns,
          "filename" : jobName
        },
        json : true
      }, function(error, response) {
        if (error) {
          console.log("Error deleting job");
          res.redirect("/automate/pattern5?error=true");
        } else {          
          sendJobRequests(req, res, teamConfig, decryptedJenkinsPassword);
          console.log("Successfully made request to delete folder. Response status code : " +  response.statusCode.toString());          
        }
      });
      
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

  console.log("Setting up pattern 5");  
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var path = require('path');

  var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');
  var from = req.body.from;
  console.log("Patternsetup From : " + from);

  var teamConfig = require(path.resolve(pathToJson));
  var prop = {};
  var isConfigValidated = true;

  try {

    prop.slackuserAuthtoken = teamConfig.pipeline[from].config.slack.slacktoken;
    prop.slackteamdomain = teamConfig.pipeline[from].config.slack.teamdomain;
    prop.slackslackchannel = teamConfig.pipeline[from].config.slack.slackchannel;
   
    prop.jenkinsHost = teamConfig.pipeline[from].config.jenkins.serveruri;
    prop.jenkinsUsername = teamConfig.pipeline[from].config.jenkins.username;
    cryptoutil.decrypt(teamConfig.pipeline[from].config.jenkins.password,
      function(err, decryptedJenkinsPassword) {
        prop.jenkinsPassword = decryptedJenkinsPassword;
      });

    // var random = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
    prop.jenkinsJobName = from + "-" + teamConfig.team;
    prop.githubRepoUrl = teamConfig.pipeline[from].config.github.githubRepoUrl;
    prop.githubBranch = teamConfig.pipeline[from].config.github.githubBranch;
    
    prop.sonarprojectkey = teamConfig.team;
    prop.sonarprojectname = teamConfig.team;
    prop.sonarsourcefolder = teamConfig.pipeline[from].config.sonar.sourcefolder;
    prop.sonarlanguage = teamConfig.pipeline[from].config.sonar.language;

    prop.buildcommand = teamConfig.pipeline[from].config.python.buildcommand;
    prop.unittestcommand = teamConfig.pipeline[from].config.python.unittestcommand;         
    
    prop.tsappname = "pattern5";
    prop.repositoryname = teamConfig.pipeline[from].config.kubernetes.repositoryname;    
    prop.dockerregistryURL = teamConfig.pipeline[from].config.kubernetes.dockerregistryURL;    
    prop.containerport = teamConfig.pipeline[from].config.kubernetes.containerport;
    prop.hostport = teamConfig.pipeline[from].config.kubernetes.hostport;    
    prop.tag = teamConfig.pipeline[from].config.kubernetes.tag;        

    prop.testcommand = teamConfig.pipeline[from].config.testcommand.testcommand;
        
    prop.teamns = teamConfig.teamns;

    var missingConfigTool = "";
    for ( var propkey in prop) {
      console.log(propkey + " " + prop[propkey]);
      var configValue = prop[propkey];
      if (!configValue) {
        isConfigValidated = false;
        missingConfigTool += propkey + ", ";    
        console.log(missingConfigTool + ":" + propkey);
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
      var selectedTools = ['slack', 'sonar', 'github', "docker", "python", "kubernetes", "testcommand"];
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
      console.log("Jenkins hit for job creation.");

      createdJob = jenkins.createJob(prop, configxml, function(err, result) {
        if (err) {
          console.log("Job creation failed");
          res.redirect("/automate/pattern5?error=true");
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
          from: "pattern5",
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