
document.getElementById('select').onclick = function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var checkbox of checkboxes) {
        document.body.append(checkbox.value + ' ');
    }
}