/**
 * http://usejsdoc.org/
 */

var pipeline = function() {
  
  var nfsApiUrl = "http://dpev380.innovate.moon.com:3000/nfs/api/";

  this.copyfiles=function(filenames, callback){
    console.log("Lib files: "+filenames);
    
    var request = require('request');
    request.post({
      url: nfsApiUrl + 'copy/files/tojenkins',
      body: filenames,
    }, function(error, response, data) {
      if (error) { 
        callback(error); 
        }
      callback(null, true);
    });
  };

  
  
};
module.exports = new pipeline();