/**
 * http://usejsdoc.org/
 */

var sonar=function(){
	

	this.createxml=function(prop,data){
		var content='\nbefore_script:\n - chmod +x sonar.sh\nscript: ./sonar.sh\n';
		data = data + content;
        return data;
	};
	
};
module.exports=new sonar();