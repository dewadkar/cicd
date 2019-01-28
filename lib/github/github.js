/**
 * http://usejsdoc.org/
 */
var github = function() {
	
	this.addSSHKey = function(token,key,callback) {
		var request = require('request');
		var querystring = require('querystring');
		//var token = "d973f1e49b86935c1d206506f29f9ad255933fea"
		//print typeof key;
		//var keyJson = JSON.stringify(eval("(" + key + ")"));
		//print keyJson;
		var urlString="https://github.ibm.com/api/v3/user/keys?access_token="+token;
		
		request.post({
			  headers: {
				  	'content-type' : 'application/json',
				   // 'Authorization': 'Basic ' + new Buffer(prop.jenkinsUsername+':'+prop.jenkinsPassword).toString('base64')                  
			  	},
			  url:     urlString,
			  json: key
			}, function(error, response, body){
				if(error){
				  console.log("error "+error);
				  callback("Github - Failed pushing ssh key to   "+error,null);
				}
				if(response){
				  if(response.statusCode===200){
				    callback(null, response.statusCode);
				  }else{
				    console.log("Github -Error in pushing key : "+JSON.stringify(response));
				    callback("Github -Error in pushing key : ",null);
				  }
				}
			});
	};
};

module.exports=new github();