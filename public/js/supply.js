$(document).ready(function(){ 
    $('#selectIng option').each(function() {
        if(this.selected){
          console.log("sana may laman");
          console.log($(this).attr('data-id'));
          $.ajax({
            url: '/unit/name',
            method: 'POST',
            data: {
              id: $(this).attr('data-id')
            },
            error: function(){
              alert("Error selecting ingredient");
            },
            success: function(unit){
              console.log(unit);
              $('#unit').val(unit.unitName)
            }
          });
        }
    })

    $('#selectIng').change(function() {
        $('#selectIng option').each(function() {
          if(this.selected){
            console.log("sana may laman");
            console.log($(this).attr('data-id'));
            $.ajax({
              url: '/unit/name',
              method: 'POST',
              data: {
                id: $(this).attr('data-id')
              },
              error: function(){
                alert("Error selecting ingredient");
              },
              success: function(unit){
                console.log(unit);
                $('#unit').val(unit.unitName)
              }
            });
          }
        })
      })

    $("button.save-btn").click(function(){
        var brand = document.getElementById("supplyBrand").value;
        var unitQty = document.getElementById("unitQty").value;
        var ingredient = document.getElementById("select-ingredient");
        var ingredientID = ingredient.options[ingredient.selectedIndex].getAttribute("data-id");
        
        if(brand == "" || unitQty == "" || ingredient == "" ){
            alert("Please fill out all fields!");
        }
        else if(unitQty <= 0){
            alert("You cannot enter a zero or negative value!");
        }
        else if(unitQty % 1 != 0){
            alert("Invalid value! Enter intger for unitQty.");
        }
        else{
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
        }
    });
});