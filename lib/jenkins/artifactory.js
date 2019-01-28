var artifactory=function(){
  

  this.createxml=function(prop,data){
    
    var indexOfUpdate = data.indexOf("</project>");
    
    /* jshint multistr: true */
         var content= '<buildWrappers>  \n\
    <org.jfrog.hudson.maven3.ArtifactoryMaven3Configurator plugin="artifactory@2.4.7"> \n\
      <details> \n\
        <artifactoryName>' + prop.teamns + '-artifactory</artifactoryName> \n\
        <artifactoryUrl>' + prop.artifactoryhost + '</artifactoryUrl> \n\
        <deployReleaseRepository> \n\
          <keyFromText></keyFromText> \n\
          <keyFromSelect></keyFromSelect> \n\
          <dynamicMode>false</dynamicMode> \n\
        </deployReleaseRepository> \n\
        <deploySnapshotRepository> \n\
          <keyFromText></keyFromText> \n\
          <keyFromSelect></keyFromSelect> \n\
          <dynamicMode>false</dynamicMode> \n\
        </deploySnapshotRepository> \n\
        <stagingPlugin/> \n\
      </details> \n\
      <resolverDetails> \n\
        <artifactoryName>' + prop.teamns + '-artifactory</artifactoryName> \n\
        <artifactoryUrl>' + prop.artifactoryhost + '</artifactoryUrl> \n\
        <resolveSnapshotRepository> \n\
          <keyFromText></keyFromText> \n\
          <keyFromSelect></keyFromSelect> \n\
          <dynamicMode>false</dynamicMode> \n\
        </resolveSnapshotRepository> \n\
        <resolveReleaseRepository> \n\
          <keyFromText></keyFromText> \n\
          <keyFromSelect></keyFromSelect> \n\
          <dynamicMode>false</dynamicMode> \n\
        </resolveReleaseRepository> \n\
        <stagingPlugin/> \n\
      </resolverDetails> \n\
      <deployerCredentialsConfig> \n\
        <credentials> \n\
          <username>admin</username> \n\
          <password>cGFzc3dvcmQ=</password> \n\
        </credentials> \n\
        <credentialsId></credentialsId> \n\
        <overridingCredentials>true</overridingCredentials> \n\
      </deployerCredentialsConfig> \n\
      <resolverCredentialsConfig> \n\
        <credentials> \n\
          <username></username> \n\
          <password></password> \n\
        </credentials> \n\
        <credentialsId></credentialsId> \n\
        <overridingCredentials>false</overridingCredentials> \n\
      </resolverCredentialsConfig> \n\
      <deployArtifacts>true</deployArtifacts> \n\
      <artifactDeploymentPatterns> \n\
        <includePatterns></includePatterns> \n\
        <excludePatterns></excludePatterns> \n\
      </artifactDeploymentPatterns> \n\
      <includeEnvVars>false</includeEnvVars> \n\
      <deployBuildInfo>true</deployBuildInfo> \n\
      <runChecks>false</runChecks> \n\
      <violationRecipients></violationRecipients> \n\
      <includePublishArtifacts>false</includePublishArtifacts> \n\
      <scopes></scopes> \n\
      <discardOldBuilds>false</discardOldBuilds> \n\
      <discardBuildArtifacts>true</discardBuildArtifacts> \n\
      <matrixParams></matrixParams> \n\
      <enableIssueTrackerIntegration>false</enableIssueTrackerIntegration> \n\
      <filterExcludedArtifactsFromBuild>true</filterExcludedArtifactsFromBuild> \n\
      <enableResolveArtifacts>false</enableResolveArtifacts> \n\
      <envVarsPatterns> \n\
        <includePatterns></includePatterns> \n\
        <excludePatterns>*password*,*secret*</excludePatterns> \n\
      </envVarsPatterns> \n\
      <licenseAutoDiscovery>true</licenseAutoDiscovery> \n\
      <disableLicenseAutoDiscovery>false</disableLicenseAutoDiscovery> \n\
      <aggregateBuildIssues>false</aggregateBuildIssues> \n\
      <recordAllDependencies>false</recordAllDependencies> \n\
      <blackDuckRunChecks>false</blackDuckRunChecks> \n\
      <blackDuckAppName></blackDuckAppName> \n\
      <blackDuckAppVersion></blackDuckAppVersion> \n\
      <blackDuckReportRecipients></blackDuckReportRecipients> \n\
      <blackDuckScopes></blackDuckScopes> \n\
      <blackDuckIncludePublishedArtifacts>false</blackDuckIncludePublishedArtifacts> \n\
      <autoCreateMissingComponentRequests>true</autoCreateMissingComponentRequests> \n\
      <autoDiscardStaleComponentRequests>true</autoDiscardStaleComponentRequests> \n\
    </org.jfrog.hudson.maven3.ArtifactoryMaven3Configurator> \n\
  </buildWrappers>'; 
  
    data = data.slice(0, indexOfUpdate) + content+ data.slice(indexOfUpdate);

    var artifactoryIndexOfUpdate = data.indexOf("</builders>");

    var artifactorycontent = '<hudson.tasks.Maven> \n \
          <targets>'+ 'clean deploy -Dmaven.test.skip=true' +' </targets> \n \
          <mavenName>Maven-3.2.2</mavenName> \n \
          <pom>'+ prop.mavenPomFilePath +'/pom.xml</pom> \n \
          <usePrivateRepository>false</usePrivateRepository> \n \
          <settings class="jenkins.mvn.DefaultSettingsProvider"/> \n \
          <globalSettings class="jenkins.mvn.DefaultGlobalSettingsProvider"/> \n \
        </hudson.tasks.Maven>';
     
     data = data.slice(0, artifactoryIndexOfUpdate) + artifactorycontent + data.slice(artifactoryIndexOfUpdate);     

    return data;  
  };
  
};
module.exports=new artifactory();