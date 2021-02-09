$(document).ready(function() {
    //var ingredient = document.querySelector("input[value=value]");

    $("button.save-btn").click(function() {
        var ingredient = document.getElementById("ingredientName").value;
        var unit = document.getElementById("unit");
        var unitID = unit.options[unit.selectedIndex].getAttribute("data-id");
        var minStock = document.getElementById("minimumStock").value;

        if (ingredient == "" || minStock == "") {
            alert("Fill all fields!");
        } else if (ingredient == "" && minStock != "") {
            alert("Please enter ingredient name!");
        } else if (ingredient != "" && minStock == "") {
            alert("Please enter minimum stock requirement!");
        } else {
            $.ajax({
                url: '/ingredients/add',
                method: 'POST',
                data: {
                    ingredientName: ingredient,
                    unitID: unitID,
                    minStock: minStock
                },
                error: function(){
                    window.location.href = "/ingredients";
                },
                success: function() {
                    window.location.href = "/ingredients";
                }
            });
        }

    });
});