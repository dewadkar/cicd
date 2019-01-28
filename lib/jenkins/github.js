/**
 * http://usejsdoc.org/
 */

var github=function(){
	
	
	
	this.createxml = function(prop,data) {

		var indexOfUpdate = data.indexOf("<canRoam>");
		
		/*jshint multistr: true */
		var content = '<scm class="hudson.plugins.git.GitSCM" plugin="git@2.3.5"> \n\
		<configVersion>2</configVersion> \n\
		<userRemoteConfigs> \n\
		<hudson.plugins.git.UserRemoteConfig> \n\
		<url>'+prop.githubRepoUrl+'</url> \n\
		<credentialsId>0e703cb5-770f-4af9-9b7d-26fe7c64a90b</credentialsId> \n\
		</hudson.plugins.git.UserRemoteConfig> \n\
		</userRemoteConfigs> \n\
		<branches> \n\
		<hudson.plugins.git.BranchSpec> \n\
		<name>*/'+prop.githubBranch+'</name> \n\
		</hudson.plugins.git.BranchSpec> </branches>  \n\
		<doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations> \n\
		<submoduleCfg class="list"/> \n\
		<extensions/> \n\
		</scm> \n';

		

		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);

		return data;
	};
	
	
	
	
	
};

module.exports=new github();