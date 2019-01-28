/**
 * http://usejsdoc.org/
 */
var hosttool = function() {

	var max = 999999;
	var min = 1;

	this.host = function(data, teamns, callback) {

		var id = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log("here");
		var request = require('request');
		var querystring = require('querystring');
		var fs = require('fs');

		var urlString = "http://dpev380.innovate.ibm.com:3000/kubernetes/api/provision";
		// console.log("content "+content)
		var content = fs.readFileSync("./resources/config/"
				+ data.toolname.toLowerCase() + "/"
				+ data.toolname.toLowerCase() + ".json");
		var ts = new Date / 1E3 | 0;		
		content = content.toString().replace(/NAMESPACE/g, teamns);

		console.log("data file " + content);
		request.post({
			headers : {
				'content-type' : 'application/json'
			},
			url : urlString,
			body : content,
		}, function(error, response) {
			if (error) {
				console.log(error);
				callback(error);
			} else {
				console.log(response.body);
				callback(null, response.body);
			}
		});
	};
	
	this.getSSHKey = function(data, callback) {
		var request = require('request');
		var querystring = require('querystring');
		var urlString = "http://dpev380.innovate.ibm.com:3000/kubernetes/api/sshkey";

		request.get({
			headers : {
				'content-type' : 'application/json'
			},
			url : urlString,
			qs : data,
		}, function(error, response) {
			if (error) {
				console.log(error);
				callback(error);
			} else {
				console.log(response.body);
				callback(null, response.body);
			}
		});
	}
};

module.exports = new hosttool();