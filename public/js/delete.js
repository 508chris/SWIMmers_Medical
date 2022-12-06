/* 
   Citation for the following functions:
   Date: 12/05/2022
   Based on:
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
function deleteDoctor(doctorID) {
    let link = '/delete-doctor-ajax/';
    let data = {
      id: doctorID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(doctorID);
      }
    });
  }
  
  function deleteRow(personID){
      let table = document.getElementById("doctor-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == doctorID) {
              table.deleteRow(i);
              break;
         }
      }
  }
