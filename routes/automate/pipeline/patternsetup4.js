exports.setuppipeline = function(req, res) {

  console.log("setuppieline");
  var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team
          + '.json';
  var path = require('path');

  var from = req.body.from;
  console.log("Patternsetup From : " + from);
  var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');
  var teamConfig = require(path.resolve(pathToJson));
  var prop = {};
  var cryptoutil = require('../../../lib/security/encrypt/cryptoutil');
  var isConfigValidated = true;

  try {

    prop.slackuserAuthtoken = teamConfig.pipeline[from].config.slack.slacktoken;

    prop.mavenCommand = teamConfig.pipeline[from].config.maven.buildcommand;
    prop.mavenPomFilePath = teamConfig.pipeline[from].config.maven.pomfilepath;

    prop.serveruri = teamConfig.pipeline[from].config.github.githubRepoUrl;
    prop.githubRepoUrl = teamConfig.pipeline[from].config.github.githubRepoUrl;
    prop.githubUserid = teamConfig.pipeline[from].config.github.username;

    prop.sonarprojectkey = teamConfig.team;
    prop.sonarprojectname = teamConfig.team;
    prop.sonarsourcefolder = teamConfig.pipeline[from].config.sonar.sourcefolder;
    prop.sonarlanguage = teamConfig.pipeline[from].config.sonar.language;

    prop.bluemixtarget = teamConfig.pipeline[from].config.bluemix.target;
    prop.bluemixorganization = teamConfig.pipeline[from].config.bluemix.organization;
    prop.bluemixspace = teamConfig.pipeline[from].config.bluemix.cloudSpace;
    prop.manifestFile = teamConfig.pipeline[from].config.bluemix.manifestFile;

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
        errmessage: "Validate provided configuration : " + missingConfigTool
                + " configurations are missing"
      });
    }

  } catch (err) {
    res.render('error/toolstitcherror', {
      title: 'Devops pipeline as a service',
      errortype: "process",
      team: req.session.team,
      email: req.session.email,
      errmessage: "Validate provided configuration : " + err
    });
  }
  if (isConfigValidated) {
    var progress = {};
    var flashmessage = '';
    flashmessage = "PUSH to repo will update following file(s) if already present, from your repo: .travis.yml and sonar.properties";
    var sonarcontent = '# Required metadata \n \
    sonar.projectKey='
            + prop.sonarprojectkey
            + ' \n \
    sonar.projectName='
            + prop.sonarprojectname
            + ' \n \
    sonar.projectVersion=1.0 \n \
    # Comma-separated paths to directories with sources (required) \n \
    sonar.sources='
            + prop.sonarsourcefolder
            + ' \n \
    # Language \n \
    sonar.language='
            + prop.sonarlanguage
            + ' \n \
    # Encoding of the source files \n \
    sonar.sourceEncoding=UTF-8';

    req.session.sonarcontent = sonarcontent;
    prop.selectedTools = ['slack', 'maven', 'sonar', 'bluemix', 'travisci'];
    var travisci = require('../../../lib/travisci/travisci');
    travisci.integrateGit(prop, function(err, ymldata) {
      if (err) {
        console.log("Error..." + err);
        res.render('error/toolstitcherror', {
          title: 'Devops pipeline as a service',
          errortype: "process",
          errmessage: err
        });
      } else {
        console.log("travis ci running");
        req.session.ymltext = ymldata;
        req.session.repourl = prop.serveruri;
        req.session.useremail = prop.githubUserid;
        progress.travisci = "100";
        req.session.from = "pattern4";
        res.render('travisci', {
          title: 'Travis CI',
          ymltext: ymldata,
          team: req.session.team,
          email: req.session.email,
          flashmessage: flashmessage,
          error: null,
          from: "pattern4"
        });
      }
    });
  }
}
