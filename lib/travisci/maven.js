/**
 * http://usejsdoc.org/
 */

var maven = function() {

	this.createxml = function(prop, data) {

		var content='\nafter_script:\n - mvn '+prop.mavenCommand+'\nsudo: false';
		data = data+content;
        return data;
	};

};

module.exports = new maven();