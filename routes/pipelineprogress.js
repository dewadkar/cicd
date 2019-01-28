/**
 * http://usejsdoc.org/
 */

exports.processConfig = function (req, res, next) {

    var prop = {};
    try {
        if (req.body.Slackauthtoken) {
            prop.slackuserAuthtoken = req.body.Slackauthtoken;
        }

        if (req.body.Mavencommand) {
            prop.mavenCommand = req.body.Mavencommand;
        }
        if (req.body.Mavenpomfilepath) {
            prop.mavenPomFilePath = req.body.Mavenpomfilepath;
        }


        if (req.body.Gradlecommand) {
            prop.gradlecommand = req.body.Gradlecommand;
        }


        if (req.body.JenkinshostURL) {
            prop.jenkinsHost = req.body.JenkinshostURL;
        }
        if (req.body.Jenkinsuserid) {
            prop.jenkinsUsername = req.body.Jenkinsuserid;
        }
        if (req.body.Jenkinspassword) {
            prop.jenkinsPassword = req.body.Jenkinspassword;
        }
        if (req.body.Jenkinsjobname) {
            prop.jenkinsJobName = req.body.Jenkinsjobname;
        }


        if (req.body.Githubbranchname) {
            prop.githubBranch = req.body.Githubbranchname;
        }

        if (req.body.Githubrepourl) {
            prop.githubRepoUrl = req.body.Githubrepourl;
        }
        if (req.body.Githubuserid) {
            prop.githubUserid = req.body.Githubuserid;
        }
        if (req.body.Githubpassword) {
            prop.githubPassword = req.body.Githubpassword;
        }

        if (req.body.Saucelabsuserid) {
            prop.saucelabsUserid = req.body.Saucelabsuserid;
        }
        if (req.body.Saucelabsaccesskey) {
            prop.saucelabsAccesskey = req.body.Saucelabsaccesskey;
        }


        if (req.body.Bluemixtarget) {
            prop.bluemixtarget = req.body.Bluemixtarget;
        }
        if (req.body.Bluemixuserid) {
            prop.bluemixuserid = req.body.Bluemixuserid;
        }
        if (req.body.Bluemixpassword) {
            prop.bluemixpassword = req.body.Bluemixpassword;
        }
        if (req.body.Bluemixorganization) {
            prop.bluemixorganization = req.body.Bluemixorganization;
        }
        if (req.body.Bluemixspace) {
            prop.bluemixspace = req.body.Bluemixspace;
        }
        if (req.body.Bluemixmanifestymlfilepath) {
            prop.bluemixmanifestymlfilepath = req.body.Bluemixmanifestymlfilepath;
        }


        if (req.body.Sonarprojectkey) {
            prop.sonarprojectkey = req.body.Sonarprojectkey;
        }
        if (req.body.Sonarprojectname) {
            prop.sonarprojectname = req.body.Sonarprojectname;
        }
        if (req.body.Sonarsourcefolder) {
            prop.sonarsourcefolder = req.body.Sonarsourcefolder;
        }
        if (req.body.Sonarlanguage) {
            prop.sonarlanguage = req.body.Sonarlanguage;
        }

    } catch (err) {
        res.send('required field not recognized \n' + err);
    }

    var tools = JSON.parse(req.body.selectedTools);
    prop.selectedTools = tools;
    var async = require('async');
    var success = "YES";

    async.waterfall([
        function (callback) {
            var content = '';
            if (tools.indexOf('Jenkins') > -1) {
                var jenkins = require('../lib/jenkins');
                content = jenkins.integrateGit(prop);
                callback(null, success);
            } else if (tools.indexOf('TravisCI') > -1) {
                var travisci = require('../lib/travisci/travisci');
                content = travisci.integrateGit(prop, function (err, ymldata) {
                    callback(null, ymldata);
                });

            }
        }
    ], function end(err, result) {
        var progress = {};
        var flashmessage = '';
        if (err) {
            if (tools.indexOf('Jenkins') > -1) {
                console.log("1");
                progress.jenkins = "100";
                res.render('toolscicdprogress', {
                    title: req.param("title"), progress: progress
                });
            }
            if (tools.indexOf('TravisCI') > -1) {
                console.log("err travis ci");
                res.render('travisci', {
                    title: "title", data: err
                });
            }
        } else {
            if (tools.indexOf('Jenkins') > -1) {
                console.log("2");
                progress.jenkins = "100";
                res.render('toolscicdprogress', {
                    title: 'Progress of tool chain setup',
                    success: 'true',
                    progress: progress
                });
            }
            if (tools.indexOf('TravisCI') > -1) {

                if (tools.indexOf('Sonar') > -1) {
                    /*jshint multistr:true  */
                    flashmessage = "PUSH to repo will delete following file(s) if already present, from your repo: .travis.yml and sonar.properties";

                    var sonarcontent = '# Required metadata \n \
						sonar.projectKey=' + prop.sonarprojectkey + ' \n \
						sonar.projectName=' + prop.sonarprojectname + ' \n \
						sonar.projectVersion=1.0 \n \
						# Comma-separated paths to directories with sources (required) \n \
						sonar.sources=' + prop.sonarsourcefolder + ' \n \
						# Language \n \
						sonar.language=' + prop.sonarlanguage + ' \n \
						# Encoding of the source files \n \
						sonar.sourceEncoding=UTF-8';
                    req.session.sonarcontent = sonarcontent;

                } else {
                    flashmessage = "PUSH to repo will delete following file(s) if already present, from your repo: .travis.yml";
                }
                req.session.ymltext = result;
                req.session.repourl = prop.githubRepoUrl;
                req.session.useremail = prop.githubUserid;
                progress.travisci = "100";
                res.render('travisci', {
                    title: 'Travis CI',
                    ymltext: result,
                    flashmessage: flashmessage,
                    error: null
                });
            }
        }
    });
};




