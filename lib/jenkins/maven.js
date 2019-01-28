/**
 * http://usejsdoc.org/
 */

var maven = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</builders>");
		var content='';
		if(prop.mavenPomFilePath !== undefined && prop.mavenPomFilePath.toString().trim().length > 0){
		/*jshint multistr: true*/
		 content = '<hudson.tasks.Maven> \n \
		      <targets>'+prop.mavenCommand+' </targets> \n \
		      <mavenName>Maven-3.2.2</mavenName> \n \
		      <pom>'+prop.mavenPomFilePath+'/pom.xml</pom> \n \
		      <usePrivateRepository>false</usePrivateRepository> \n \
		      <settings class="jenkins.mvn.DefaultSettingsProvider"/> \n \
		      <globalSettings class="jenkins.mvn.DefaultGlobalSettingsProvider"/> \n \
		    </hudson.tasks.Maven>';
		
		}else{
			 content = '<hudson.tasks.Maven> \n \
			      <targets>'+prop.mavenCommand+' </targets> \n \
			      <mavenName>Maven-3.2.2</mavenName> \n \
			      <usePrivateRepository>false</usePrivateRepository> \n \
			      <settings class="jenkins.mvn.DefaultSettingsProvider"/> \n \
			      <globalSettings class="jenkins.mvn.DefaultGlobalSettingsProvider"/> \n \
			    </hudson.tasks.Maven>';
			
		}		

		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
        return data;
	};

};

module.exports = new maven();