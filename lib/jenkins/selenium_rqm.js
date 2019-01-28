/**
 * http://usejsdoc.org/
 */

var selenium_rqm=function(){

	
	
	this.integrate=function(){
		
		
	};
	
	this.copyTestJarToSelenium=function(testCaseJarPath,prop){
//		'dpeuser:dpe4you1@dpev193.innovate.moon.com:/home/dpeuser/selenium-2.46.0/',
		var client = require('scp2');
		client
				.scp(
						req.body.testCaseJarPath,
						prop.seleniumHostuserid+':'+prop.seleniumHostpassword+'@'+prop.host+prop.seleniumDirPath,
						function(err) {
							return err;
						});
		return true;

	};
	
	
	this.createAntXml=function(){
		
		console.log(" -- "+req.body.antxmlScriptFilePath+"--"+req.body.testCaseJarPath+"--"+req.body.rtcRepoUrl+"--"+req.body.projectArea+"--"+req.body.rtcServerPassword);

		var fs = require('fs');
		var fileName = "file.sh";
		var stream = fs.createWriteStream(fileName);
		stream
				.once(
						'open',
						function(fd) {
							var xmlFileName=req.body.antxmlScriptFilePath.split('\\').pop().split('/').pop();
							var antExec = "ant -f /home/dpeuser/RQMExecutionTool/"+xmlFileName;
							var command = 'nohup ./start.sh -repository '+ req.body.rtcRepoUrl + ' -user '+ req.body.rtcServerUserdId + ' -password '+ req.body.rtcServerPassword + ' -adapterName '+ req.body.adapterName + ' -projectArea '+ req.body.projectArea + ' &';
							stream
									.write("ps -ef | grep adapter | grep -v grep | awk '{print $2}' | xargs kill\ncd /home/dpeuser/rqm-selenium/adapters/\n"+command+"\n"+antExec);
							
							//         var command = 'nohup ./start.sh -repository  https://igartctrain02.swg.usma.moon.com:9443/qm -user ddewadkar@in.moon.com -password value98Sky -adapterName SeleniumAdapter193 -projectArea "CIODevops RQM" &';
//							
//							stream.write(command);
//							stream.write(antExec);
							stream.end();
						});
	};
	
	
	this.copyScriptToServer=function(filePath,prop){
		var client = require('scp2');
		client.scp(filePath,
				'dpeuser:dpe4you1@dpev193.innovate.moon.com:/home/dpeuser/',
				function(err) {
			console.log(err);
				});
	};
	
	
	this.copyAntXmlto=function(filePath,prop){
		var client = require('scp2');
		client.scp(
				filePath,
				'dpeuser:dpe4you1@dpev193.innovate.moon.com:/home/dpeuser/RQMExecutionTool/',
				function(err) {
				});

	};
	
	
	
	
	
	
};

module.exports=new selenium_rqm();

