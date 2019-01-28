/**
 * http://usejsdoc.org/
 */
 var jenkins = function() {

 	var request = require('request');
 	this.integrateGit=function(prop){

 		var response='';
 		var configxml='';
 		var async = require('async');
 		prop.testjobcreate=true;
 		var selectedTools=prop.selectedTools.toString().split(',');
 		async.waterfall([
 			function(callback){
 				var fs = require("fs");
 				var data = fs.readFileSync('./resources/default-config2.xml');
 				var error;
 				if(prop.testjobcreate){
 					var testtool = require('../lib/postbuild');
 					data=testtool.createxml(prop,data);

 				}
 				for(var i=0; i< selectedTools.length; i++){
 					try {
 						var toolName = selectedTools[i].toLowerCase();
 						var tool = require('../lib/'+toolName);
 						configxml=tool.createxml(prop,data);
 						data=configxml;

 					}catch(err){
 						error='error '+err;
 					}
 				}
 				configxml=data;
 				callback(null, configxml);
 			},
 			function(configxml,callback){
 				var jenkins = require('../lib/jenkins');
 				createdJob=jenkins.createJob(prop,configxml);
 				callback(null, true);
 			},
 			function(mainJobCreated,callback){
 				if(mainJobCreated){
 					var createdJob=false;
 					if(prop.testjobcreate){
 						prop.jenkinsJobName='testing-toolstitch';
 						var jenkins = require('../lib/jenkins');
 						var fs = require("fs");
 						var configxml = fs.readFileSync('./resources/testingjob.xml');
 						createdJob=jenkins.createJob(prop,configxml);
 					}
 					callback(null, createdJob);
 				}else{
 					callback(null, "Testing job not created.");
 				}	
 			}, function(err, result) {
 				if (err) {
 					return err;
 				}else{
 					return result;
 				}
 			}
 			]);

};


this.createxml=function(prop,data){
	return data;
};

this.integreateRTC=function(prop){

	var Promise = require("promise");
	var configxml='';


	var promise = new Promise(function(resolve, reject) {
		if (resolve) {
			console.log('Already created file will be copied');
			var rtc = require('../lib/rtc');
			configxml=rtc.createxml(prop);
		}
		else {
			console.log(Error("It broke"));
		}
	});
	var createdJob='';
	promise.then(createdJob=this.createJob(prop,configxml));
	console.log("Is job created: "+createdJob);	
	console.log(" configxml : \n "+configxml);
	promise.then(setTimeout(this.waitFunction(), 30000));
	setTimeout(function(){
		console.log("file created.");
	}, 5000);


	prop.jenkinsJobName='test-rtc-urbancode-demo';
	var fs = require('fs');
	var content = fs.readFileSync('./resources/config.xml');

	promise.then(createdJob=this.createJob(prop,content));
	console.log("created test job too");

	return true;

};


this.waitFunction=function(){
	console.log('waited');
};

this.createJob = function(prop,xmlContent,callback) {


	var request = require('request');
	var querystring = require('querystring');
	var fs = require('fs');
	var urlString=prop.jenkinsHost+'createItem?name='+querystring.escape(prop.jenkinsJobName);
	console.log("Joburl: "+urlString);
	console.log("Jobname: "+prop.jenkinsJobName);
	console.log("xmls : "+xmlContent);
	console.log("uname :"+prop.jenkinsUsername);
	console.log("pwd :"+prop.jenkinsPassword);
	request.post({
		headers: {
			'content-type' : 'application/xml',
			'Authorization': 'Basic ' + new Buffer(prop.jenkinsUsername+':'+prop.jenkinsPassword).toString('base64')                  
		},
		url:     urlString,
		body:   xmlContent,
		rejectUnauthorized: false,
		agentOptions: {
			ca: fs.readFileSync("./resources/certs/ciodevcld_innovate_moon_com.pem")
		}
	}, function(error, response, body){
		if(error){
			console.log("Error : " + error);
			if(response){
				console.log("error, response :"+ response.statusCode);
			}
			if(body){
				console.log("error, body : "+ body);
			}
			callback("Job creation failed  "+error,null);
		}
		if(response){
			if(response.statusCode===200){
				callback(null, response.statusCode);
			}else{
				console.log("Error in Job Creation : "+JSON.stringify(response));
				var htmlToText = require('html-to-text');
				var text = htmlToText.fromString(JSON.stringify(response), {
					wordwrap: 130
				});
				console.log(text);
				callback("Error in Job Creation : "+text,null);
			}
		}
	});
};



this.buildJob = function(prop) {

	var querystring = require('querystring');
	var request = require('request');

	urlString=prop.jenkinsHost+'jenkins/job/'+querystring.escape(prop.jenkinsJobName)+'/build';
	console.log('-- '+urlString);
	request.post({
		url:   urlString
	}, function(error, response, body){
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
		}
	});
	return true;

};


