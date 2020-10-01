$(document).ready(function(){ 
    //var ingredient = document.querySelector("input[value=value]");

    $("button.save-btn").click(function(){
        var ingredient = document.getElementById("ingredientName").value;
        var unit = document.getElementById("unit");
        var unitID = unit.options[unit.selectedIndex].getAttribute("data-id");
        
        $.ajax({
            url: '/ingredients/add',
            method: 'POST',
            data: {
                ingredientName: ingredient,
                unitID: unitID
            },
            error: () => callback(),
            success: function(){
                alert("Ingredient successfully saved!");
                window.location.href="/ingredients"; 
            }
        });
    });
});