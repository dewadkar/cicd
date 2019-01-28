/**
 * http://usejsdoc.org/
 */

var command = function() {

	this.sshexec = function(command, host, userid, password) {

		var SSH = require('simple-ssh');
		var ssh = new SSH({
			host : host,
			user : userid,
			pass : password
		});

		ssh.exec(command, {
			out : function(stdout) {
				console.log(stdout);
			}
		}, function(err) {
			return err;
		}).start();
		console.log('file copied');
		return true;
	};

	
	this.executeScript=function(file, host,hostdirpath, userid, password){

		var SSH = require('simple-ssh');
		var ssh = new SSH({
			host : host,
			user : userid,
			pass : password
		});
		
		
		
        var response='';
		
		var async = require('async');
		
		async.series([
		 function(callback){
				ssh.exec('chmod 755 ' +hostdirpath+'/'+file, console.log('--ouput')).start();
				callback(null,true);
			},
		 function(callback){
				console.log('sh '+hostdirpath+'/'+file);
				ssh.exec('sh '+hostdirpath+'/'+file, console.log('**ouput')).start();
			
				callback(null,true);
			}
		], function(err, result) {
			if (err) {
				return err;
			}
			console.log("executeScript: "+result);
			response=result;
			return result;
		});
        return response;
	};

	this.scputil = function(file, host, hostdirpath, userid, password) {
		// copy file to host
		var client = require('scp2');
		client.scp(file, userid + ':' + password + '@' + host + ':'+ hostdirpath, function(err) {
			console.log(err);
			return err;
		});
		return true;
	};

	this.createCoffeeScript = function(filePath) {

	};

};

module.exports = new command();