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
