/**
 * http://usejsdoc.org/
 */

var python = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</builders>");
		var content = '<hudson.tasks.Shell> \n \
				      <command>' + prop.buildcommand + '</command> \n \
				    </hudson.tasks.Shell><hudson.tasks.Shell> \n \
				      <command> ' + prop.unittestcommand + '</command> \n \
				    </hudson.tasks.Shell>';				

		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
        return data;
	};

};

module.exports = new python();