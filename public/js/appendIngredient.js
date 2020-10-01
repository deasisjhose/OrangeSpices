$(document).ready(function(){ 
    var ingArray = [];

    function addIng(id, qty, unit) {
        ingArray.push({id: id, qty: Number.parseInt(qty), unit: unit});
    }
    
    var i=1;  
    var idIngList = [], ingName = [], qtyList = [], unitList = [];

  $('#addIngredient').click(function(){  

    console.log("adding...");
    var selectIng = document.getElementById("selectIng");
    var selectedValue = selectIng.options[selectIng.selectedIndex].value;
    var selectedVal = selectIng.options[selectIng.selectedIndex].getAttribute("data-id");
    var qty = document.getElementById("quantity").value;
    var unit = document.getElementById("unit").value;

    idIngList.push(selectedVal);
    ingName.push(selectedValue);
    qtyList.push(qty);
    unitList.push(unit);

    addIng(selectedValue, qty, unit);

    console.log(idIngList); 
    console.log(ingName); 
    console.log(qtyList);
    console.log(unitList); 

    i++;  
    $('#dynamic_field').append('<tr id="row'+i+'"><td><input disabled="disabled" class="form-control" id="selectIng" name="ingredientName" placeholder="' + selectedValue +'" style="width:215px;"></input></td><td><input type="number" class="form-control" disabled="disabled" style="width:120px; height: 40px; margin-right: 20px; margin-left: 20px;" id="quantity" placeholder="' + qty +'"min="1"></td><td><input id="unit" class="form-control" disabled="disabled" placeholder="' + unit +'" style="width:150px; height: 40px;"></input></td><td><button style="margin-left: 25px; height: 40px;" type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">x Remove</button></td></tr>');  
    });  

  $(document).on('click', '.btn_remove', function(){  
         var button_id = $(this).attr("id");
         var index = button_id - 2; 
         console.log("removing..." + button_id);  
         $('#row'+button_id+'').remove();  
         ingName.splice(index, 1);
         console.log(ingName);
  });  

    $("button.save-btn").click(function(){
      $.ajax({

          url: '/products/add',
          method: 'POST',
          data: {
              idIngList: idIngList,
              ingName: ingName,
              qtyList: qtyList,
              unitList: unitList
              
          },
          error: () => callback(),
          success: a => callback(a)
      });
      window.location.replace("/products/add");
      alert("Product successfully saved!");
  });
    
}); 

// $(document).ready(function(){

//     $(this).on("click", "#addIngredient", function(){
//         var html = '<div class="row"><span>'+ $("#selectIng").val() + '</span> <span>' + $("#quantity").val() + '</span><span>'+ $("#unit").val() +'</span><button type="button" style="margin-left: 25px; width: 80px" id="remove" class="btn btn-primary btn-sm can-btn">Remove</button></div>';
//         $(".col-12").append(html);
//     });
    
//     $(this).on("click", "#remove", function(){
//         $(this).parent().remove();
//     });
    
// });