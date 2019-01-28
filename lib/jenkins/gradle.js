/**
 * http://usejsdoc.org/
 */

var gradle = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</builders>");
		var content='';
		
			/*jshint multistr: true*/
			 content = '<hudson.tasks.Shell> \n\
				 <command>'+prop.gradlecommand+'</command> \n\
				 </hudson.tasks.Shell>';
			
		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
        return data;
	};

};

module.exports = new gradle();