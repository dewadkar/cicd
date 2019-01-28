/*
 * GET home page.
 */

exports.listteamspatterns = function(req, res) {

  var fs = require("fs");
  
  var dirPath = process.env.TOOLSTITCH_HOME + '/teams/';
  var recursive = require('recursive-readdir');
  recursive(dirPath, function(err, teamsconfigfiles) {
    console.log("files " + teamsconfigfiles);
    getTeamEnabledPatterns(teamsconfigfiles, function(err, teamspatterns) {
      if (err) {

      } else {

        res.render('social/viewteamspatterns', {
          title: 'Teams Patterns',
          team: req.session.team,
          email: req.session.email,
          teamspatterns: teamspatterns
        });
      }
    });
  });
};

function getTeamEnabledPatterns(teams, callback) {
  
  var async = require('async');
  var teamspattern = {};
  var path = require('path');
  var patterns = new Array(20);
  async.forEach(teams,function(teamConfigFile, callback) {
      var teamConfig = require(path.resolve(teamConfigFile));
      var teamName = teamConfig.team;     
      var teamPatterns = [];
      console.log("teamName -- "+teamName);
      for (var counter = 1; counter <= patterns.length; counter++) {
        var pattenrNumb = 'pattern' + counter;
        if (teamConfig.pipeline[pattenrNumb]) {
          if (teamConfig.pipeline[pattenrNumb].config.github) {
            if (teamConfig.pipeline[pattenrNumb].config.github.configured) {
              teamPatterns.push(pattenrNumb);
            }
          }
          if (teamConfig.pipeline[pattenrNumb].config.rtc) {
            if (teamConfig.pipeline[pattenrNumb].config.rtc.configured) {
              teamPatterns.push(pattenrNumb);
            }
          }
        }
      }
      teamspattern[teamName] = teamPatterns;
      console.log(" final - "+JSON.stringify(teamspattern));
      callback(null,teamspattern);
    },function(err,result){
      if(err){
        throw err;
      }
      callback(null,teamspattern);
    });
  }



exports.copypattern = function(req, res) {

  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
  var copypatternfromteam=req.body.copyfromteam;
  var copiedpattern=req.body.copiedpattern;
  var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 
  var copypatternfromteamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.body.copyfromteam+'.json'); 

 if(copypatternfromteamConfig.pipeline[copiedpattern]){
  teamConfig.pipeline[copiedpattern]=copypatternfromteamConfig.pipeline[copiedpattern];
   console.log('config copied for pattern : '+copypatternfromteamConfig.pipeline[copiedpattern])
   
   var fs = require('fs')
   fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
       if (err) return console.log(err)
       console.log(JSON.stringify(teamConfig, null, 2))
       console.log('writing to ' + teamConfig)
   });
 }
  
  res.redirect("/automate/"+copiedpattern);
  
};



