
 exports.init = function(req, res){
 	console.log("Cookie " + req.cookies.token);
 	var gitToken = "";
 	if(req.cookies.token == undefined){
 		gitToken = "";
 	}else{
 		gitToken = req.cookies.token;
 	}
 	res.render('pipeline', { title: 'IBM Whitewater - Devops Unlimited',token: gitToken, email: '' });
 };

 exports.signout = function(req, res){
 	req.session.token = "";
 	res.clearCookie('token');
 	res.render('pipeline', { title: 'IBM Whitewater - Devops Unlimited',token: '', email: '' });
 };