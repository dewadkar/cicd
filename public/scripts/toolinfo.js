

var tool={
			  "Slack":{"website":"https://slack.com/","docs":"https://slack.com/is","description":"Slack is a team collaboration tool. Slack offers persistent chat rooms organized by topic, as well as private groups and direct messaging."},
			  "Pagerduty":{"website":"https://www.pagerduty.com","docs":"https://www.pagerduty.com/docs/","description":"PagerDuty provides alerting, on-call scheduling, escalation policies and incident tracking to increase uptime of your apps, servers, websites and databases."},
			  "Email":{"website":"ibmverse.com","docs":"https://apps.na.collabserv.com/help/topic/com.ibm.cloud.verse.doc/welcometoibmverse.html","description":"Verse includes profiles, connecting with and following people so you can see their updates, uploading and sharing files, activity stream, status updates, and share to a blog. S"},
			  "Release Blueprints":{"website":"","docs":"","description":""},
			  "Mural.ly":{"website":"https://mural.ly","docs":"https://support.mural.ly/","description":"Make remote design work Online brainstorming, synthesis and collaboration."},
			  
			  "Selenium_RQM":{"website":"https://www.seleniumhq.org/","docs":"https://www.seleniumhq.org/docs/","description":"Selenium is a portable software testing framework for web applications. Selenium provides a record/playback tool for authoring tests without learning a test scripting language (Selenium IDE)."},
			  "Selenium":{"website":"https://www.seleniumhq.org/","docs":"https://www.seleniumhq.org/docs/","description":"Selenium is a portable software testing framework for web applications. Selenium provides a record/playback tool for authoring tests without learning a test scripting language (Selenium IDE)."},
			  "RQM":{"website":"https://www.ibm.com/software/products/en/ratiqualmana","docs":"https://www.ibm.com/developerworks/downloads/r/rqm/","description":"Rational Quality Manager (RQM) is a quality and test management tool created by IBM."},
			  "Browserstack":{"website":"https://www.browserstack.com/","docs":"https://www.browserstack.com/screenshots/api","description":"Test your website for cross browser compatibility on real browsers. Instant access to multiple desktop and mobile browsers. "},
			  "Saucelabs":{"website":"https://saucelabs.com/","docs":"https://wiki.saucelabs.com/","description":"Cross browser testing made awesome. Selenium testing, mobile testing, JS unit testing on over 700 OS/browser platforms"},
			  
			  
			  "RTC":{"website":"www.ibm.com/software/products/en/rtc","docs":"https://jazz.net/downloads/rational-team-concert/latest","description":"Rational Team Concert is a software development team collaboration tool developed by the Rational Software brand of IBM, who first released it in 2008"},
			  "Github":{"website":"https://github.com/","docs":"https://help.github.com/","description":"GitHub is a Web-based Git repository hosting service. It offers all of the distributed revision control and source code management (SCM) functionality of Git."},
			  "Subversion":{"website":"https://subversion.apache.org/","docs":"https://subversion.apache.org/docs/","description":"Subversion is an open source version control system."},
			  
			  "Maven":{"website":"https://maven.apache.org/","docs":"https://maven.apache.org/guides/index.html","description":"Open Source - Apache build manager for Java projects. Features a (POM) Project Object Model, extensible process plugin framework."},
			  "Ant":{"website":"http://ant.apache.org","docs":"http://ant.apache.org/manual/index.html","description":"Apache Ant is a Java library and command-line tool whose mission is to drive processes described in build files as targets and extension points dependent upon each other. "},
			  "Urbancode build":{"website":"https://www.ibm.com/software/products/en/ucdep","docs":"https://developer.ibm.com/urbancode/products/urbancode-deploy/","description":"tool for automating application deployments through your environments. The features provided by UrbanCode Deploy are: Automated, consistent deployments and rollbacks of applications. "},
			  //"Urbancode build":{"website":"","docs":"","description":""},
			  
			  "Jenkins":{"website":"http://jenkins-ci.org/","docs":"https://wiki.jenkins-ci.org/display/JENKINS/Use+Jenkins","description":"Jenkins is an award-winning, cross-platform, continuous integration and continuous delivery application that increases your productivity"},
			  "Codeship":{"website":"https://codeship.com/","docs":"https://codeship.com/documentation/","description":"Release more frequently, build the product your users need and do it lightning fast with ParallelCI by Codeship"},
			  "Travis CI":{"website":"https://travis-ci.org/","docs":"https://docs.travis-ci.com/","description":"Test and Deploy with Confidence. Easily sync your GitHub projects with Travis CI and you'll be testing your code in minutes"},
			  "Snap CI":{"website":"https://snap-ci.com/","docs":"https://docs.snap-ci.com/","description":"Build the great products for your users, let Snap handle your build & delivery infrastructure. Continuous Delivery without the hardware hassle."},
			  "Circle CI":{"website":"https://circleci.com/","docs":"https://circleci.com/docs","description":"Free Hosted Continuous Integration and Deployment for web and mobile applications. Build better apps and ship code faster with CircleCI."},
        "Bamboo":{"website":" https://www.atlassian.com","docs":"https://confluence.atlassian.com/bamboo/bamboo-documentation-home-289276551.html","description":"Bamboo supports builds in any programming language using any build tool, including Ant, Maven, Make, and any command line tools"},
			  
			  "UCD":{"website":"https://www.ibm.com/software/products/en/ucdep","docs":"https://developer.ibm.com/urbancode/products/urbancode-deploy/","description":"tool for automating application deployments through your environments. The features provided by UrbanCode Deploy are: Automated, consistent deployments and rollbacks of applications. "},
			  "Bluemix":{"website":"https://www.ibm.com/Bluemix","docs":"https://www.ng.bluemix.net/docs/","description":"Develop Your Apps in Minutes Using Bluemix.See How & Get Started Today Deploy hybrid apps · Instant runtimes · Connect to existing APIs"},
			  
			  "Sonar":{"website":"http://sonar.codehaus.org/","docs":"http://www.sonarqube.org/get-support/","description":"Sonar is a web based code quality analysis tool for Maven based Java projects. It covers a wide area of code quality check points which include: Architecture & Design, Complexity, Duplications, Coding Rules, Potential Bugs, Unit Test etc"},
			  
			  "mysql":{"website":"https://www.mysql.com/","docs":"http://dev.mysql.com/doc/","description":"My Sequel is an open-source relational database management system (RDBMS)"},
			  "MSSQL":{"website":"https://www.microsoft.com/en-in/server-cloud/products/sql-server/","docs":"https://msdn.microsoft.com/en-us/library/bb545450.aspx","description":"MS SQL is an enterprise-level database system that is popular for Windows web servers."},
			  "PostgreSQL":{"website":"https://www.postgresql.org/","docs":"http://www.postgresql.org/docs/","description":"PostgreSQL is a powerful, open source object-relational database system. "},
			  "MongoDB":{"website":"https://www.mongodb.org/","docs":"https://docs.mongodb.org/","description":"MongoDB is a cross-platform document-oriented database. Classified as a NoSQL database, MongoDB eschews the traditional table-based relational database structure in favor of JSON-like documents "},
			  "DB2":{"website":"https://www.ibm.com/software/data/db2","docs":"https://www.ibm.com/software/data/db2","description":"DB2 is a database product from IBM. It is a Relational Database Management System (RDBMS). DB2 is designed to store, analyze and retrieve the data efficiently. DB2 product is extended with the support of Object-Oriented features and non-relational structures with XML."},
			  
			  "Docker":{"website":"https://www.docker.com/","docs":"https://docs.docker.com/","description":"Docker is an open platform for developers and sysadmins to build, ship, and run distributed applications, whether on laptops, data center VMs, or the cloud."},
			  "rkt":{"website":"https://github.com/coreos/rkt","docs":"https://coreos.com/rkt/docs/","description":"rkt is an App Container runtime for Linux."},
			  "Kubernetes":{"website":"https://kubernetes.io/","docs":"https://kubernetes.io/gettingstarted/","description":"Manage a cluster of Linux containers as a single system to accelerate Dev and simplify Ops with Kubernetes by Google."},
			  
			  
	  };

function getToolInfo(toolName){
  if(!tool[toolName]){
	  console.log(toolName+"No info found");
    return "No info";
  }  
			var websitehref = '<a target=_blank href="'+tool[toolName].website+'"><b>'+toolName +' - Website </b></a>';      
			var docshref = '&nbsp;&nbsp;<a target=_blank href="'+tool[toolName].docs+'"><b> Docs </b></a>';
			var description = '<br/><b>'+tool[toolName].description+'</b>';
			
			return websitehref + docshref + description;
  }