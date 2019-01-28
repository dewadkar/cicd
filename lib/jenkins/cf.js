/**
 * http://usejsdoc.org/
 */

var cf = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("<publishers>");

		/*jshint multistr: true*/
		var content='\n<publishers> \n\
			<hudson.tasks.BuildTrigger> \n\
		<childProjects>'+prop.cfProjectName+'</childProjects> \n\
		<threshold> \n\
		<name>SUCCESS</name> \n\
		<ordinal>0</ordinal> \n\
		<color>BLUE</color> \n\
		<completeBuild>true</completeBuild> \n\
		</threshold> \n\
		</hudson.tasks.BuildTrigger> \n\
		<com.activestate.cloudfoundryjenkins.CloudFoundryPushPublisher plugin="cloudfoundry@1.4.1"> \n\
		<target>https://api.stage1.ng.bluemix.net</target> \n\
		<organization>paranjan@in.ibm.com</organization> \n\
		<cloudSpace>jenkins</cloudSpace> \n\
		<credentialsId>237ba84c-4137-4896-a8b5-dadd6fa693bd</credentialsId> \n\
		<selfSigned>true</selfSigned> \n\
		<resetIfExists>false</resetIfExists> \n\
		<servicesToCreate/> \n\
		<manifestChoice> \n\
		<value>jenkinsConfig</value> \n\
		<manifestFile>manifest.yml</manifestFile> \n\
		<appName>jenkinsdemo</appName> \n\
		<memory>512</memory> \n\
		<hostname>jenkinsdemo</hostname> \n\
		<instances>1</instances> \n\
		<timeout>240</timeout> \n\
		<noRoute>false</noRoute> \n\
		<appPath> '+prop.cfAppPath+'</appPath> \n\
		<buildpack/> \n\
		<command/> \n\
		<domain>stage1.mybluemix.net</domain> \n\
		</manifestChoice> \n\
		<appURIs/> \n\
		</com.activestate.cloudfoundryjenkins.CloudFoundryPushPublisher> \n\
		</publishers>';
		
		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate+14);

		return data;
	};

};

module.exports = new cf();