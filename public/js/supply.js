$(document).ready(function(){ 
    $("button.save-btn").click(function(){
        var brand = document.getElementById("supplyBrand").value;
        var unitQty = document.getElementById("unitQty").value;
        var ingredient = document.getElementById("select-ingredient");
        var ingredientID = ingredient.options[ingredient.selectedIndex].getAttribute("data-id");
        
        $.ajax({
            url: '/supplies/add',
            method: 'POST',
            data: {
                supplyBrand: brand,
                ingredientName: ingredientID,
                unitQty: unitQty
            },
            error: () => callback(),
            success: function(){
                alert("Supply successfully saved!");
                window.location.href="/supplies"; 
            }
        });
    });
});