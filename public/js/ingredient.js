$(document).ready(function() {
    //var ingredient = document.querySelector("input[value=value]");

    $("button.save-btn").click(function() {
        var ingredient = document.getElementById("ingredientName").value;
        var unit = document.getElementById("unit");
        var unitID = unit.options[unit.selectedIndex].getAttribute("data-id");

        if (ingredient == "" || unit == "") {
            alert("Fill all fields");
        } else {
            $.ajax({
                url: '/ingredients/add',
                method: 'POST',
                data: {
                    ingredientName: ingredient,
                    unitID: unitID
                },
                error: function(){
                    alert("Error adding ingredient!");
                },
                success: function() {
                    window.location.href = "/ingredients";
                }
            });
        }

    });
});