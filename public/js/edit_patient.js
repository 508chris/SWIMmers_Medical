/* 
   Citation for the following functions:
   Date: 12/05/2022
   Based on:
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function editPatient(patientID) {
    let link = '/put-patient-ajax/';
    let data = '/patient/'
    console.log(data);
    




    $.ajax({
      url: link,
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        updateRow(patientID);
      }
    });
  }
  
  function updateRow(patientID){
      let table = document.getElementById("patient-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == patientID) {
              table.updateRow(i);
              break;
         }
      }
  }