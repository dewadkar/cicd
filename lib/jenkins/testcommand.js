
var testcommand = function() {

	this.createxml = function(prop, data) {

		var index = data.indexOf("</builders>");
		var content = '<hudson.tasks.Shell> \n \
				      <command>' + prop.testcommand + '</command> \n \
				    </hudson.tasks.Shell>';				

		data = data.slice(0, (index)) + content + data.slice(index);
        return data;
	};

};

module.exports = new testcommand();