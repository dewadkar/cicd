/**
 * http://usejsdoc.org/
 */

module.exports=function(req,res){
	var app = require('../app.js');
	this.copyfile=function(){
		
		var config = require('../lib/posterFile.js');
		config.postscp();

	};
	
	app.get('/copy',this.copyfile);
};