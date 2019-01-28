
exports.display = function(req, res){
  
	res.render('error/toolstitcherror', { title: 'Devops pipeline as a service', errortype:"process",errmessage:"Why your looking for something,which is not there !!!", team: req.session.team,
    email: req.session.email,});
};