this.addCredentials=function(prop){
	var crypto = require('crypto');

	var username = prop.rtcUserid;
	var password = prop.rtcPassword;
	var hash = crypto.createHash('md5').update(username + password).digest('hex');
	console.log(hash);

	/*jshint multistr: true */
	var reqData = '{"credentials":{"id":"' + hash + '","username":"' + username + '","scope":"GLOBAL", \
	"stapler-class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","description":"Node Sample", \
	"$class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","password":"' + password + '"}}';

	console.log("userid reqData :-->"+reqData)
	request.post({
		headers: {
			'content-type' : 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + new Buffer(username+":"+password).toString('base64')
		},
		url: prop.jenkinsHost+'/credential-store/domain/_/createCredentials',

		body: 'json='+reqData
	}, function(error, response, body){
		console.log(body);
		console.log(response.statusCode);
	});

};


this.storeCredentials = function(jenkinshost,rtcUserid,rtcPassword,jenkinsusername, decryptedjenkinspassword, callback){
	var crypto = require('crypto');

	var hash = crypto.createHash('md5').update(rtcUserid + rtcPassword).digest('hex');
	console.log(hash);

	/*jshint multistr: true */
	var reqData = '{"credentials":{"id":"' + hash + '","username":"'+rtcUserid+'","scope":"GLOBAL", \
	"stapler-class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","description":"Node Sample", \
	"$class":"com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl","password":"'+rtcPassword +'"}}';

	console.log(jenkinshost + ", " + jenkinsusername + ", " + decryptedjenkinspassword + ", ");

	console.log("userid reqData :-->"+reqData)

	var fs = require("fs");
	request.post({
		"rejectUnauthorized": false,
		"headers": {
			'content-type' : 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + new Buffer(jenkinsusername + ":" + decryptedjenkinspassword).toString('base64')
		},
		"url": jenkinshost+'credential-store/domain/_/createCredentials',

		"body": 'json='+reqData,
		"agentOptions": {
			ca: fs.readFileSync("resources/certs/ciodevcld_innovate_moon_com.pem")
		}
	}, function(error, response, body){
		console.log("Response statuscode " + response.statusCode);
		console.log("Error " + error);
		console.log("Body " + body);
		console.log("Response " + response);		
		callback(response.statusCode,hash);
	});

};

this.restartJenkins = function(prop, teamConfig, pathToJson, callback) {

	var request = require('request');		
	var urlString=prop.jenkinsHost+'restart';
	console.log("Joburl: "+urlString);
	console.log("uname :"+prop.jenkinsUsername);
	console.log("pwd :"+prop.jenkinsPassword);
	var fs = require("fs");
	request.post({
		headers: {		
			'content-type' : 'application/x-www-form-urlencoded',	
			'Authorization': 'Basic ' + new Buffer(prop.jenkinsUsername+':'+prop.jenkinsPassword).toString('base64')                  
		},
		url:     urlString,		
		"body": 'json='+'{"Submit":"Yes"}',		
		rejectUnauthorized: false,
		agentOptions: {
			ca: fs.readFileSync("./resources/certs/ciodevcld_innovate_moon_com.pem")
		}
	}, function(error, response, body){
		if(error){
			console.log("error "+error);
			callback("Restart jenkins fail  "+error,null);
		}
		if(response){
			if(response.statusCode === 200 || response.statusCode === 302){
				var fs = require('fs');
				fs.writeFile(pathToJson, JSON.stringify(teamConfig, null, 4),function(err) {
					if (err) return console.log(err)              
				});
				console.log("Restarted jenkins successfully")
				callback(null, response.statusCode);
			}else{
				console.log("Go this was restarting jenkins : "+JSON.stringify(response));
				var htmlToText = require('html-to-text');
				var text = htmlToText.fromString(JSON.stringify(response), {
					wordwrap: 130
				});
				console.log(text);
				callback("Got this while restarting jenkins : "+text,null);
			}
		}
	});
};


};
module.exports = new jenkins();
