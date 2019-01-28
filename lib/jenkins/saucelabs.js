/**
 * http://usejsdoc.org/
 */

var saucelabs=function(){
	
	this.createxml=function(prop,data){

	
			var indexOfUpdate = data.indexOf("</project>");
	
			/* jshint multistr:true */
			var content='<EnvInjectBuilder plugin="envinject@1.92.1"> \n\
										<info> \n\
									<propertiesContent> \n\
									SL_URL=http://'+prop.saucelabsUserid+':'+prop.saucelabsAccesskey+'@ondemand.saucelabs.com:80/wd/hub \n\
									</propertiesContent> \n\
									</info> \n\
			</EnvInjectBuilder> \n\
			<hudson.tasks.Maven> \n\
							<targets>test</targets> \n\
							<mavenName>(Default)</mavenName> \n\
							<usePrivateRepository>false</usePrivateRepository> \n\
							<settings class="jenkins.mvn.DefaultSettingsProvider"/> \n\
							<globalSettings class="jenkins.mvn.DefaultGlobalSettingsProvider"/> \n\
			</hudson.tasks.Maven>';

			data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
	
			return data;
	};
};
module.exports=new saucelabs();