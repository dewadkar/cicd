/**
 * http://usejsdoc.org/
 */

var ant = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</builders>");
		
		content = '<hudson.tasks.Ant plugin="ant@1.3"> \n \
				      <targets>' + prop.anttargets + '</targets> \n \
				      <buildFile>' + prop.antbuildfile + '</buildFile> \n \
				      <properties>' + prop.antproperties + '</properties> \n \
				    </hudson.tasks.Ant>';

		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
        return data;
	};

};

module.exports = new ant();