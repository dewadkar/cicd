/**
 * http://usejsdoc.org/
 */

var rtc = function() {

	this.createxml = function(prop,data) {
//
//		var fs = require("fs");
//		var data = fs.readFileSync('./resources/default-config.xml');
//		var indexOfUpdate = data.indexOf("<canRoam>");

//		String.prototype.insert = function(index, string) {
//			if (index > 0)
//				return this.substring(0, index) + string+ this.substring(index, this.length);
//			else
//				return string + this;
//		};

	  var indexOfUpdate = data.indexOf("<canRoam>");
		/*jshint multistr: true */
//		var rtcContent = '<scm class="com.moon.team.build.internal.hjplugin.RTCScm" plugin="teamconcert@1.1.9.7"> \
//			\n \t <overrideGlobal>true</overrideGlobal> \n\t <buildTool>RTC6.0.1</buildTool> \n\t <serverURI>'+prop.rtcRepositoryurl+'</serverURI> \
//				\n \t <timeout>480</timeout>\n \t <credentialsId>'+prop.jenkinsCredentialID+'</credentialsId> \
//				<buildType>buildDefinition</buildType> \
//				<buildDefinition>'+prop.rtcBuilDefination+'</buildDefinition> \
//				  \n \t <avoidUsingToolkit>false</avoidUsingToolkit> \n</scm> \n';
//		
//		
		
		
		var rtcContent = '<scm class="com.moon.team.build.internal.hjplugin.RTCScm" plugin="teamconcert@1.1.9.7"> \
		<overrideGlobal>true</overrideGlobal> \
		<buildTool>'+prop.rtcVersion+'</buildTool> \
		<serverURI>'+prop.rtcRepositoryurl+'</serverURI> \
		<timeout>480</timeout> \
		<credentialsId>'+prop.jenkinsCredentialID+'</credentialsId> \
		<buildType> \
		<value>buildWorkspace</value> \
		<buildWorkspace>'+prop.rtcworkspace+'</buildWorkspace> \
		</buildType> \
		<buildTypeStr>buildWorkspace</buildTypeStr> \
		<buildWorkspace>'+prop.rtcworkspace+'</buildWorkspace> \
		<avoidUsingToolkit>true</avoidUsingToolkit> \
		</scm>';

		data = data.slice(0, (indexOfUpdate)) + rtcContent+ data.slice(indexOfUpdate);

		return data;
	};
	
	
	

};
module.exports=new rtc();