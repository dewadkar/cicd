/**
 * http://usejsdoc.org/
 */

var languages = function() {

	this.createxml=function(prop,data,callback){
		var lang=require('../../lib/travisci/languages');
		lang.getrepolanguage(prop.githubRepoUrl, function(err, language){
      var content='language: java';//+language.toLowerCase();
      data = data+content;
      callback(null,data);
		});
	};
	
	
	this.getrepolanguage=function(repoUrl,callback){
		var repo1=repoUrl.replace('.git','');
	    var repo=repo1.replace('git@github.moon.com:',"").trim();
		var languageUrl ='https://github.moon.com/api/v3/repos/'+repo+'/languages?access_token=f296e5c946796357bc2ed0101869e5c8426973b6';
		var request = require('request');
		request(languageUrl, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log("body "+JSON.stringify(body));
		    var json=JSON.parse(body);
		     callback(null,Object.keys(json)[0]);
			
		  }
		});
	};
	
};

module.exports = new languages();