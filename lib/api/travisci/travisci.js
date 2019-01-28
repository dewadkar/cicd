/**
 * http://usejsdoc.org/
 */
var apitravisci = function() {

  var apiTravisURL = 'https://travis.innovate.ibm.com/api/';
  var request = require('request');
  var querystring = require('querystring');
  var fs = require("fs");
  this.getTravisAccessTokenFromGithubAuthToken = function(githubAuthToken,
          callback) {

    console.log("inside travis access token");
    var urlString = apiTravisURL+'auth/github';
    var json = {
            "github_token": githubAuthToken
          };
    console.log("url string : "+urlString);
    var js =JSON.stringify(json);
    console.log("body "+js);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request.post({
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.travis-ci.2+json"
        },
        agentOptions: {
          ca: fs.readFileSync("./resources/certs/travis_innovate_ibm_com.pem")
        }, 
      url: urlString,
      body: js,
      followAllRedirects: true
    }, function(error, response, body){
      
      if(error){
        callback(body,null);
      }
      if(response.statusCode===200) {
        var bodyString=JSON.parse(body);
        console.log("body -- "+bodyString.access_token);
          callback(null,bodyString.access_token);
        }else{
          console.log("erro acces token" +body);
          callback(body,null);
        }
      }
    );
  };

  this.getGithubRepoIdTocreateHook = function(accessToken, repository, callback) {

    var urlString = apiTravisURL + 'repos/' + repository + '?access_token='
            + accessToken;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request.get({
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.travis-ci.2+json"
        },
      url: urlString,
    }, function(error, response,body) {
      if (response.statusCode===200) {
        console.log("response" + response)
        var bodyString=JSON.parse(body);
        callback(null, bodyString.repo.id);
      } else {
        console.log("Error-- "+error+" \n body "+JSON.stringify(body));
        callback("Cant get repo id " + error, null);
      }
    });

  };

  this.addTravisHookForRepo = function(travisciAccessToken, repoId, callback) {
    var urlString=apiTravisURL+'hooks?access_token='+travisciAccessToken;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    
    var json={"hook": {"id": repoId,"active": true}};
    var js =JSON.stringify(json);
    request.put({
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.travis-ci.2+json"
        },
      url: urlString,
      body:js,
      followAllRedirects: true
    }, function(err,response,body){
      if(err || response.statusCode!==200){
        callback("failed to update hook "+JSON.stringify(response),null);
      }else{
        var bodyString=JSON.parse(body);
        console.log("response: "+JSON.stringify(response));
        callback(null,bodyString.result);
      }
    });
  };

  this.syncUserWithgithub = function(travisciAccessToken, callback) {
    
    var urlString = apiTravisURL + 'users/sync?access_token='+ travisciAccessToken;
    console.log(" -- urlstring --- "+urlString);
    request.post({
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.travis-ci.2+json"
        },
      url: urlString,
      followAllRedirects: true
    }, function(error, response, body){
      
      if(error){
        callback(body,null);
      }else{
        
      console.log("response -- "+response);
        var bodyString=JSON.parse(body);
        console.log("body -- "+body);
        if(bodyString.result){
          callback(null,bodyString.result);
        }else{
          callback(body,null);
        }
      }
  });
  };
  
  
};

// sync the user
// https://travis.innovate.ibm.com/api/users/sync?access_token=hI_mPnaoaoc4kXh_3siBRA

module.exports = new apitravisci();
