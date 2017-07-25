//Index for all characters given in "Hirangi number order.txt". For example か=5, so 5.mp3,5.gif, englishEquiv[5],chars[5],isSelected[5] are all tied to か .

var chars=["\u3042","\u3044","\u3046","\u3048","\u304A","\u304B","\u304D","\u304F","\u3051","\u3053","\u3055","\u3057","\u3059","\u305B","\u305D","\u305F","\u3061","\u3064","\u3066","\u3068","\u306A","\u306B","\u306C","\u306D","\u306E","\u306F","\u3072","\u3075","\u3078","\u307B","\u307E","\u307F","\u3080","\u3081","\u3082","\u3084","\u3086","\u3088","\u3089","\u308A","\u308B","\u308C","\u308D","\u308F","\u3092","\u3093"];
//Unicode for the Hiragana  Characters
//Converted to Unicode using https://r12a.github.io/apps/conversion/

var englishEquiv=["a","i","u","e","o","ka","ki","ku","ke","ko","sa","si","su","se","so","ta","ti","tu","te","to","na","ni","nu","ne","no","ha","hi","hu","he","ho","ma","mi","mu","me","mo","ya","yu","yo","ra","ri","ru","re","ro","wa","wo","n"];
//Romaji code for each character

var isSelected=[];
//True if a character has been selected, otherwise false
var numSelected=0;
//The amount of characters the user has selected. Quiz will not be startable unless it is over 9.
var arraySelected=[]; //An array of integers that represent the selected Chars
var randomChosen=[]; //The 10 randomly chosen integers for the quiz
var score=undefined;
buttonSelect=false;
var i=undefined;
var rounds=[];
var user=undefined;
var password=undefined;
var score=undefined;
var isUserSuccessful=undefined;
var isPasswordSuccessful=undefined;
var isSessionSaved=undefined;


function loadPage(){ //Creates all elements on the page and gives them their attributes
	var elementContainer=document.getElementById("elementContainer"); //Element View- Shows all characters and allows user to select characters
	var quizContainer=document.getElementById("quizContainer");

	for(i=0;i<46;i++){
		//Setup Text
		var myText=document.createElement("span");
		myText.innerHTML=chars[i]+" ("+englishEquiv[i]+")"; //Eg:"か (ka)"
		myText.setAttribute("class","charSet");
		myText.setAttribute("id","Char"+i);//Eg:Char5
		myText.setAttribute("onclick","playAudio("+i+")");//Eg playAudio(5);
		elementContainer.appendChild(myText);
		
		//Setup HoverImage 
		var myImage=document.createElement("IMG");
		myImage.id="img"+i;
		myImage.setAttribute("src",("img/"+i+".gif"));
		myText.appendChild(myImage);
		myImage.setAttribute("onclick","toggleSelect("+i+")");

		isSelected[i]=false;
	}

	var formTemp=document.getElementById("myForm");
	for(i=0;i<4;i++){
		var option=document.createElement("input");
		var text=document.createElement("span");
		text.setAttribute("id","answer"+i);
		text.setAttribute("class","answer");
		option.setAttribute("id","option"+i);
		option.setAttribute("type","radio");
		option.setAttribute("name","answer");
		option.setAttribute("value",i);
		if(i===0){ //Have a default select
			option.checked=true;
		}
		formTemp.appendChild(option);
		formTemp.appendChild(text);
		formTemp.appendChild(document.createElement("br"));
	}
	
	var selectNextRoundButton=document.createElement("button");
	selectNextRoundButton.setAttribute("id","selectNextRoundButton");
	selectNextRoundButton.setAttribute("onclick","button=true;");
    selectNextRoundButton.setAttribute("type","button");
	selectNextRoundButton.innerHTML="Select";
	formTemp.appendChild(selectNextRoundButton);
	
	var scoreGiver=document.createElement("p");
	scoreGiver.innerHTML="Your score is 0/10, 10 Questions left";
	scoreGiver.setAttribute("id","scoreGiver");
	formTemp.appendChild(scoreGiver);
	
	//document.querySelector('input[name = "answer"]:checked').value; returns the value of the selected radio button

}

function playAudio(soundNum){ //Plays Sound File of the character clicked 
	var myAudio = new Audio("sound/"+soundNum+".mp3");
	myAudio.play();
}

function toggleSelect(selectNum){ //Toggles if a character is selected for the Quiz
	var selText=document.getElementById("Char"+selectNum);
	
	if(isSelected[selectNum]===false){//Selecting a character
		isSelected[selectNum]=true;
		selText.style.borderColor="#FF0000";
		selText.style.borderWidth="4px";
		numSelected++;
	}
	else{//Deselecting a character
		isSelected[selectNum]=false;
		selText.style.borderColor="#000000";
		selText.style.borderWidth="1px";
		numSelected--;
	}
}

function hideElem(){//Hides the Element view, shows Quiz view
	var myDiv=document.getElementById("elementContainer");
	myDiv.style.display="none";
	myDiv=document.getElementById("quizContainer");
	myDiv.style.display="block";
	document.getElementById("instructionText").innerHTML="Please enjoy the Quiz";
}

