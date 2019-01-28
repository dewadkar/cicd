/**
 * http://usejsdoc.org/
 */

var bluemix = function() {

	this.createxml = function(prop, data,callback) {
			/*jshint multistr: true*/
			var content='\ndeploy:\n edge: true\n provider: cloudfoundry\n username: '+prop.bluemixuserid+' \
			\n password: '+prop.bluemixpassword+'\n api: https://api.stage1.ng.bluemix.net \
				\n organization: '+prop.bluemixorganization+' \
				 \n space: travis';
			
			data = data + content;
		 callback(null,data);	
};
};

module.exports=new bluemix();