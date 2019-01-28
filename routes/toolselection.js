/**
 * http://usejsdoc.org/
 */
exports.list = function(req, res) {
	res.render('toolselection', {
		title : "Tool Stitch"
	});
};

exports.form = function(req, res) {
	
	console.log(req.body);
	res.render('toolConfigForm', {
		title : req.param("title"),selectedval:req.param('selectedval')
	});
};




exports.copy = function(req, res){
	var client = require('scp2');
	client.scp('file.sh', 'dpeuser:dpe4you1@dpev796.innovate.moon.com:/home/dpeuser/', function(err) {
	});
	res.redirect('/restarthubot');
};

exports.restarthubot = function(req, res){
	
	
	var SSH = require('simple-ssh');
	 
	var ssh = new SSH({
	    host: 'dpev796.innovate.moon.com',
	    user: 'dpeuser',
	    pass: 'dpe4you1'
	});
	 
	ssh.exec('chmod 755 /home/dpeusr/file.sh', {
		out: function(stdout) {
			console.log(stdout);
		}
	}).start();
	

	ssh.exec('bash /home/dpeuser/file.sh', {
	    out: function(stdout) {
	        console.log(stdout);
	    }
	}).start();

	//kill first hubot and then restart the process with new slack token
	
	res.render('index',{title:"execution completed."});
};