$(document).ready(function(){  
    var i=1;  
  $('#add').click(function(){  
         i++;  
         $('#dynamic_field').append('<tr id="row'+i+'"><td><select class="form-control" id="selectIng" name="ingredientName" style="width:215px;"><option selected="true" disabled="disabled">Select ingredient</option>{{>ingredientName}}</select></td><td><label for="quantity" class="sr-only">Quantity</label><input type="number" class="form-control" style="width:120px; height: 40px; margin-right: 20px; margin-left: 20px;" id="quantity" placeholder="Quantity" min="1"></td><td><select id="unit" class="form-control" style="width:150px; height: 40px;"><option>Unit</option>{{>units}}</select></td><td><button style="margin-left: 25px; height: 40px;" type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">x Remove</button></td></tr>');  
        });  
  $(document).on('click', '.btn_remove', function(){  
         var button_id = $(this).attr("id");   
         $('#row'+button_id+'').remove();  
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