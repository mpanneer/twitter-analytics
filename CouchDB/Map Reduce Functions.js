### Suburb-Employment MAP
function (doc) {
//Returns the State, along with the percentage of population employed  
if(doc.type=="Suburb")
{
  emit([doc.state, doc.percentEmployed],1)
}
}

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

###State Suburb and Sentiment 
##MAP 
function (doc) {
  //Maps the state and suburb with sentiment value
  if(doc.type=="Tweet"){
        emit([doc.stateTag,doc.geoTag.city], doc.sentimentTag);
  }
}

###REDUCE
function(keys, values,rereduce) {
  //Returns the emotion percent for the particulat state or suburb (based on group_level)
  analysis={'tweets':0, 'happy':0, 'sad':0, 'neutral':0, 'empty':0, 'enthusiasm':0, 'worry':0, 'surprise':0,'love':0, 'fun':0, 'hate':0, 'boredom':0, 'relief':0, 'anger':0, 'happyPercent':0, 'sadPercent':0, 'neutralPercent':0, 'emptyPercent':0, 'enthusiasmPercent':0, 'worryPercent':0, 'surprisePercent':0, 'lovePercent':0, 'funPercent':0, 'hatePercent':0, 'boredomPercent':0, 'reliefPercent':0, 'angerPercent':0};
 if(rereduce==false){
  analysis.tweets=0;analysis.happy=0;analysis.sad=0;analysis.neutral=0;
  analysis.empty=0; analysis.enthusiasm=0; analysis.worry=0; analysis.surprise=0;
  analysis.love=0; analysis.fun=0; analysis.hate=0; analysis.boredom=0;
  analysis.relief=0; analysis.anger=0;
  for(var idx in values) {
    //Calculates the total number of tweets
    //and the total 'Happy','Sad'.. emotions tweets
    analysis.tweets+=1;
    var sentiment=values[idx];
    if(sentiment=="Happy")
      analysis.happy+=1;
    else if (sentiment == "Sad")
      analysis.sad+=1;
    else if (sentiment == "Neutral")
      analysis.neutral+=1;
    else if (sentiment == "Empty")
      analysis.empty+=1;
    else if (sentiment == "Enthusiasm")
      analysis.enthusiasm+=1;  
    else if (sentiment == "Worry")
      analysis.worry+=1;
    else if (sentiment == "Surprise")
      analysis.surprise+=1;
    else if (sentiment == "Love")
      analysis.love+=1;
    else if (sentiment == "Fun")
      analysis.fun+=1;      
    else if (sentiment == "Hate")
      analysis.hate+=1;  
    else if (sentiment == "Boredom")
      analysis.boredom+=1;
    else if (sentiment == "Relief")
      analysis.relief+=1;
    else if (sentiment == "Anger")
      analysis.anger+=1;
  }
 }
 else{
 //Rereduce is true, it aggregates the values from reduce
  for(var idx in values) {
      analysis.tweets+=values[idx].tweets;
      analysis.happy+=values[idx].happy;
      analysis.sad+=values[idx].sad;
      analysis.neutral+=values[idx].neutral;
      analysis.empty+=values[idx].empty;
      analysis.enthusiasm+=values[idx].enthusiasm;
      analysis.worry+=values[idx].worry;
      analysis.surprise+=values[idx].surprise;
      analysis.love+=values[idx].love;
      analysis.fun+=values[idx].fun;
      analysis.hate+=values[idx].hate;
      analysis.boredom+=values[idx].boredom;
      analysis.relief+=values[idx].relief;
      analysis.anger+=values[idx].anger;
  }
 }
 
//Percentage for the emotion is calculated based on the total of that emotion/ total tweets *100
 analysis.happyPercent=(analysis.happy/analysis.tweets)*100; 
 analysis.sadPercent=(analysis.sad/analysis.tweets)*100; 
 analysis.neutralPercent=(analysis.neutral/analysis.tweets)*100; 
 analysis.emptyPercent=(analysis.empty/analysis.tweets)*100; 
 analysis.enthusiasmPercent=(analysis.enthusiasm/analysis.tweets)*100; 
 analysis.worryPercent=(analysis.worry/analysis.tweets)*100; 
 analysis.surprisePercent=(analysis.surprise/analysis.tweets)*100; 
 analysis.lovePercent=(analysis.love/analysis.tweets)*100; 
 analysis.funPercent=(analysis.fun/analysis.tweets)*100; 
 analysis.hatePercent=(analysis.hate/analysis.tweets)*100; 
 analysis.boredomPercent=(analysis.boredom/analysis.tweets)*100; 
 analysis.reliefPercent=(analysis.relief/analysis.tweets)*100; 
 analysis.angerPercent=(analysis.anger/analysis.tweets)*100;

//Returns the analysis set
  return analysis; 
}



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


### State and Suburb Details
##Map
function (doc) {
  //Map contains the state name and their suburb names 
  if(doc.type=="Suburb"){
       emit(doc.state,doc.suburbName)
  }
}

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


###State Suburb Day Hour Mins And Sentiment
###Map
function(doc) {
  //If the document is a Tweet then it checks for the date and time when it was tweeted
  if(doc.type=="Tweet"){
	date = new Date(Date.parse((doc.created_at)));
	//The date structure has the day as first elemnt which is store in weekday
	weekday = doc.created_at.split(" ")[0]
	hour = date.getUTCHours()
	mins=date.getMinutes()
	emit([doc.stateTag,doc.geoTag.city,weekday,hour,mins], [doc.sentimentTag])
}
}


