/**
 * http://usejsdoc.org/
 */

 var sonar=function(){
 	

 	this.createxml=function(prop,data){
 		
 		var indexOfUpdate = data.indexOf("</builders>");
 		
 		/* jshint multistr: true */
 		var content= '<hudson.plugins.sonar.SonarRunnerBuilder plugin="sonar@2.3"> \n\
 		<project></project> \n\
 		<properties> \n\
 		sonar.projectKey=' + prop.jenkinsJobName + ' \n\
 		sonar.projectName=' + prop.jenkinsJobName + ' \n\
 		sonar.projectVersion=1.0 \n\
 		sonar.sources='+prop.sonarsourcefolder.trim()+' \n\
 		sonar.language=' + prop.sonarlanguage + ' \n\
 		sonar.sourceEncoding=UTF-8 \n\
 		</properties> \n\
 		<javaOpts></javaOpts> \n\
 		<additionalArguments></additionalArguments> \n\
 		<jdk>(Inherit From Job)</jdk> \n\
 		<task></task> \n\
 		</hudson.plugins.sonar.SonarRunnerBuilder>\n';
 		
 		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);

 		return data;	
 	};
 	
 };
 module.exports=new sonar();