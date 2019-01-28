
/*
 * GET home page.
 */

exports.validate = function(req, res){
  
  var token=req.query.token;
  console.log("token: "+token);
  var querystring = require('querystring');
  var request = require('request');
  var slackurl='https://slack.com/api/auth.test?token='+token+'&pretty=1';
  console.log('-- '+slackurl);
  request.post({
    url:   slackurl
  }, function(error, response, body){
    if(error){
      console.log(error);
      res.send(error);
    }else{
      console.log("response : body"+response);
      console.log("body content :"+body);
        res.send(body);
      }
    });
  
};