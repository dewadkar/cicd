exports.init = function(req, res) {
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
  var path = require('path');
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var teamConfig = require(path.resolve(pathToJson));
  console.log("From : " + req.query.from);
  var from = req.query.from;
  req.session.gitAuthFrom = from;
   console.log(req.session.token);
   if(req.session.token== undefined){
    req.session.token= "";
   }
console.log(req.session.token);
  res.render('automate/configure/codecheckoutgithub', {
    title: 'Devops pipeline as a service',
    email: req.session.email,
    githubRepoUrl: teamConfig.pipeline[from].config.github.githubRepoUrl,
    githubBranch: teamConfig.pipeline[from].config.github.githubBranch,
    username: teamConfig.pipeline[from].config.github.username,
    token:req.session.token,
    from: req.query.from
  });
};

exports.submit = function(req, res) {
  deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var path = require('path');

  console.log("From : " + req.body.from);
  var from = req.body.from;

  var teamConfig = require(path.resolve(pathToJson));
  // console.log(teamConfig);

  teamConfig.pipeline[from].config.github.githubRepoUrl = req.body.githubRepoUrl;
  teamConfig.pipeline[from].config.github.githubBranch = req.body.githubBranch;
  teamConfig.pipeline[from].config.github.username = req.body.username;

  teamConfig.pipeline[from].config.github.configured = true;

      var fs = require('fs')
      fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function(err) {
        if (err) return console.log(err)
        console.log(JSON.stringify(teamConfig, null, 2))
        console.log('writing to ' + teamConfig)
      });
      res.redirect("/automate/"+req.body.from);

};

function deleteCachedFile(filePath) {
  var path = require('path');
  // console.log(path.resolve(filePath));
  delete require.cache[path.resolve(filePath)];
};

function persistCredentialsToJenkins(prop, callback) {

  this.addCredentials = function(prop) {
    var crypto = require('crypto');

    var username = prop.rtcUserid;
    var password = prop.rtcPassword;
    var hash = crypto.createHash('md5').update(username + password).digest(
            'hex');
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

    request.post({
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '
                + new Buffer("admin:webahead1").toString('base64')
      },
      url: prop.jenkinsHost
              + '/jenkins/credential-store/domain/_/createCredentials',

      body: 'json=' + reqData
    }, function(error, response, body) {
      //    console.log(body);
      if(response.statusCode===200){
        callback(null, hash);
      }
      if(error){
        callback(error);
      }
    });

  };
};