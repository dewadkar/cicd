exports.init = function(req, res){
	res.render('automate/configure/release', { 
		title: 'Devops pipeline as a service',
		email: req.session.email,
		from: req.query.from
	});
};

exports.submit = function(req, res){
	res.redirect("/automate/"+req.body.from);
};