$( document ).ready(function() {
  var country_capital_pairs = pairs;

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
  Idx = idx;
  document.getElementById('pr2__answer').focus();
}

function aremove_item(num) {
  ///array[num].outerHTML="";
  answer.splice(Number(num),1);
  refreshList();
}

function cremove_item(num) {
  var temp = 0;
  for (var k = 0; k<answer.length; k++){
    if (answer[k][3] == 1){
      if (temp == Number(num)){
        answer.splice(k,1);
        refreshList();
        retrun;
      }  
      temp++;
    }
  } 
}

function dremove_item(num) {
  //alert (num);
    var temp2 = 0;
    for (var p = 0; p<answer.length; p++){
      if (answer[p][3] == 0){
       if (temp2 == Number(num)){
          answer.splice(p,1);
          refreshList();  
          return;
        }   
        temp2++;     
    }
  }
}


 var addrow = document.getElementById('addrow');
 ///var checked_radio = $('input:radio[name=select]:checked').val();
 var allcount = '';
 var corcount = '';
 var delcount = '';
 var number = 0;
 ///var allobj = [];
 ///var corobj = [];
 ///var wrongobj = [];

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
        for (var i=0;i< answer.length;i++) {
          number++;
          allcount = String(number);
          var obj = document.createElement("input");
          obj.setAttribute('type', 'button');
          ///obj.setAttribute('name', '"+allcount+"');
          obj.name = allcount;
          obj.value = 'Delete';
          ///obj.setAttribute('value', 'Delete');
          obj.onclick = function() {aremove_item(this.name);} 
          
          if (answer[i][3] == 1){  
           var check_icon = document.createElement("i");
           check_icon.setAttribute ('class', "fas fa-check");
           ///check_icon.setAttribute('color', 'blue');
           check_icon.style.color = "blue";
           row = addrow.insertRow(0);
           cell1 = row.insertCell(0);
           cell2 = row.insertCell(1);
           cell3 = row.insertCell(2);
           cell1.innerHTML = answer[i][0];
           cell2.innerHTML = answer[i][1];
           cell1.style.color = "blue";
           cell2.style.color = "blue";
           cell3.appendChild(check_icon);
           cell3.appendChild(obj);
           }
          else {
           row = addrow.insertRow(0);
           cell1 = row.insertCell(0);
           cell2 = row.insertCell(1);
           cell3 = row.insertCell(2);
           cell1.innerHTML = answer[i][0];
           cell2.innerHTML = answer[i][2];
           cell3.innerHTML = answer[i][1];
           cell1.style.color = "red";
           cell2.style.color = "red";
           cell2.style.setProperty("text-decoration", "line-through");
           cell3.style.color = "red";
           cell3.appendChild(obj);
          }
        }
  }
      else if ($('input:radio[name=select]:checked').val() == "Correct"){
        number = -1;
        for (var i=0;i< answer.length;i++) {
          if (answer[i][3] == 1){ 
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
           cell1.innerHTML = answer[i][0];
           cell2.innerHTML = answer[i][1];
           cell1.style.color = "blue";
           cell2.style.color = "blue";
           cell3.appendChild(check_icon);
           cell3.appendChild(obj);
           }
      }
      }
       else {
         number = -1;
         for (var i=0;i< answer.length;i++) {
          if(answer[i][3] == 0) {
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
           cell1.innerHTML = answer[i][0];
           cell2.innerHTML = answer[i][2];
           cell3.innerHTML = answer[i][1];
           cell1.style.color = "red";
           cell2.style.color = "red";
           cell2.style.setProperty("text-decoration", "line-through");
           cell3.style.color = "red";
           cell3.appendChild(obj);
          }
          }
       }
}

               
var btn = document.getElementById("pr2__submit");

btn.onclick = function() {
  if ($('#pr2__answer').val() != ''){
    if ($('input:radio[name=select]:checked').val() == "Wrong"){
        if (country_capital_pairs[Idx]["capital"] == $('#pr2__answer').val()) {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1]);
          $("#All").prop("checked", true);
          }    
          else {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0]);
          }
     }
     else if ($('input:radio[name=select]:checked').val() == "Correct"){
        if (country_capital_pairs[Idx]["capital"] == $('#pr2__answer').val()) {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1]);
          }    
        else {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0]);
          $("#All").prop("checked", true);
          }
      }
      else if ($('input:radio[name=select]:checked').val() == "All"){
        if (country_capital_pairs[Idx]["capital"] == $('#pr2__answer').val()) {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"],  $('#pr2__answer').val(), 1]);
        }    
        else {
          answer.push([country_capital_pairs[Idx]["country"], country_capital_pairs[Idx]["capital"], $('#pr2__answer').val(), 0]);
         }
     }
    }
    $('#pr2__answer').val('');
    refreshList();
    refreshOptions();
  }

function rowdelete(){
  for (var j = 0; j< answer.length; j++){
    if (allobj[j][0].click()==true){
      var temp2 = allobj[j][1];
    }
  }
  answer.remove(temp2);
  refreshList();
}


refreshList();
refreshOptions();
});

