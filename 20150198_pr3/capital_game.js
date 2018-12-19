$( document ).ready(function() {

var config = {
  apiKey:"AIzaSyC4PgqPh8GgOf00lW6QZg0E-adywqd3tjQ",
  databaseURL: "https://cs374-tut3-61af7.firebaseio.com/",
};
firebase.initializeApp(config);

var numobj;
var historyIndex;
var database = firebase.database()
var addrowRef = database.ref('addrow')
var historyRef = database.ref('history');
///refreshList();

addrowRef.on('value', function(snapshot){
  numobj = snapshot.numChildren();
})
historyRef.on('value', function(snapshot){
  historyIndex = snapshot.numChildren();
})

function Addfirebase(country, capital, answer, correct){
   var key;
   var newObject = {
      country : country,
      capital : capital,
      answer : answer,
      correct : correct,
   }
   addrowRef.on('value', function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
       key = childSnapshot.key;
   })})
   historyRef.on('value', function(snapshot){
     historyIndex = snapshot.numChildren();
     if (historyIndex == null){
        historyIndex = 0;
     }
   })

   if (key == null) {
     addrowRef.child(String(0)).set(newObject);
     var historyObject = {
        key : String(0),
        add : 1,
     }
     historyRef.child(String(Number(historyIndex))).set(historyObject);
   }
   else {
     var a = String(Number(key)+1);
     addrowRef.child(a).set(newObject);
     var historyObject = {
       key : a,
       add : 1,
     }
     historyRef.child(String(Number(historyIndex))).set(historyObject);
   }
   
}

function DeleteAll(){
   addrowRef.remove();
}


var pair = [];
  $.ajax({
     url : 'https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv',
     dataType : 'text',
     async : false,
  }).done(csvJson);

  function csvJson(data){
     var lines = data.split("\n");
     var headers = lines[0].split(",");
     for (var i=1;i<lines.length;i++){
         var obj = {};
         var currentline = lines[i].split(",");
         var splitcapital = currentline[1].split("\r");
         obj["country"] = currentline[0];
         obj["capital"] = splitcapital[0];
         pair.push(obj);
     }
     window.pairs = pair;
   }

var country_capital_pairs = pair;

  

     $(function(){
       var capitalpair = []
       for (var i = 0; i<pairs.length; i++){
         capitalpair.push(pairs[i]["capital"]);
       }
         $("#pr2__answer").autocomplete({
            source: capitalpair,
            minLength:2,
            autoFocus: true,
            select : function(event, ui){                   
                 $("#pr2__answer").val(ui.item.value);
                 btn.onclick();
                 $("#pr2__answer").val('');
                 return false;

            }
         });
      })
      
      $(document).on("change","input[type=radio]",function(){
        refreshList();
      });
      
      $(document).on("click","#obj",function(event){
         rowdelete();
      });

answer = [];

var temp;
var Idx = -1;

temp = document.getElementById("pr2__question");



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillContent(divObj, content) {
  divObj.innerHTML = content
}

function refreshOptions() {
  var idx
  idx = getRandomInt(0, country_capital_pairs.length-1);
  fillContent(temp, country_capital_pairs[idx]["country"]);
  var addr = country_capital_pairs[idx]["country"];
  var embed= "<iframe width='500' height='400' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyCMg_4NSL1Ax1O3l17D_WNvbtL1r1_2eNI&q="+encodeURIComponent( addr ) + "&maptype=satellite'></iframe>";  
  $('.map').html(embed);
  Idx = idx;
  document.getElementById('pr2__answer').focus();
}

function aremove_item(num) {
  var temp = -1;
  addrowRef.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
       var key = childSnapshot.key;
       temp++;
       if (temp == Number(num)){
          historyRef.on('value', function(snapshot){
          historyIndex = snapshot.numChildren();
          })
          var historyObject = {
            key : key,
            country : childSnapshot.val().country,
            capital : childSnapshot.val().capital,
            answer : childSnapshot.val().answer,
            correct : childSnapshot.val().correct,
            add : 0,
          }
          historyRef.child(String(Number(historyIndex))).set(historyObject);
          addrowRef.child(key).remove();
       }
  })})
  refreshList();
}

function cremove_item(num) {
  var temp2 = -1;
  addrowRef.on('value', function(snapshot) {
   snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    if (childSnapshot.val().correct == 1){
      temp2++;
      if (temp2 == Number(num)){
          historyRef.on('value', function(snapshot){
          historyIndex = snapshot.numChildren();
          })
          var historyObject = {
            key : key,
            country : childSnapshot.val().country,
            capital : childSnapshot.val().capital,
            answer : childSnapshot.val().answer,
            correct : childSnapshot.val().correct,
            add : 0,
          }
          historyRef.child(String(Number(historyIndex))).set(historyObject);
        addrowRef.child(key).remove();
      }     
    }
  })})
  refreshList(); 
}