function showElem(){//Shows the element view, hides element view
	var myDiv=document.getElementById("elementContainer");
	myDiv.style.display="block";
	myDiv=document.getElementById("quizContainer");
	myDiv.style.display="none";
	document.getElementById("instructionText").innerHTML="Hover over a character to see it's Stroke order. Click a character to hear it's female and male pronounciation. <br /> Click on the stroke order to select/deselect that character for assessment.";
}

function startQuiz() { //Starts the Quiz if more than 9 elements selected
    score = 0;
    var scoreGiver=document.getElementById("scoreGiver");
    scoreGiver.innerHTML="10 Questions left, your score is 0/10";
    randomChosen = [];
	rounds = [];// Array of Round objects
    //noinspection JSAnnotator
    if (numSelected < 10) {
        alert("Please select at least " + (10 - numSelected) + " more characters");
    }
    else {
        hideElem();
        var myButton = document.getElementById("quizStartStopButton");
        myButton.setAttribute("onclick", "stopQuiz();");
        myButton.innerHTML = "Stop Quiz";
        for (var i = 0; i < 46; i++) {
            if (isSelected[i] === true) {
                arraySelected.push(i);//Adds a number to arraySelected if it is selected.
            }
        }
        fillRandom();//Sets up the Random Characters
        for (i = 0; i < 10; i++) {//Setup the Rounds
            rounds.push(new Round(randomChosen[i],i));
        }
        rounds[0].setupRound();
        document.getElementById("selectNextRoundButton").setAttribute("onclick","rounds[0].checkAnswer();")
    }
}

function stopQuiz(){//Stops the Quiz 
	showElem();
	var myButton=document.getElementById("quizStartStopButton");
	myButton.setAttribute("onclick","startQuiz();");
	myButton.innerHTML="Start Quiz";
	arraySelected=[];
	randomChosen=[];
}

function fillRandom(){//Fills an array of 10 random characters from the set of selected characters
	for(i=0;i<10;i++){
		var x=Math.random()*arraySelected.length;// x is a random number between 0 and the amount of elements Selected
		x=Math.floor(x); //makes sure it is an integer
		randomChosen.push(arraySelected[x]);
		arraySelected.splice(x,1);//Removes element x from arraySelected (prevents double selection)
	}
}


function Round(num,roundNumber){ //Has
    this.num=num;//Number of character being tested
	this.roundNumber=roundNumber;

    var isRomaji=Math.random()*2;
	isRomaji=Math.floor(isRomaji);
    this.isRomaji=isRomaji;

    var correctOption=Math.random()*4;
    correctOption=Math.floor(correctOption);
    this.correctOption=correctOption;
    var myButton=document.getElementById("selectNextRoundButton");
    var scoreGiver=document.getElementById("scoreGiver");
    this.setupRound=function(){//Setups the Round
        var currentQ=document.getElementById("currentQ");
        console.log(correctOption);
        myButton.innerHTML="Select";
        myButton.setAttribute("onclick","rounds["+roundNumber+"].checkAnswer();");
        var option=undefined, tempArray=undefined, x=undefined;
        if(isRomaji===0){//Test Romaji against Hiragana  characters
            currentQ.innerHTML=englishEquiv[num];
            tempArray=chars.slice();
            tempArray.splice(num,1);//Gets rid of correctAnswer
			for(i=0;i<4;i++) {
                option = document.getElementById("answer" + i);
                if (i === correctOption) {
                    option.innerHTML = chars[num];
                }
                else {
                    x = Math.floor(Math.random() * tempArray.length);
                    option.innerHTML = tempArray[x];
                    tempArray.splice(x, 1);
                }
                option.removeAttribute("style");
            }
		}
        else{//hiragana against  Romaji chars
            currentQ.innerHTML=chars[num];
            tempArray=englishEquiv.slice();
            tempArray.splice(num,1);//Gets rid of correctAnswer

			for(i=0;i<4;i++){
                option=document.getElementById("answer"+i);
                if(i===correctOption){
                    option.innerHTML=englishEquiv[num];
                }
                else{
                    x=Math.floor(Math.random()*tempArray.length);
                    option.innerHTML=tempArray[x];
                    tempArray.splice(x,1);
                }
                option.removeAttribute("style");
            }
        }
	};

    this.checkAnswer=function() {
        var chosenOption=document.querySelector('input[name="answer"]:checked').value;
        if(chosenOption==correctOption){
            document.getElementById("answer"+correctOption).style.backgroundColor="#8cff57";
            scoreGiver.innerHTML="Correct: ";
            score++;
		}
		else{
            document.getElementById("answer"+correctOption).style.backgroundColor="#8cff57";
            document.getElementById("answer"+chosenOption).style.backgroundColor="#ff5d5d";
            scoreGiver.innerHTML="Incorrect: ";
		}
        scoreGiver.innerHTML+=("Your score is "+(score)+"/10, "+(9-roundNumber)+" questions left. Percentage so far: "+Math.floor((100*(score/(roundNumber+1))))+"%");
        if(roundNumber<9){
        	myButton.innerHTML="Next Question";
        	myButton.setAttribute("onclick","rounds["+(roundNumber+1)+"].setupRound();");
		}
		else{
        	myButton.innerHTML="End Quiz";
        	alert("Final score is "+score+"/10 : "+(10*(score))+"%");
            myButton.setAttribute("onclick","stopQuiz();");
		}
	}
}

