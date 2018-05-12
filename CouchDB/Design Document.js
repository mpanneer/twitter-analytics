{
  "_id": "_design/Tweet",
  "_rev": "131-44a5c50d6010ab70f7d358dd40595183",
  "views": {
    "stateSuburbSentiment": {
      "reduce": "_sum",
      "map": "function (doc) {
	  if(doc.type==\"Tweet\"){
	     emit([doc.stateTag,doc.geoTag.city,doc.sentimentTag], 1); 
		 }
	 }"
    },
    "sentStateSuburb": {
      "reduce": "_count",
      "map": "function (doc) {
	  if(doc.type==\"Tweet\")
	  {
	  emit([doc.stateTag,doc.geoTag.city,doc.sentimentTag], 1); 
	  }
	  }"
    },
    "suburbSalary": {
      "reduce": "_count",
      "map": "function (doc) {
	  if(doc.type==\"Suburb\")  
	  {
	  emit([doc.suburbName,doc.medianIncome], 1); 
	  }
	  }"
    },
    "salarySuburb": {
      "map": "function (doc) {
	  if(doc.type==\"Suburb\")  {
	  emit([doc.state,doc.medianIncome],1);   
	  }
	  }"
    },
    "StateSuburbTweetCount": {
      "reduce": "_count",
      "map": "function (doc) {
	  if(doc.type==\"Tweet\")
	  {  
	  emit([doc.geoTag.city, doc.stateTag], 1); 
	  }
	  }"
    },
    "Tweets": {
      "reduce": "_count",
      "map": "function (doc) {
	  if(doc.type==\"Tweet\") 
	  {
	  emit([doc.stateTag,doc.geoTag.city],[doc.sentimentTag,1]); 
	  }
	  }"
    },
    "suburbDetails": {
      "map": "function (doc) {
	  if(doc.type==\"Suburb\"){
	  emit([doc.state,doc.suburbName],[doc.medianIncome,doc.yearTwelvePassPercent,doc.uniStudentPercent])  
	  }
	  }"
    },
    "SentimentTweetStateSuburb": {
      "reduce": "function(keys, values,rereduce) {
	  analysis={'tweets':0, 'happy':0, 'sad':0, 'neutral':0, 'happyPercent':0, 'sadPercent':0, 'neutralPercent':0};
	  finalresult={'tweets':10, 'happyPercent':0, 'sadPercent':0, 'neutralPercent':0};
	  if(rereduce==false){
	  analysis.tweets=0;
	  analysis.happy=0;
	  analysis.sad=0;
	  analysis.neutral=0;
	  for(var idx in values) { 
	  analysis.tweets+=1;
	  var sentiment=values[idx];    
	  if(sentiment==\"Happy\")      analysis.happy+=1;
	  else if (sentiment == \"Sad\")     analysis.sad+=1;
	  else if (sentiment == \"Neutral\")     analysis.neutral+=1;
	  }
	  }
	  else{
	  // analysis.tweets=values.tweets;
	  analysis.happy=values.happy;
	  analysis.sad=values.sad;
	  analysis.neutral=values.neutral;
	  for(var idx in values) {
	  analysis.tweets+=values[idx].tweets;
	  analysis.happy+=values[idx].happy;
	  analysis.sad+=values[idx].sad;
      analysis.neutral+=values[idx].neutral;
	  }
	  }
	  analysis.happyPercent=(analysis.happy/analysis.tweets)*100;
	  analysis.sadPercent=(analysis.sad/analysis.tweets)*100; 
	  analysis.neutralPercent=(analysis.neutral/analysis.tweets)*100; 
	  return analysis; 
	  }",
      "map": "function (doc) {
	  if(doc.type==\"Tweet\")
	  {        
	  emit([doc.stateTag,doc.geoTag.city], doc.sentimentTag);
	  }
	  }"
    },
    "HashTag": {
      "reduce": "function(keys, counts) {
	  var sum = 0;
	  for(var i=0; i < counts.length; i++) 
	  {
	  sum += counts[i];
	  }
	  return sum;
	  }",
      "map": "function(doc) {
	  for(i in doc.entities.hashtags){
	  if(doc.entities.hashtags[i]){
	  str = JSON.stringify(doc.entities.hashtags[i].text); 
	  if(str){
	  str = str.split(\"\\\"\");
	  emit([str[1],doc.stateTag,doc.geoTag.city], 1);
	  }
	  }
	  }
	  }"
    },
    "literacyRateSuburb": {
      "map": "function (doc) {
	  if(doc.type==\"Suburb\")
	  {
	  emit([doc.state,doc.yearTwelvePassPercent],1);  
	  }
	  }"
    },
    "UniStudentSuburb": {
      "map": "function (doc) {
	  if(doc.type==\"Suburb\")
	  {
	  emit([doc.state,doc.uniStudentPercent],1); 
	  }
	  }"
    },
    "EmployedSuburb": {
      "map": "function (doc) {
	  if(doc.type==\"Suburb\")
	  {
	  emit([doc.state, doc.percentEmployed],1)
	  }
	  }"
    },
    "NOT-REQUIRED": {
      "reduce": "function(keys, values,rereduce) {\r\n  analysis={'tweets':0, 'happy':0, 'sad':0, 'neutral':0, 'happyPercent':0, 'sadPercent':0, 'neutralPercent':0};\r\n  //finalresult={'tweets':10, 'happyPercent':0, 'sadPercent':0, 'neutralPercent':0};\r\n if(rereduce==false){\r\n  analysis.tweets=0;analysis.happy=0;analysis.sad=0;analysis.neutral=0;\r\n  for(var idx in values) {\r\n    analysis.tweets+=1;\r\n    var sentiment=values[idx];\r\n    if(sentiment==\"Happy\")\r\n      analysis.happy+=1;\r\n    else if (sentiment == \"Sad\")\r\n      analysis.sad+=1;\r\n    else if (sentiment == \"Neutral\")\r\n      analysis.neutral+=1;\r\n  }\r\n }\r\n else{\r\n // analysis.tweets=values.tweets;analysis.happy=values.happy;analysis.sad=values.sad;analysis.neutral=values.neutral;\r\n\r\n  for(var idx in values) {\r\n      analysis.tweets+=values[idx].tweets;\r\n      analysis.happy+=values[idx].happy;\r\n      analysis.sad+=values[idx].sad;\r\n      analysis.neutral+=values[idx].neutral;\r\n  }\r\n }\r\n \r\n  analysis.happyPercent=(analysis.happy/analysis.tweets)*100; \r\n analysis.sadPercent=(analysis.sad/analysis.tweets)*100; \r\n analysis.neutralPercent=(analysis.neutral/analysis.tweets)*100; \r\n \r\n if(analysis.tweets<10){\r\n   analysis.happyPercent=0;\r\n   analysis.sadPercent=0;\r\n   analysis.neutralPercent=0;\r\n }\r\n \r\n  return analysis; \r\n}",
      "map": "function (doc) {\n  if(doc.type==\"Tweet\"){\n        emit([doc.stateTag,doc.geoTag.city,doc.sentimentTag], doc.sentimentTag);\n  }\n}"
    }
  },
  "lists": {
    "sort": "function(head,req) {
	var row;
	var rows=[];
	while(row = getRow()) {
    rows.push(row)    }  
	rows.sort(function(a, b)   { 
	return a.value - b.value; });
	if(req.query.sorttype!=\"ascending\")
	rows.reverse();
	send(JSON.stringify({\"rows\" : rows})) 
	}",
	
    "sortByAttribute": "function(head,req) {
	var row;
	var rows=[];
	var mini=req.query.min;
	while(row = getRow()) {
	if(row.value.tweets>mini)   
	rows.push(row)    
	};  
	rows.sort(function(a, b)   {
	if(req.query.sentiment==\"happy\")   
	return a.value.happyPercent - b.value.happyPercent; 
	else if(req.query.sentiment==\"sad\")   
	return a.value.sadPercent - b.value.sadPercent; });
	if(req.query.sorttype!=\"ascending\")
	rows.reverse();
	send(JSON.stringify({\"rows\" : rows.slice(0,10)}))  
	}"
  },
  "language": "javascript"
}
