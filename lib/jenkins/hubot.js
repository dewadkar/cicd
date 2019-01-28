/**
 * http://usejsdoc.org/
 */

var hubot = function() {

	this.createScriptFile = function(slackToken,hubotDirPath) {

		// create file
		//xoxb-13688940903-vPH6mFovsPD29alln9cwjxCp
		 var fs = require('fs');
		 var fileName='file.sh';
	     var stream = fs.createWriteStream(fileName);
	     /*jshint multistr: true */
	       var bash='#!/bin/bash \n \
	       SCRIPT_HOME="'+hubotDirPath+'"\n \
	       PID=`ps -ef | grep -w hubot | grep -v grep | awk \'{print $2}\'`\n \
	    	   if [ -n "$PID" ]\n \
	    	   then \n \
	    	      kill  $PID\n \
	    	 fi \n \
	    	 cd $SCRIPT_HOME\n \
	    	 HUBOT_SLACK_TOKEN='+slackToken+' ./bin/hubot --adapter slack & \n ';

	       stream.once('open', function(fd) {
	    	   
	         stream.write(bash);
	         stream.end();
	       });
		return fileName;
};

};

module.exports=new hubot();



