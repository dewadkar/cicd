/**
 * http://usejsdoc.org/
 */

var postbuild=function(){
	

	this.createxml=function(prop,data){
		
		var indexOfUpdate = data.toString().indexOf("</publishers>");
		
		/* jshint multistr: true */
		var content= '<hudson.tasks.BuildTrigger> \n\
		<childProjects>testing-toolstitch</childProjects> \n\
		<threshold> \n\
		<name>SUCCESS</name> \n\
		<ordinal>0</ordinal> \n\
		<color>BLUE</color> \n\
		<completeBuild>true</completeBuild> \n\
		</threshold> \n\
		</hudson.tasks.BuildTrigger>';
	
		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);

		return data;	
	};
	
};
module.exports=new postbuild();