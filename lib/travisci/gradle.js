/**
 * http://usejsdoc.org/
 */

var gradle = function() {

	this.createxml = function(prop, data) {

		var content='\nafter_script:\n - gradle '+prop.gradlecommand;
		data = data + content;
        return data;
	};

};

module.exports = new gradle();