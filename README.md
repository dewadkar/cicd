# Toolstitch Pattern Builder 

[![Build Status](https://travis.moon.com/moon/toolstitch.svg?token=qjCvojJ7jdKTta5zxyfi)]





Project is to automate the DevOps CI-CD setup tool chain for whitewater user.

      Aim:
        Automate using simple UI to accept custom config for each tool in CI-CD tools of WW and make environment available with just one click.
      
Requirement to run :
    Slack team, with integration token. Token is authorization token to access and post messages on slack. 
    Token will start with the string like  "xoxb- ...". Currently slack command simulation uses Hubot tool.
    By default slack hubot will be selected for now. To access slack, user is using default hubot server details ( Currently system dont have auto installation of hubot.).
    Likewise WW tools will list requirements as config form for user. User will fill up the config form for selected tool and system is good to go for all selected tool integration.
    
     
     Tool categories for pattern 1: 
          Slack --> RTC --> Maven --> Selenium_RQM --> Urbancode Deploy
          
     Tool Categories for pattern 2:
            Slack —> jenkins —> github —> maven —> saucelab —> bluemix


Workflows

      Why we have workflow - 1
            --> Feedback from team revealed that, users may not know all tools, understanding the workflow - 2 (given below)
            is complex for them. It is more useful to the user who really understands the devops and CICD pipeline and the
            tools. Based on this we build workflow - 1. To give user more understanding what each phase is and tools can be
            used in that phase. 

Selection of functionality in Pipeline as a service

                        Workflow - 1
![alt tag](https://github.com/dewadkar/cicd/blob/master/public/img/ToolStitch_workflow_1.png)



                        Workflow - 2
![alt tag](https://github.com/dewadkar/cicd/blob/master/public/img/Use_Case_2.png)     

Tool selection wizard looks like:

![alt tag](https://github.com/dewadkar/cicd/blob/master/public/img/tool_selection.png)


After selection of tools, user needs to fill the required configuration to make CI-CD system available. See the configuration form:

![alt tag](https://github.com/dewadkar/cicd/blob/master/public/img/tool_config.png)


Note on hubot:

     For those who dont know what hubot is and why do we have in Whitewater tool chain.
     Hubot can be used as dialogue system like any digital assistants. 
     It can run script on your command here we get teh command from Slack. 
     If user write a command say 'execute xyz task". Hubot will look in 
     scripts/coffeescript for the command and associted action with it, if 
     it founds it will execute that script that include all the task you have configured. 
     
     Its fun to try !!! 
     
      

OLD Readme V-1:


![alt tag](https://uploads.github.moon.com/github-enterprise-assets/0000/0235/0000/4407/e22feadc-9d15-11e5-8761-7a2c9d5e988c.jpg)

Individual component tested for CI:

![alt tag](https://uploads.github.moon.com/github-enterprise-assets/0000/0235/0000/2648/8143d5ce-82f0-11e5-9ee3-98789448616f.jpg)

Click on submit and hubot - slack integration will be automated. You can check slack channel for which you have token. You can test #general channel of team for response from the hubot by typeing "@<botname> hi" it will reply "howdy" like below shown in image.

![alt tag](https://uploads.github.moon.com/github-enterprise-assets/0000/0235/0000/2649/5837e872-82f1-11e5-91ca-29e896f5ad01.jpg)


     
RTC - RQM - Selenium using Adapter :
![alt tag](https://uploads.github.moon.com/github-enterprise-assets/0000/0235/0000/2716/7cb3a5a2-83ef-11e5-911f-8f7f665c07a6.jpg)
     
On submit button adapter is configured for the RTC project area and RQM Execution tool run remotly using ant script (xml)  to execute test ( test written in  jar ) execution record in RTC-RQM.      
     
Please contact on my github username at google mail for adoption requests and trial.