function dremove_item(num) {
  var temp3 = -1;
  addrowRef.on('value', function(snapshot) {
   snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    if (childSnapshot.val().correct == 0){
      temp3++;
      if (temp3 == Number(num)){
          historyRef.on('value', function(snapshot){
          historyIndex = snapshot.numChildren();
          })
          var historyObject = {
            key : key,
            country : childSnapshot.val().country,
            capital : childSnapshot.val().capital,
            answer : childSnapshot.val().answer,
            correct : childSnapshot.val().correct,
            add : 0,
          }
          historyRef.child(String(Number(historyIndex))).set(historyObject);
        addrowRef.child(key).remove();
      }     
    }
  })})
  refreshList(); 
}

function countryclick(countryname) {
  var addr = countryname;
  var embed= "<iframe width='500' height='400' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyCMg_4NSL1Ax1O3l17D_WNvbtL1r1_2eNI&q="+encodeURIComponent( addr ) + "&maptype=satellite'></iframe>";  
  $('.map').html(embed);
}

var addrow = document.getElementById('addrow');
var allcount = '';
var corcount = '';
var delcount = '';
var number = 0;

var btn = document.getElementById("pr2__submit");
var btn2 = document.getElementById("pr3__clear");
var btn3 = document.getElementById("pr3__undo");
var btn4 = document.getElementById("pr3__reset");

function refreshList() {
 var row;
 var cell1;
 var cell2;
 var cell3;
 var numRows = addrow.rows.length;
  for(var i=0;i<numRows;i++) {
      addrow.deleteRow(0);
   }
  if ($('input:radio[name=select]:checked').val() == "All"){
        number = -1;
        addrowRef.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
          number++;
          allcount = String(number);
          var obj = document.createElement("input");
          obj.setAttribute('type', 'button');
          obj.name = allcount;
          obj.value = 'Delete';
          obj.onclick = function() {aremove_item(this.name);} 
          
          if (childSnapshot.val().correct == 1){  
           var check_icon = document.createElement("i");
           check_icon.setAttribute ('class', "fas fa-check");
           check_icon.style.color = "blue";
           row = addrow.insertRow(0);
           cell1 = row.insertCell(0);
           cell2 = row.insertCell(1);
           cell3 = row.insertCell(2);
           cell1.innerHTML = childSnapshot.val().country;
           cell2.innerHTML = childSnapshot.val().capital;
           cell1.style.color = "blue";
           cell2.style.color = "blue";
           cell3.appendChild(check_icon);
           cell3.appendChild(obj);
           cell1.onmouseover = function() {
              this.style.cursor = 'pointer';
           }
           cell1.onclick = function() {countryclick(childSnapshot.val().country);}
           }
          else {
           row = addrow.insertRow(0);
           cell1 = row.insertCell(0);
           cell1.name = allcount;
           cell2 = row.insertCell(1);
           cell3 = row.insertCell(2);
           cell1.innerHTML = childSnapshot.val().country;
           cell2.innerHTML = childSnapshot.val().answer;
           cell3.innerHTML = childSnapshot.val().capital;
           cell1.style.color = "red";
           cell2.style.color = "red";
           cell2.style.setProperty("text-decoration", "line-through");
           cell3.style.color = "red";
           cell3.appendChild(obj);
           cell1.onclick = function() {countryclick(childSnapshot.val().country);}
          }
           cell1.onmouseover = function() {
              this.style.cursor = 'pointer';
           }
         })})
  }
      else if ($('input:radio[name=select]:checked').val() == "Correct"){
        number = -1;
        addrowRef.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.val().correct == 1){ 
           number++;
           corcount = String(number);
           var obj = document.createElement("input");
           obj.setAttribute('type', 'button');
           obj.name = corcount;
           obj.value = 'Delete';
           obj.onclick = function() {cremove_item(this.name);}
           var check_icon = document.createElement("i");
           check_icon.setAttribute ('class', "fas fa-check");
           check_icon.style.color = "blue";
           row = addrow.insertRow(0);
           cell1 = row.insertCell(0);
           cell2 = row.insertCell(1);
           cell3 = row.insertCell(2);
           cell1.innerHTML = childSnapshot.val().country;
           cell2.innerHTML = childSnapshot.val().capital;
           cell1.style.color = "blue";
           cell2.style.color = "blue";
           cell3.appendChild(check_icon);
           cell3.appendChild(obj);
           cell1.onmouseover = function() {
              this.style.cursor = 'pointer';
           }
           cell1.onclick = function() {countryclick(childSnapshot.val().country);}
           }
       })})
      }
       else {
         number = -1;
        addrowRef.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.val().correct == 0) {
           number++;
           delcount = String(number);
           var obj = document.createElement("input");
           obj.setAttribute('type', 'button');
           obj.name = delcount;
           obj.value = 'Delete';
           obj.onclick = function() {dremove_item(this.name);}
           row = addrow.insertRow(0);
           cell1 = row.insertCell(0);
           cell2 = row.insertCell(1);
           cell3 = row.insertCell(2);
           cell1.innerHTML = childSnapshot.val().country;
           cell2.innerHTML = childSnapshot.val().answer;
           cell3.innerHTML = childSnapshot.val().capital;
           cell1.style.color = "red";
           cell2.style.color = "red";
           cell2.style.setProperty("text-decoration", "line-through");
           cell3.style.color = "red";
           cell3.appendChild(obj);
           cell1.onmouseover = function() {
              this.style.cursor = 'pointer';
           }
           cell1.onclick = function() {countryclick(childSnapshot.val().country);}
          }
          })})
       }
   btn2.disabled = (numobj !=0) ? '' : 'disabled';
   btn3.disabled = (historyIndex != 0) ? '' : 'disabled';
}
               

