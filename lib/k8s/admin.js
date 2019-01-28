/**
 * http://usejsdoc.org/
 */

var admin = function () {
    var urlString = "http://dpev380.innovate.moon.com:3000/kubernetes/api/";

    var nfsApiUrl = "http://dpev380.innovate.moon.com:3000/nfs/api/";

    this.getnamespaces = function (callback) {
        var request = require('request');
        request.get({
            url: urlString + 'list/namespaces',
        }, function (error, response, data) {
            if (error) {
                return error;
            }
            var namespaces = [];
            var json = JSON.parse(data);
            var items = json.items;
            for (var item in items) {
                namespaces.push(items[item].metadata.name);
            }
            callback(null, namespaces);
        });
    };


    this.deletenamespace = function (namespace, callback) {
        var request = require('request');
        request.del(urlString + 'namespaces/delete/' + namespace, function (error,
                                                                            response) {
            callback(null, response); // Show the HTML for the Google homepage.
        });
    };


    this.copyfiles = function (filenames, callback){
        var request = require('request');
        request.post({
            url: nfsApiUrl + 'nfs/api/copy/files/tojenkin',
            body: filenames,
        }, function (error, response, data) {
            if (error) {
                callback(error);
            }
            callback(null, true);
        });
    };
};
module.exports = new admin();