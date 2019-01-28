/**
 * http://usejsdoc.org/
 */

var bluemix = function() {

	this.createxml = function(prop, data) {

//	  try{
//	    
	 
		var indexOfUpdate = data.indexOf("</publishers>");

		
		console.log('bluemix xml');
		/* jshint multistr: true */
			var content='\n<com.hpe.cloudfoundryjenkins.CloudFoundryPushPublisher plugin="cloudfoundry@1.5">  \n\
				<target>'+prop.bluemixtarget.trim()+'</target> \n\
				<organization>'+prop.bluemixorganization.trim()+'</organization>  \n\
				<cloudSpace>'+prop.bluemixspace.trim()+'</cloudSpace> \n\
				<credentialsId>'+prop.credentialsId+'</credentialsId> \n\
				<selfSigned>true</selfSigned> \n\
				<resetIfExists>false</resetIfExists> \n\
				<pluginTimeout>240</pluginTimeout> \n\
				<servicesToCreate/> \n\
				<manifestChoice> \n\
				<value>manifestFile</value> \n\
				<manifestFile>'+prop.manifestFile.trim()+'</manifestFile> \n\
				<memory>0</memory> \n\
				<instances>0</instances> \n\
				<timeout>0</timeout> \n\
				<noRoute>false</noRoute> \n\
				</manifestChoice> \n\
				<appURIs/> \n\
				</com.hpe.cloudfoundryjenkins.CloudFoundryPushPublisher>';
			
			data = data.slice(0, (indexOfUpdate)) + content+ data.slice(indexOfUpdate);
			console.log('bluemix xml-- returning');
      return data;
	};
				
};

module.exports=new bluemix();