require('newrelic');

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, toolselection = require('./routes/toolselection')
, toolprogress= require('./routes/toolscicdprogress')
, github= require('./routes/github')
, path = require('path')
, gitAuth = require('./routes/gitAuth')
, gitOAuth = require('./routes/gitOAuth')
, gitTravisToken = require('./routes/travisGitAuthToken')
, buildConsole = require('./routes/build')
, pipeline = require('./routes/pipeline')
, slackvalidation = require('./routes/slacktokenvalidation')
, devops = require('./routes/devops')
, login = require('./routes/login')
, hosting = require('./routes/hosting')
, automate = require('./routes/automate')
, toolstitcherror = require('./routes/error/toolstitcherror')
, configurenotifications = require('./routes/automate/configure/notifications') //jenkinsci
, configurecodecheckoutrtc = require('./routes/automate/configure/codecheckoutrtc')
, configurecodecheckoutgithub = require('./routes/automate/configure/codecheckoutgithub')
, configurebuildmaven = require('./routes/automate/configure/buildmaven')
, configurebuildant = require('./routes/automate/configure/buildant')
, configurebuildpython = require('./routes/automate/configure/buildpython')
, configurebuildpublishdocker = require('./routes/automate/configure/buildpublishdocker')
, configurenpminstall = require('./routes/automate/configure/npminstall')
, configurecodequality = require('./routes/automate/configure/codequality')
, configurerepoartifactory = require('./routes/automate/configure/repoartifactory')
, configuredeployucd = require('./routes/automate/configure/deployucd')
, configuredeploybluemix = require('./routes/automate/configure/deploybluemix')
, configuredeploykubernetes = require('./routes/automate/configure/deploykubernetes')
, configurecijenkins = require('./routes/automate/configure/cijenkins')
, configuretestcommand = require('./routes/automate/configure/testcommand')
, configurerelease = require('./routes/automate/configure/release') //jenkins end
, configurenotificationstravisci = require('./routes/automate/configure/travisci/notifications') //travisci
, configurecodecheckoutgithubtravisci = require('./routes/automate/configure/travisci/codecheckoutgithub')
, configurebuildmaventravisci = require('./routes/automate/configure/travisci/buildmaven')
, configurecodequalitytravisci = require('./routes/automate/configure/travisci/codequality')
, configuredeploybluemixtravisci = require('./routes/automate/configure/travisci/deploybluemix')//travis end
, patternsetup1 = require('./routes/automate/pipeline/patternsetup1')
, patternsetup2 = require('./routes/automate/pipeline/patternsetup2')
, patternsetup3 = require('./routes/automate/pipeline/patternsetup3')
, patternsetup4 = require('./routes/automate/pipeline/patternsetup4')
, patternsetup5 = require('./routes/automate/pipeline/patternsetup5')
, patternsetup10 = require('./routes/automate/pipeline/patternsetup10')
, patternsetup15 = require('./routes/automate/pipeline/patternsetup15')
, socialcoding = require('./routes/social/viewteamspatterns')
, k8sadmin = require('./routes/k8s/admin/k8sadmin')
, admin = require('./routes/admin/admin')
, superadmin = require('./routes/admin/superadmin')
, passport     = require('passport')
, LdapStrategy = require('passport-ldapauth');


var OPTS = {
		  server: {
			  url : 'ldaps://bluepages.ibm.com:636',
			  searchBase : 'o=ibm.com',
			  searchFilter : '(&(mail={{username}})(objectclass=person))',
			  passReqToCallback : true
		  }
		};

passport.use(new LdapStrategy(OPTS));

var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');

var session = require('express-session');
var cookieParser = require('cookie-parser'); 

var app = express();

