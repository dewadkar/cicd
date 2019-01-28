/**
 * http://usejsdoc.org/
 */
var slack = function() {

	this.createxml=function(prop,data){
		
		var content='\nnotifications: \n slack: cio-chat:'+prop.slackuserAuthtoken;
		data = data+content;

		return data;
		
	};
};

module.exports = new slack();