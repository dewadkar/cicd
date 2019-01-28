
var kubernetes = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</buildWrappers>");
		var content='';
				
		 content = '<EnvInjectBuildWrapper plugin="envinject@1.92.1">\n \
				      <info>\n \
				        <propertiesContent>SERVICE_ENDPOINT=http://' + prop.tsappname + '-' + prop.teamns + '.ciodevcld.innovate.moon.com</propertiesContent>\n \
				        <loadFilesFromMaster>false</loadFilesFromMaster>\n \
				      </info>\n \
				    </EnvInjectBuildWrapper>';				

		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);

		var secondIndexOfUpdate = data.indexOf("</builders>");

		var kubernetesapicontent = '<jenkins.plugins.http__request.HttpRequest plugin="http_request@1.8.8">\n \
								      <url>http://dpev380.innovate.moon.com:3000/kubernetes/api/hostFromJenkinsToKubernetes?teamns=' + prop.teamns + '&amp;tsappname=' + prop.tsappname + '&amp;containerport=' + prop.containerport + '&amp;targetport=' + prop.hostport + '</url>\n \
								      <httpMode>GET</httpMode>\n \
								      <contentType>NOT_SET</contentType>\n \
								      <acceptType>NOT_SET</acceptType>\n \
								      <outputFile></outputFile>\n \
								      <consoleLogResponseBody>true</consoleLogResponseBody>\n \
								      <passBuildParameters>false</passBuildParameters>\n \
								      <timeout>15</timeout>\n \
								      <validResponseCodes>200</validResponseCodes>\n \
								      <validResponseContent></validResponseContent>\n \
								    </jenkins.plugins.http__request.HttpRequest>';

		data = data.slice(0, (secondIndexOfUpdate)) + kubernetesapicontent + data.slice(secondIndexOfUpdate);						    

        return data;
	};

};

module.exports = new kubernetes();