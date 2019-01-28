/**
 * http://usejsdoc.org/
 */

var bowserstack = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</project>");

		/* jshint multistr:true */
				var content = '<EnvInjectBuilder plugin="envinject@1.92.1"> \n\
							<info> \n\
							<propertiesContent> \n\
							BS_URL=http://'+prop.bowserstackUserid+':'+prop.bowserstackAccesskey+'@hub.browserstack.com/wd/hub \n\
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
module.exports = new bowserstack();