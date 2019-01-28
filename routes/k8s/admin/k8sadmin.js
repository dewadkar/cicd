exports.listnamespaces = function (req, res) {

    var k8sapi = require('../../../lib/k8s/admin');
    k8sapi.getnamespaces(function (err, namespaces) {
        res.render('k8sadmin', {
            title: 'Devops pipeline as a service',
            token: '',            
            team: req.session.team, 
            email: req.session.email,
            namespaces: namespaces
        });
    });
};

exports.deleteNamespace = function (req, res) {
    var namespaceName = req.param('namespace');
    console.log(namespaceName);
    var k8sapi = require('../../../lib/k8s/admin');
    k8sapi.deletenamespace(namespaceName, function (err, response) {
        if (err) {
            res.send("Error in delet operations -- " + err);
        } else {
            console.log("Data : " + JSON.stringify(response));
            res.redirect('/k8s/admin');
        }
    });

};

exports.authenticate = function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    assignTeamAndRedirect(email, password, req, res);

};

exports.signout = function (req, res) {
    req.session.destroy();
    res.redirect('/login');
}

function assignTeamAndRedirect(email, password, req, res) {
    var fs = require('fs');
    fs.readFile('users.txt', function (err, data) {
        if (err) throw err;
        var lines = data.toString().split("\n");
        for (i in lines) {
            var parts = lines[i].split(',');
            if (parts[0] == email) {
                console.log("Team ************* " + parts[1]);
                if (password.trim() != parts[2].trim()) {
                    break;
                }
                req.session.email = email;
                req.session.team = parts[1];
                req.session.loggedIn = true;
                res.redirect('/devops');
                return;
            }
        }
        console.log("Log in unsuccessful, redirecting to login page")
        res.redirect('/login');
    });
}