###REDUCE
function(keys, values,rereduce) {
  
  analysis={'tweets':0, 'happy':0, 'sad':0, 'neutral':0, 'empty':0, 'enthusiasm':0, 'worry':0, 'surprise':0,'love':0, 'fun':0, 'hate':0, 'boredom':0, 'relief':0, 'anger':0, 'happyPercent':0, 'sadPercent':0, 'neutralPercent':0, 'emptyPercent':0, 'enthusiasmPercent':0, 'worryPercent':0, 'surprisePercent':0, 'lovePercent':0, 'funPercent':0, 'hatePercent':0, 'boredomPercent':0, 'reliefPercent':0, 'angerPercent':0};
 if(rereduce==false){
  analysis.tweets=0;analysis.happy=0;analysis.sad=0;analysis.neutral=0;
  analysis.empty=0; analysis.enthusiasm=0; analysis.worry=0; analysis.surprise=0;
  analysis.love=0; analysis.fun=0; analysis.hate=0; analysis.boredom=0;
  analysis.relief=0; analysis.anger=0;
  for(var idx in values) {
    //totals the tweets and total number of tweets based on a sentiment
    analysis.tweets+=1;
    var sentiment=values[idx][0];
    if(sentiment=="Happy")
      analysis.happy+=1;
    else if (sentiment == "Sad")
      analysis.sad+=1;
    else if (sentiment == "Neutral")
      analysis.neutral+=1;
    else if (sentiment == "Empty")
      analysis.empty+=1;
    else if (sentiment == "Enthusiasm")
      analysis.enthusiasm+=1;  
    else if (sentiment == "Worry")
      analysis.worry+=1;
    else if (sentiment == "Surprise")
      analysis.surprise+=1;
    else if (sentiment == "Love")
      analysis.love+=1;
    else if (sentiment == "Fun")
      analysis.fun+=1;      
    else if (sentiment == "Hate")
      analysis.hate+=1;  
    else if (sentiment == "Boredom")
      analysis.boredom+=1;
    else if (sentiment == "Relief")
      analysis.relief+=1;
    else if (sentiment == "Anger")
      analysis.anger+=1;
  }
 }
 else{
//aggregates the reduced values
  for(var idx in values) {
      analysis.tweets+=values[idx].tweets;
      analysis.happy+=values[idx].happy;
      analysis.sad+=values[idx].sad;
      analysis.neutral+=values[idx].neutral;
      analysis.empty+=values[idx].empty;
      analysis.enthusiasm+=values[idx].enthusiasm;
      analysis.worry+=values[idx].worry;
      analysis.surprise+=values[idx].surprise;
      analysis.love+=values[idx].love;
      analysis.fun+=values[idx].fun;
      analysis.hate+=values[idx].hate;
      analysis.boredom+=values[idx].boredom;
      analysis.relief+=values[idx].relief;
      analysis.anger+=values[idx].anger;
  }
 }
 //calculates the percent for each sentiment 
 analysis.happyPercent=(analysis.happy/analysis.tweets)*100; 
 analysis.sadPercent=(analysis.sad/analysis.tweets)*100; 
 analysis.neutralPercent=(analysis.neutral/analysis.tweets)*100; 
 analysis.emptyPercent=(analysis.empty/analysis.tweets)*100; 
 analysis.enthusiasmPercent=(analysis.enthusiasm/analysis.tweets)*100; 
 analysis.worryPercent=(analysis.worry/analysis.tweets)*100; 
 analysis.surprisePercent=(analysis.surprise/analysis.tweets)*100; 
 analysis.lovePercent=(analysis.love/analysis.tweets)*100; 
 analysis.funPercent=(analysis.fun/analysis.tweets)*100; 
 analysis.hatePercent=(analysis.hate/analysis.tweets)*100; 
 analysis.boredomPercent=(analysis.boredom/analysis.tweets)*100; 
 analysis.reliefPercent=(analysis.relief/analysis.tweets)*100; 
 analysis.angerPercent=(analysis.anger/analysis.tweets)*100;

//returns the analysis set
  return analysis; 
}

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


### Suburb State and Tweet Count
###Map
function (doc) {
  if(doc.type=="Tweet"){
     emit([doc.geoTag.city, doc.stateTag], 1); 
  }
}


###Reduce
_count

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


###University Student Percent Suburb
###Map
function (doc) {
  if(doc.type=="Suburb")
  {
    //For suburbrb document it maps state and the percent of Student in the suburb
   emit([doc.state,doc.uniStudentPercent],1); 
  }
}

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


###Literacy Rate of Suburb
###Map
function (doc) {
  if(doc.type=="Suburb")
  {
    // For suburb document it maps the state and the percent of people who completed primary education
   emit([doc.state,doc.yearTwelvePassPercent],1); 
  }
}

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


###State and Median Salary
###Map
function (doc) {
  if(doc.type=="Suburb")
  {
    //For all the suburb documents it maps state and its median income
   emit([doc.state,doc.medianIncome],1); 
  }
}

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


###HASHTAGS
###Map


function(doc) {
    for(i in doc.entities.hashtags){
      if(doc.entities.hashtags[i]){
 	str = JSON.stringify(doc.entities.hashtags[i].text);
 	if(str){
	str = str.split("\"");
      emit([str[1],doc.stateTag,doc.geoTag.city], 1);
	
 	}
 	}
    }
}


###REDUCE
function(keys, counts) {
  var sum = 0;
  for(var i=0; i < counts.length; i++) {
     sum += counts[i];
  }
  return sum;
}