btn.onclick = function() {
  if ($('#pr2__answer').val() != ''){
    if ($('input:radio[name=select]:checked').val() == "Wrong"){
        if (country_capital_pairs[Idx]["capital"] == $('#pr2__answer').val()) {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1]);
          Addfirebase(country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1);
          $("#All").prop("checked", true);
          }    
          else {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0]);
          Addfirebase(country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0);
          }
     }
     else if ($('input:radio[name=select]:checked').val() == "Correct"){
        if (country_capital_pairs[Idx]["capital"] == $('#pr2__answer').val()) {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1]);
          Addfirebase(country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1);
          }    
        else {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0]);
          Addfirebase(country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0);
          $("#All").prop("checked", true);
          }
      }
      else if ($('input:radio[name=select]:checked').val() == "All"){
        if (country_capital_pairs[Idx]["capital"] == $('#pr2__answer').val()) {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1]);
          Addfirebase(country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1);
        }    
        else {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0]);
          Addfirebase(country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0);
         }
     }
    }
    $('#pr2__answer').val('');
    refreshList();
    refreshOptions();
  }

var clearvalue;

btn2.onclick = function() {
  var clearobjnum = 0;
  historyRef.on('value', function(snapshot){
     historyIndex = snapshot.numChildren();
     if (historyIndex == null){
        historyIndex = 0;
     }
  })
  addrowRef.on('value', function(snapshot){
     clearvalue = snapshot.val();
  })
  var clearObject = {
     add : 2,
     val : clearvalue,
  }
  historyRef.child(String(Number(historyIndex))).set(clearObject);
  answer = [];
  DeleteAll();
  refreshList();
  numobj = 0;
}

function rowdelete(){
  for (var j = 0; j< answer.length; j++){
    if (allobj[j][0].click()==true){
      var temp2 = allobj[j][1];
    }
  }
  answer.remove(temp2);
  addrowRef.remove(temp2);
  refreshList();
}

var historykey;
var historyupdate;

btn3.onclick = function() {
  historyRef.on('value', function(snapshot) {
   snapshot.forEach(function(childSnapshot) {
    historykey = childSnapshot.key;
    historyupdate = childSnapshot.val();
   })})
   var newObject = {
      country : historyupdate.country,
      capital : historyupdate.capital,
      answer : historyupdate.answer,
      correct : historyupdate.correct,
   }
   if (historyupdate.add == 1){
      addrowRef.child(historyupdate.key).remove();
   }
   else if (historyupdate.add == 0 ){
      firebase.database().ref('addrow').child(String(historyupdate.key)).set(newObject);
   }
   else {
      firebase.database().ref('addrow').set(historyupdate.val);
   }
   historyRef.child(historykey).remove();
   refreshList();
}
  
btn4.onclick = function() {
  answer = [];
  DeleteAll();
  refreshList();
  numobj = 0;
  historyRef.remove();
  historyIndex = 0;
  btn3.disabled = 'disabled';
  btn2.disabled = 'disabled';
}

refreshList();
refreshOptions();
});
