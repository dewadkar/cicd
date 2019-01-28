/**
 * http://usejsdoc.org/
 */

var ucd=function(){
  

  this.createxml=function(prop,data){
    
    var indexOfUpdate = data.indexOf("</publishers>");
    
    /* jshint multistr: true */
         var content= '<com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisher plugin="moon-ucdeploy-publisher@1.2.7"> \n\
           <siteName>' + 'ucd-' + prop.team + '</siteName> \n\
           <useAnotherUser>true</useAnotherUser> \n\
           <anotherUser>' + prop.ucdusername.trim() + '</anotherUser> \n\
           <anotherPassword>' + prop.ucdpassword + '</anotherPassword> \n\
           <component>' + prop.ucdcomponent.trim() + '</component> \n\
           <baseDir>'+ prop.baseartifactdirectory.trim() +'</baseDir> \n\
           <directoryOffset></directoryOffset> \n\
           <fileIncludePatterns>'+ prop.ucdincludeartifacts.trim() +'</fileIncludePatterns> \n\
           <fileExcludePatterns></fileExcludePatterns> \n\
           <versionName>'+ prop.ucdversion.trim() +'</versionName> \n\
           <skip>false</skip> \n\
           <deploy>true</deploy> \n\
           <deployApp>' + prop.ucdapplication.trim() + '</deployApp> \n\
           <deployEnv>' + prop.ucdenvironment.trim() + '</deployEnv> \n\
           <deployProc>' + prop.ucdprocess.trim() + '</deployProc> \n\
           <properties></properties> \n\
           <description></description> \n\
         </com.urbancode.ds.jenkins.plugins.urbandeploypublisher.UrbanDeployPublisher>'; 
  
    data = data.slice(0, indexOfUpdate) + content+ data.slice(indexOfUpdate);

    return data;  
  };
  
};
module.exports=new ucd();