app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({
	secret: 'thisisasecretkey',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(passport.initialize());
//app.use(passport.session());


if ('development' === app.get('env')) {
	app.use(errorhandler());
}



app.post('/authenticate', [login.passauth,login.authenticate]);


app.all("/*", requireLogin, function(req, res, next) {
	next(); 
});


app.get('/', devops.index);
app.get('/users', user.list);

app.get("/login", login.login);

app.get("/github",github.github);

app.get("/build",github.buildconsole);
app.get("/buildCode",github.buildCode);


//app.get("/gitTokenAuth", gitAuth.saveToken);
//app.get("/githubHandshake", gitAuth.redirectToGithub);

app.get("/gitTokenAuth", [gitOAuth.getAccessToken, gitOAuth.getSSHKey,gitOAuth.addSSHKey,gitOAuth.redirectToGitHubPage]);
app.get("/githubHandshake", gitOAuth.redirectToAuthUrl);


app.get("/toolstitchTravisHandshake", gitTravisToken.saveTokenForTravis);


app.get('/tools',toolselection.list);
app.post("/progress", toolprogress.processConfig);
app.get('/rtc',toolprogress.processConfig);
app.post('/toolsConfigForm',toolselection.form);

app.get("/github",github.github);
app.get("/runStep",github.runStep);
app.get('/saveBuildStep',buildConsole.saveBuildStep);
app.get('/getBuildSteps',buildConsole.viewBuildStep);
app.get('/pipeline',pipeline.init);


//socialcoding
app.get('/teams/patterns',socialcoding.listteamspatterns);
app.post('/teams/patterns/copypattern',socialcoding.copypattern);

app.get('/devops',devops.index);
app.get('/validate',slackvalidation.validate);

app.get('/signout',login.signout);
app.get('/host',hosting.hostTool);
app.get('/destroy',hosting.destroyTool);
app.get('/automate',automate.select);

app.get('/automate/pattern1',automate.pattern1);
app.get('/automate/pattern2',automate.pattern2);
app.get('/automate/pattern3',automate.pattern3);
app.get('/automate/pattern4',automate.pattern4);
app.get('/automate/pattern5',automate.pattern5);
app.get('/automate/pattern10',automate.pattern10);
app.get('/automate/pattern15',automate.pattern15);

app.get('/automate/errorpage',toolstitcherror.display);

//jenkins ci
app.get('/automate/configure/notifications',configurenotifications.init);
app.get('/automate/configure/codecheckoutrtc',configurecodecheckoutrtc.init);
app.get('/automate/configure/codecheckoutgithub',configurecodecheckoutgithub.init);
app.get('/automate/configure/buildmaven',configurebuildmaven.init);
app.get('/automate/configure/buildant',configurebuildant.init);
app.get('/automate/configure/buildpython',configurebuildpython.init);
app.get('/automate/configure/buildpublishdocker',configurebuildpublishdocker.init);
app.get('/automate/configure/npminstall',configurenpminstall.init);
app.get('/automate/configure/codequality',configurecodequality.init);
app.get('/automate/configure/repoartifactory',configurerepoartifactory.init);
app.get('/automate/configure/deployucd',configuredeployucd.init);
app.get('/automate/configure/deploybluemix',configuredeploybluemix.init);
app.get('/automate/configure/deploykubernetes',configuredeploykubernetes.init);
app.get('/automate/configure/testcommand',configuretestcommand.init);
app.get('/automate/configure/release',configurerelease.init);
app.get('/automate/configure/cijenkins',configurecijenkins.init);

app.post('/automate/configure/notificationssubmit',configurenotifications.submit);
app.post('/automate/configure/codecheckoutrtcsubmit',configurecodecheckoutrtc.submit);
app.post('/automate/configure/codecheckoutgithubsubmit',configurecodecheckoutgithub.submit);
app.post('/automate/configure/buildmavensubmit',configurebuildmaven.submit);
app.post('/automate/configure/buildantsubmit',configurebuildant.submit);
app.post('/automate/configure/buildpythonsubmit',configurebuildpython.submit);
app.post('/automate/configure/buildpublishdockersubmit',configurebuildpublishdocker.submit);
app.post('/automate/configure/npminstallsubmit',configurenpminstall.submit);
app.post('/automate/configure/codequalitysubmit',configurecodequality.submit);
app.post('/automate/configure/repoartifactorysubmit',configurerepoartifactory.submit);
app.post('/automate/configure/deployucdsubmit',configuredeployucd.submit);
app.post('/automate/configure/deploybluemixsubmit',configuredeploybluemix.submit);
app.post('/automate/configure/deploykubernetessubmit',configuredeploykubernetes.submit);
app.post('/automate/configure/testcommandsubmit',configuretestcommand.submit);
app.post('/automate/configure/releasesubmit',configurerelease.submit);
app.post('/automate/configure/cijenkins',configurecijenkins.submit);

//travisci
app.get('/automate/configure/travisci/notifications',configurenotificationstravisci.init);
app.get('/automate/configure/travisci/codecheckoutgithub',configurecodecheckoutgithubtravisci.init);
app.get('/automate/configure/travisci/buildmaven',configurebuildmaventravisci.init);
app.get('/automate/configure/travisci/codequality',configurecodequalitytravisci.init);
app.get('/automate/configure/travisci/deploybluemix',configuredeploybluemixtravisci.init);

app.post('/automate/configure/travisci/notificationssubmit',configurenotificationstravisci.submit);
app.post('/automate/configure/travisci/codecheckoutgithubsubmit',configurecodecheckoutgithubtravisci.submit);
app.post('/automate/configure/travisci/buildmavensubmit',configurebuildmaventravisci.submit);
app.post('/automate/configure/travisci/codequalitysubmit',configurecodequalitytravisci.submit);
app.post('/automate/configure/travisci/deploybluemixsubmit',configuredeploybluemixtravisci.submit);


app.post('/automate/configure/patternsetup1',patternsetup1.setuppipeline);
app.post('/automate/configure/patternsetup2',patternsetup2.setuppipeline);
app.post('/automate/configure/patternsetup3',patternsetup3.setuppipeline);
app.post('/automate/configure/patternsetup4',patternsetup4.setuppipeline);
app.post('/automate/configure/patternsetup5',patternsetup5.setuppipeline);
app.post('/automate/configure/patternsetup10',patternsetup10.setuppipeline);
app.post('/automate/configure/patternsetup15',patternsetup15.setuppipeline);

app.get('/admin', admin.admin);
app.get('/admin/addMember', admin.addMember);
app.get('/admin/removeMember', admin.removeMember);
app.get('/admin/superadmin', superadmin.superadmin);
app.get('/admin/addTeam', superadmin.addTeam);
app.get('/admin/manageUsers', superadmin.manageUsers);
app.get('/admin/removeTeam', superadmin.removeTeam);
app.get('/admin/switchToTeam', superadmin.switchToTeam);
app.get('/admin/changeNamespace', devops.changeNamespace);

app.get('/k8s/admin',k8sadmin.listnamespaces);
app.post('/k8s/admin/namespaces/delete',k8sadmin.deleteNamespace);



http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

function requireLogin(req, res, next) {
  process.env.TOOLSTITCH_HOME='/Users/dewadkar/Documents/workspace/whitewater/toolstitch/';
	console.log("Toolstitch home : " + process.env.TOOLSTITCH_HOME);
	console.log("Is " + req.session.email+ " logged in : " + req.session.loggedIn);
	if (req.session.loggedIn) {
		next(); 
	} else {
		res.redirect("/login"); 
	}
}
