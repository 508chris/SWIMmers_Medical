/* 
   Citation for the following functions:
   Date: 12/05/2022
   Based on:
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
function deletePatient(patientID) {
    let link = '/delete-patient-ajax/';
    let data = {
      patient_id: patientID
    };

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(patientID);
      }
    });
  }

  function deleteRow(personID){
      let table = document.getElementById("patient-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == patientID) {
              table.deleteRow(i);
              break;
         }
      }
  }