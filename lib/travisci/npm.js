/**
 * http://usejsdoc.org/
 */
var npm = function() {

	this.createxml=function(prop,data){
		
		var content='\n'+prop.npmcommand;
		data = data+content;

		return data;
		
	};
};

module.exports = new npm();