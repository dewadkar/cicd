exports.saveTokenForTravis = function(req, res) {

  try{
    
  
  console.log("Session - travis token " + req.session.token);
  var code = '';
  var useremail = '';

  // var ymltext=req.body.ymltext;
  // console.log(req));

  var https = require('https');
  var http = require('http');
  var request = require('request');
  var querystring = require('querystring');

  var ymltext = req.session.ymltext;
  var repourl = req.session.repourl;
  var sonarcontent = null;
  if (req.session.sonarcontent) {
    sonarcontent = req.session.sonarcontent;
  }

  var reqUrl = req.url;
  code = reqUrl.split('=')[1];

  console.log("Git API access code received : " + code);
  var postURL = 'github.moon.com/login/oauth/access_token';

  var client_secret_localhost = 'ae7ce7ce3286ab11fbdd90d8de35a20f10e24a4b';
  var client_secret_dpev181 = '7ccb9dbfb6326cd9315722b2cfbf6717d544b132';
  var client_secret_dpev179 = '52df77fcd2f3dd9b6c20eb4d49a7db5e1e5a8afb';
  var client_id_localhost = '0df63ffb86dada618a0e';
  var client_id_dpev181 = '381711d58e7c0bfc38fb';
  var client_id_dpev179 = 'e4c0614a563995a85bd1';

  // client_id = client_id_dpev181;
  // client_secret = client_secret_dpev181;

  // client_id = client_id_dpev179;
  // client_secret = client_secret_dpev179;

  client_id = client_id_localhost;
  client_secret = client_secret_localhost;

  var data = querystring.stringify({
    client_id: client_id,
    client_secret: client_secret,
    code: code

  });

  console.log(req.session.useremail);
  useremail = req.session.useremail;

  var options = {
    host: 'github.moon.com',
    path: '/login/oauth/access_token',
    port: 443,
    method: 'POST',
    headers: headers
  };

  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  };

  var accessToken;

  var post_req = https.request(options, function(response) {
    
//    try{
    var body = "";

    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      body += chunk;
    });
    var from = req.session.from;
    var team=req.session.team;
    var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/'+team+'.json';
    var path = require('path');
    var teamConfig = require(path.resolve(pathToJson));
    var repositoryName='';
    response.on('end', function() {
      var atStartIndex = body.indexOf("=") + 1;
      var atEndIndex = body.indexOf("&");
      accessToken = body.substr(atStartIndex, (atEndIndex - atStartIndex));
      console.log("-- Git access token received -- " + accessToken);
      var async = require('async');
      var travisapi=require('../lib/api/travisci/travisci');
      var travisAccessToken="";

      async.waterfall([function(callback){
        
        travisapi.getTravisAccessTokenFromGithubAuthToken(accessToken,function(err,travisAccessToken){
          if(err){
            console.log("Error "+err);
            callback(err,null);
          }
          console.log("Travis access token received : "+travisAccessToken);
          
          req.session.travisAccessToken=travisAccessToken;
          callback(null,travisAccessToken);
        });
        
      }, function(travisciAccessToken,callback){
        
        travisapi.syncUserWithgithub(travisciAccessToken,function(err,isSynced){
          if(err){
            console.log("Error in synching user with github on travis "+err);
            callback(err,null);
          }else{
            console.log("User is synched :"+isSynced);
            callback(null,travisciAccessToken);
          }
        });
        
      },function(travisciAccessToken,callback){
        
       
        var gitrepo=teamConfig.pipeline[from].config.github.githubRepoUrl;
        var indexOf=gitrepo.indexOf(':')+1;
        var lastIndex=gitrepo.indexOf('.git');
        repositoryName=gitrepo.substr(indexOf,(lastIndex-indexOf));
        repourl=gitrepo;
        travisapi.getGithubRepoIdTocreateHook(travisciAccessToken,repositoryName,function(err,id){
          if(err){
            console.log("Error "+err);
            callback(err,null);
          }else{
            console.log("Id of repo "+repositoryName+":=="+id);
            callback(null,id);
          }
        });
        
      },function(repoId,callback){
        travisapi.addTravisHookForRepo(req.session.travisAccessToken,repoId,function(err,response){
          if(response){
            callback(null,response);
          }else{
            console.log("Error "+err);
            callback(err,null);
          }
        });
      },
      function(isTravisActivated,callback) {
        if(isTravisActivated){
          callback(null,isTravisActivated);
        }else{
          callback(isTravisActivated+"Failed to create a hook with travis and github repo",null);
        }
      },
      function(isTravisActivated,callback) {
            if (sonarcontent) {
              var files = [];
              var contents = [];
              files.push('sonar-project.properties');
              contents.push(sonarcontent);
              updatefiles(files, contents, useremail, repourl, accessToken,
                      function(err, result) {
                        console.log(result);
                        callback(null, "Done");
                      });
            } else {
              callback(null, "Done");
            }
          },
          function(args, callback) {
            if (sonarcontent) {
              var scriptfiles = [];
              var script = [];
              scriptfiles.push('sonar.sh');
              var fs = require("fs");
              var sonarscriptcontent = fs
                      .readFileSync('./resources/sonar.script');
              script.push(sonarscriptcontent);
              updatefiles(scriptfiles, script, useremail, repourl, accessToken,
                      function(err, result) {
                        console.log(result);
                        callback(null, "Done");
                      });
            } else {
              callback(null, "Done");
            }
          },
          function(done, callback) {
            var progress = {};
            req.session.travistoken = accessToken;
            var travisfiles = [];
            travisfiles.push('.travis.yml');

            var traviscontents = [];
            traviscontents.push(ymltext);

            updatefiles(travisfiles, traviscontents, useremail, repourl,
                    accessToken, function(err, result) {
                      console.log(result);
                      callback(null, "Done");
                    });

          }], function(err, result) {
        if (err) {
          res.render('error/toolstitcherror', {
            title: 'Devops pipeline as a service',
            errortype: "travisci integration",
            team: req.session.team,
            email: req.session.email,
            errmessage: "Please check the repository exists and you have permissions : " + err
          });

        } else {
          res.render('toolscicdprogress', {
            title: 'Devops Pattern Setup Successful',
            success: 'true',
            progress: 100,
            team: req.session.team,
            email: req.session.email,
            from: req.session.from,
            travisRepoName: repositoryName,
            jenkinsJobName: 'travis',
            jenkinsHost: ''
          });
        }
      });
    });
  });
  }catch(error){
    res.render('error/toolstitcherror', {
      title: 'Devops pipeline as a service',
      errortype: "travisci integration",
      team: req.session.team,
      email: req.session.email,
      errmessage: "Please check the repository exists and you have permissions : " + error
    });

  }
  
  post_req.write(data);
  post_req.end();

  function updatefiles(files, contents, useremail, giturl, accesstoken,
          callback) {
    var async = require('async');
    console.log("\n files ---" + files);
    async.forEach(Object.keys(files), function(key, next) {
      var fileName = files[key];
      var content = contents[key];
      console.log("filename : " + fileName);
      searchfile(useremail, fileName, giturl, accesstoken,
              function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("\n -- " + result);
                  var data = JSON.parse(result);
                  if (data.sha) {
                    var sha = data.sha;
                    console.log("sha -- " + sha);
                    updatefile(fileName, content, useremail, giturl,
                            accesstoken, sha, function(err, output) {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log("\n update --- " + output);
                                console.log("file : " + fileName
                                        + " updated successfully ");
                              }
                            });
                  } else {
                    createfile(useremail, fileName, content, giturl,
                            accesstoken, function(err, output) {

                              if (err) {
                                console.log(err);
                              } else {
                                console.log("file : " + fileName
                                        + " created successfully ");
                              }
                            });
                  }
                  next();
                  callback(null, "ok");
                }
              });
    });
  }

  function searchfile(useremail, fileName, giturl, accesstoken, callback) {

    var replace = giturl.replace('git@github.moon.com:', "");
    var repoName = replace.replace('.git', "");

    var request = require('request');

    var data = {
      "path": fileName,
      "ref": "master"
    };

    var url = 'https://github.moon.com/api/v3/repos/' + repoName + '/contents/'
            + fileName + '?access_token=' + accesstoken;
    console.log("Search final url: " + url);
    request({
      url: url,
      method: 'GET',
      body: JSON.stringify(data)
    }, function(error, request, body) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, body);
      }
    });
  }

  function updatefile(fileName, content, useremail, giturl, accesstoken, sha,
          callback) {

    var replace = giturl.replace('git@github.moon.com:', "");
    var repoName = replace.replace('.git', "");

    var request = require('request');

    var b = new Buffer(content);

    var data = {
      "path": fileName,
      "message": "Toolstitch file updated " + fileName,
      "content": b.toString('base64'),
      "sha": sha,
      "branch": "master"
    };

    var url = 'https://github.moon.com/api/v3/repos/' + repoName + '/contents/'
            + fileName + '?access_token=' + accesstoken;
    request({
      url: url,
      method: 'PUT',
      body: JSON.stringify(data)
    }, function(error, request, body) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, body);
      }
    });
  }

  function createfile(useremail, fileName, content, giturl, accesstoken,
          callback) {

    var replace = giturl.replace('git@github.moon.com:', "");
    var repoName = replace.replace('.git', "");

    console.log("urls -- " + giturl);

    var request = require('request');

    var b = new Buffer(content);

    var data = {
      "path": fileName,
      "message": "Toolstitch file created " + fileName,
      "committer": {
        "name": useremail.replace(/@.*/g, ""),
        "email": useremail
      },
      "content": b.toString('base64'),
      "branch": "master"
    };

    console.log(data);

    var url = 'https://github.moon.com/api/v3/repos/' + repoName + '/contents/'
            + fileName + '?access_token=' + accesstoken;
    console.log("final url: " + url);
    request({
      url: url,
      method: 'PUT',
      body: JSON.stringify(data)
    }, function(error, request, body) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, body);
      }
    });
  }


};
