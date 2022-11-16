
function deleteMedication(medicationID) {
    let link = '/delete-medication-ajax/';
    let data = {
      medication_id: medicationID
    };

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(medicationID);
      }
    });
  }

  function deleteRow(medicationID){
      let table = document.getElementById("medications-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == medicationID) {
              table.deleteRow(i);
              break;
         }
      }
  }