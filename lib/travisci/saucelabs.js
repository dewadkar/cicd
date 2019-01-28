/**
 * http://usejsdoc.org/
 */

var saucelabs=function(){
	
	this.createxml=function(prop,data){

		prop.saucelabsUserid=(prop.saucelabsUserid).trim();
		/* jshint multistr:true */
			var content='\naddons:\n sauce_connect:\n  username: '+prop.saucelabsUserid+'\n  access_key: '+prop.saucelabsAccesskey+'';
			data = data + content;
	
			return data;
	};
};
module.exports=new saucelabs();