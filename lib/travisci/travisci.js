/**
 * http://usejsdoc.org/
 */
var travisci = function() {

  var request = require('request');
  this.integrateGit = function(prop, callback) {
    var response = '';
    var configxml = '';
    var async = require('async');
    var selectedTools = prop.selectedTools.toString().split(',');
    var data = '';
    async.waterfall([function(callback) {
      var tool = require('../../lib/travisci/languages');
      var configxml = tool.createxml(prop, data, function(err, language) {
        data = language;
        console.log(tool + "tools data " + data);
        callback(null, data);
      });
    }, function(data, callback) {
      for (var i = 0; i < selectedTools.length; i++) {
        var toolName = selectedTools[i].toLowerCase();
        if (toolName == 'bluemix') {
          continue;
        }
        try {
          var tool = require('../../lib/travisci/' + toolName);
          configxml = tool.createxml(prop, data);
          data = configxml;
          console.log(tool + "tools data " + data);

        } catch (err) {
          error = 'error ' + err;
        }
        configxml = data;
      }
      callback(null, configxml);
    }, function(configxml, callback) {
      if (selectedTools.indexOf('Bluemix') > -1) {
        var tool = require('../../lib/travisci/bluemix');
        tool.createxml(prop, data, function(err, result) {
          configxml = configxml + result;
          console.log(tool + "tools data " + data);

          callback(null, configxml);
        });
      } else {
        callback(null, configxml);
      }
    }], function end(err, result) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, result);
      }
    });
  };

  this.createxml = function(prop, data) {
    return data;
  };

  this.createJob = function(prop, xmlContent) {
    return xmlContent;
  };

};
module.exports = new travisci();
