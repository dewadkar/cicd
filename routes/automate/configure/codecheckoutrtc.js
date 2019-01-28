 var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');

 exports.init = function(req, res) {
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
  var path = require('path');
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var teamConfig = require(path.resolve(pathToJson));

  var from = req.query.from;

  var rtcpassword='';
  cryptoutil.decrypt(teamConfig.pipeline[from].config.rtc.password, function(err, decryptedrtcpassword) {
    rtcpassword = decryptedrtcpassword;

    res.render('automate/configure/codecheckoutrtc', {
      title: 'Devops pipeline as a service',
      email: req.session.email,
      serveruri: teamConfig.pipeline[from].config.rtc.serveruri,
      workspace: teamConfig.pipeline[from].config.rtc.workspace,
      username: teamConfig.pipeline[from].config.rtc.username,
      password: rtcpassword,
      from: req.query.from
    });
  });
};

exports.submit = function(req, res) {
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var path = require('path');

  var from = req.body.from;

  var teamConfig = require(path.resolve(pathToJson));

  teamConfig.pipeline[from].config.rtc.configured = true;

  teamConfig.pipeline[from].config.rtc.version = req.body.rtcversion;
  teamConfig.pipeline[from].config.rtc.serveruri = req.body.serveruri;
  teamConfig.pipeline[from].config.rtc.workspace = req.body.workspace;
  teamConfig.pipeline[from].config.rtc.username = req.body.username;
  if (req.body.password) {
    cryptoutil.encrypt(req.body.password.trim(), function(err, encryptedpassword) {
      teamConfig.pipeline[from].config.rtc.password = encryptedpassword;
    });
  }

  var jenkinsusername = teamConfig.pipeline[from].config.jenkins.username;
  var jenkinspassword = teamConfig.pipeline[from].config.jenkins.password;
  
  cryptoutil.decrypt(jenkinspassword, function(err, decryptedjenkinspassword) {    
    console.log("Jenkins credentials " + jenkinsusername + " decrypted " + decryptedjenkinspassword);
    var rtcUserid = teamConfig.pipeline[from].config.rtc.username.trim();    
    var rtcPassword = req.body.password.trim();
    var jenkinshost = teamConfig.pipeline[from].config.jenkins.serveruri;

    console.log("Saving credentials to Jenkins")
    var jenkins=require('../../../lib/jenkins/jenkins');
    jenkins.storeCredentials(jenkinshost,rtcUserid,rtcPassword,jenkinsusername, decryptedjenkinspassword,
      function(statusCode,credentialId){
        var error = false;
        if(statusCode != 200 && statusCode != 302){
          error =true;
          console.log("Error occurred while saving credentials to Jenkins.");
          teamConfig.pipeline[from].config.rtc.configured = false;
          teamConfig.pipeline[from].config.rtc.username = "";
          teamConfig.pipeline[from].config.rtc.password = "";
        }
        teamConfig.pipeline[from].config.rtc.credentialsId = credentialId;
        var fs = require('fs');
        fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4),function(err) {
          if (err || error ){            
            res.redirect("/automate/" + req.body.from + "?error=true");
          }else{
            console.log("Credentials added successfully to Jenkins.")
            console.log("Credential id " + credentialId);
            res.redirect("/automate/" + req.body.from);
          }          
        });        
      }); 

    console.log("Redirecting to automate after storing credentials to jenkins.");    
  });

};

function deleteCachedFile(filePath) {
  var path = require('path');
  delete require.cache[path.resolve(filePath)];
};

function persistCredentialsToJenkins(prop, callback) {

  var crypto = require('crypto');
  var request = require('request');
  var username = prop.rtcUserid;
  var password = prop.rtcPassword;
  var hash = crypto.createHash('md5').update(username + password).digest('hex');
  console.log(hash);

  /* jshint multistr: true */
  var reqData = '{"credentials":{"id":"'
  + hash
  + '","username":"'
  + username
  + '","scope":"GLOBAL", \
  "stapler-class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","description":"Node Sample", \
  "$class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","password":"'
  + password + '"}}';

  console.log(prop.jenkinsHost + " -- " + password);
  request.post({
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '
      + new Buffer("ddewadkar@in.moon.com:mySignUp8*")
      .toString('base64')
    },
    url: prop.jenkinsHost
    + '/jenkins/credential-store/domain/_/createCredentials',

    body: 'json=' + reqData
  }, function(error, response, body) {
    console.log(body);
    if (response) {
      if (response.statusCode === 200) {
        callback(null, hash);
      }
    }
    if (error) {
      callback(error);
    }
  });

};
