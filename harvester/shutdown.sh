#/bin/bash
echo "processes selected for killing"
ps -ef|grep -i java|grep "TwitterAnalytics"|grep "1.properties"
kill $(ps -ef|grep -i java|grep "TwitterAnalytics"|grep "1.properties"| awk '{print $2}')
echo "java analytics processes have been killed"
