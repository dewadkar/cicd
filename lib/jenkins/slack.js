/**
 * http://usejsdoc.org/
 */
 var slack = function() {

  this.createxml = function(prop, data) {

    //slack notification details at the start
    var indexOfUpdate = data.indexOf("<startNotification>");
    var content = '<teamDomain>' + prop.slackteamdomain.trim() + '</teamDomain> \n\
    <token>'+prop.slackuserAuthtoken.trim()+'</token> \n\
    <room>#' + prop.slackslackchannel.trim() + '</room>';
    console.log("in slack");

    data = data.slice(0, (indexOfUpdate)) + content + data.slice(indexOfUpdate);

    
    //Slack notification slack config after POST Build action
    indexOfUpdate = data.indexOf("</publishers>");
    /* jshint multistr:true */
    content = '<jenkins.plugins.slack.SlackNotifier plugin="slack@1.8.1"> \n \
    <teamDomain>' + prop.slackteamdomain.trim() + '</teamDomain> \n\
    <authToken>' + prop.slackuserAuthtoken.trim() + '</authToken> \n\
    <buildServerUrl></buildServerUrl> \n\
    <room>#' + prop.slackslackchannel.trim() + '</room> \n\
    </jenkins.plugins.slack.SlackNotifier>';

    data = data.slice(0, (indexOfUpdate)) + content + data.slice(indexOfUpdate);
    return data;

  };

  this.integrateDeprecated = function(prop) {

    var filePath = "./resources/slack.coffee";
    var userid = "dpeuser";
    var password = "dpe4you1";
    var host = "dpev796.innovate.moon.com";
    var hubotScriptPath = '/home/dpeuser/myhubot';
    var slackToken = prop.slacktoken;

    var async = require('async');

    var slack = require('../lib/slack');

    async.series([
      function(callback) {
        var isCopied = slack.copy(filePath, host, hubotScriptPath
          + '/scripts/', userid, password);
        callback(null, isCopied);
      },
      function(callback) {
        var isExec = slack.execute(slackToken, hubotScriptPath, host, userid,
          password);
        callback(null, isExec);
      }

      ], function(err, result) {
        if (err) { return next(err); }
        return result;
      });
  };
  this.copyDeprecated = function(filePath, host, hostdirpath, userid, password) {
    var commandutil = require('../lib/command');

    var isCopied = commandutil.scputil(filePath, host, hostdirpath, userid,
      password);
    return isCopied;
  };

  this.executeDeprecated = function(slackToken, hostdirpath, host, userid,
    password) {

    var async = require('async');
    var file = 'file.sh';
    var commandutil = require('../lib/command');
    var hubot = require('../lib/hubot');
    async.series([
      function(callback) {
        file = hubot.createScriptFile(slackToken, hostdirpath);
        var success = commandutil.scputil(file, host, hostdirpath, userid,
          password);
        callback(null, success);
      },
      function(callback) {
        var success = commandutil.executeScript(file, host, hostdirpath,
          userid, password);
        callback(null, success);
      }], function(err, result) {
        if (err) { return next(err); }
        console.log("slack execute " + result);
        console.log("Slack is ready");
        return result;
      });
  };

};

module.exports = new slack();