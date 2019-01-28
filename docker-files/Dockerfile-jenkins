# BUILD USING:  docker build --rm -t ciocldreg101.innovate.ibm.com/ciohcld/jenkins
# RUN USING: docker run -d --name jenkins-master -it -p 8081:8081 -v /var/lib/jenkins:/var/lib/jenkins:rw ciocldreg101.innovate.ibm.com/ciohcld/jenkins

FROM ciocldreg101.innovate.ibm.com/ciohcld/centos7

MAINTAINER Abhay Ratnaparkhi email:abratnap@in.ibm.com

# Add docker yum repository.
COPY docker.repo /etc/yum.repos.d/

# Install necessary packages.
RUN yum update -y && yum install wget -y && \
wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo && \
rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key && \
yum install jenkins java-1.8.0-openjdk initscripts maven ant git bind-utils docker-engine-1.7.1 -y

# Copy startup script inside.
COPY start-jenkins.sh /start-jenkins.sh

# Start and Install plugins.
RUN /etc/init.d/jenkins start && sleep 30 && \
wget http://localhost:8080/jnlpJars/jenkins-cli.jar -O /usr/lib/jenkins/jenkins-cli.jar && \
java -jar /usr/lib/jenkins/jenkins-cli.jar -s http://localhost:8080/ \
install-plugin git-client \
git \
docker-build-publish \
docker-build-step \
docker-plugin \
docker-commons \
docker-custom-build-environment \
ghprb \
windows-slaves \
translation \
token-macro \
teamconcert \
subversion \
ssh-slaves \
ssh-credentials \
slack \
script-security \
scm-api \
sauce-ondemand \
run-condition \
pam-auth \
antisamy-markup-formatter \
notification \
nodejs \
maven-plugin \
matrix-project \
matrix-auth \
mailer \
ldap \
kubernetes \
junit \
jenkins-cloudformation-plugin \
javadoc \
github \
github-api \
git \
git-client \
external-monitor-job \
envinject \
durable-task \
docker-build-step \
docker-plugin \
docker-commons \
cvs \
credentials \
copy-to-slave \
conditional-buildstep \
cloudfoundry \
capitomcat \
authentication-tokens \
ant \
job-import-plugin -deploy

# Copy configuration (w3ID login enabled)
COPY config.xml /var/lib/jenkins/

# Change ownership to jenkins
RUN chown -R jenkins:jenkins /var/lib/jenkins/config.xml && \
chmod -R 755 /var/lib/jenkins/config.xml

# Stop Jenkins server and backup jenkins home director
RUN /etc/init.d/jenkins stop && /usr/bin/tar -cpf /root/jenkins-home.tar /var/lib/jenkins > /dev/null

EXPOSE 8080

CMD /start-jenkins.sh && sleep 3650d
