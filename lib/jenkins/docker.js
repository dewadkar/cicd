/**
 * http://usejsdoc.org/
 */

var docker = function() {

	this.createxml = function(prop, data) {

		var indexOfUpdate = data.indexOf("</builders>");
		var content='';
				
		 content = '<com.cloudbees.dockerpublish.DockerBuilder plugin="docker-build-publish@1.1"> \n \
				      <server plugin="docker-commons@1.3.1"/> \n \
				      <registry plugin="docker-commons@1.3.1"> \n \
				        <url>' + prop.dockerregistryURL + '</url> \n \
				      </registry> \n \
				      <repoName>' + prop.repositoryname + '</repoName> \n \
				      <noCache>false</noCache> \n \
				      <forcePull>true</forcePull> \n \
				      <skipBuild>false</skipBuild> \n \
				      <skipDecorate>false</skipDecorate> \n \
				      <repoTag>' + prop.tag + '</repoTag> \n \
				      <skipPush>false</skipPush> \n \
				      <createFingerprint>true</createFingerprint> \n \
				      <skipTagLatest>false</skipTagLatest> \n \
				    </com.cloudbees.dockerpublish.DockerBuilder>';				

		data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
        return data;
	};

};

module.exports = new docker();