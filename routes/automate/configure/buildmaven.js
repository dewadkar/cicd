exports.init = function (req, res) {
    deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
    var path = require('path');
    var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
    var teamConfig = require(path.resolve(pathToJson));
    console.log("From : " + req.query.from);
    var from = req.query.from;
    //console.log(teamConfig);

    res.render('automate/configure/buildmaven',
        {
            title: 'Devops pipeline as a service',
            email: req.session.email,
            buildcommand: teamConfig.pipeline[from].config.maven.buildcommand,
            pomfilepath: teamConfig.pipeline[from].config.maven.pomfilepath,            
            from: req.query.from
        });
};

exports.submit = function (req, res) {

    deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team + '.json');
    var pathToJson = process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json';
    var path = require('path');

    console.log("From : " + req.body.from);
    var from = req.body.from;

    var teamConfig = require(path.resolve(pathToJson));
    //console.log(teamConfig);

    teamConfig.pipeline[from].config.maven.buildcommand = req.body.buildcommand;
    teamConfig.pipeline[from].config.maven.pomfilepath = req.body.pomfilepath;
    teamConfig.pipeline[from].config.maven.configured = true;

    //console.log(teamConfig);

    var fs = require('fs')

    fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4), function (err) {
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