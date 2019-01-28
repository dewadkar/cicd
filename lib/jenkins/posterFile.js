/**
 * http://usejsdoc.org/
 */

var config = {};

config.postfile = function(req, res) {

	var poster = require('poster');

	var options = {
		uploadUrl : 'http://mysite.com/upload',
		method : 'POST',
		fileId : 'file',
		fields : {
			'myfield' : 'value',
			'myfield2' : 'value2'
		}
	};

	poster.post('file.jpg', options, function(err, data) {
		if (!err) {
			console.log(data);
		}
	});

};

config.postscp = function(){
	
	var client = require('scp2');
	client.scp('../lib/jenkins1.coffee', 'dpeuser:dpe4you1@example.com:/home/dpeuser/', function(err) {
	});
	
};
module.exports = config;