$(document).ready(function(){ 

    var i=1;  
    var idIngList = [], ingName = [], numItemsList = [], qtyList = [], unitList = [];
    var supplierName, supplierEmail;

    var orderArray = [];

  function addOrder(selectedValue, numItems, qty, unitID) {
    orderArray.push({selectedValue: selectedValue, numItems: Number.parseInt(numItems), qty: Number.parseInt(qty), unitID: unitID});
  }

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  $('#addIngredient').click(function(){  

    console.log("adding...");
    var selectIng = document.getElementById("selectIng");
    var selectedValue = selectIng.options[selectIng.selectedIndex].value;
    var selectedVal = selectIng.options[selectIng.selectedIndex].getAttribute("data-id");
    var numItems = document.getElementById("numItems").value;
    var qty = document.getElementById("quantity").value;
    var unitName = document.getElementById("unit").value;
    var unit = document.getElementById("unit");
    var unitID = unit.options[unit.selectedIndex].getAttribute("value");

    if(qty == "" || numItems == ""){
      alert("Please fill out all fields!");
    }
    else if(qty <= 0 || numItems <= 0){
      alert("You cannot enter a zero or negative value!");
    }
    else if(qty % 1 != 0){
      alert("Invalid value! Enter intger for quantity.");
    }
    else if(numItems % 1 != 0){
      alert("Invalid value! Enter intger for no. of items.");
    }
    else{
      idIngList.push(selectedVal);
      ingName.push(selectedValue);
      numItemsList.push(numItems);
      qtyList.push(qty);
      unitList.push(unitID);
      addOrder(selectedValue, numItems, qty, unitID);
      console.log(ingName);
      i++;  
      $('#dynamic_field').append('<tr id="row'+i+'"><td><input disabled="disabled" class="form-control" id="selectIng" disabled="disabled" name="ingredientName" placeholder="' + selectedValue +'" style="width:215px;"></input></td><td><input type="number" class="form-control" disabled="disabled" style="width:130px; margin-right: 20px; margin-left: 20px; height: 40px;" placeholder="' + numItems +'" id="numItems" min="1"></td><td><input type="number" class="form-control" disabled="disabled" style="width:120px; height: 40px; margin-right: 20px; margin-left: 20px;" id="quantity" placeholder="' + qty +'"min="1"></td><td><input id="unit" class="form-control" disabled="disabled" placeholder="' + unitName +'" style="width:150px; height: 40px;"></input></td><td><button style="margin-left: 25px; height: 40px;" type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">x</button></td></tr>');  

    }
  
  });  

  $(document).on('click', '.btn_remove', function(){  
    var button_id = $(this).attr("id");
    var index = button_id - 2; 
    console.log("removing..." + button_id);  
    $('#row'+button_id+'').remove();  
    idIngList.splice(index, 1);
    ingName.splice(index, 1);
    numItemsList.splice(index, 1);
    qtyList.splice(index, 1);
    unitList.splice(index, 1); 
    orderArray.splice(index, 1);
    console.log(ingName);
  });  

  $("button.save-btn").click(function(){
    supplierName = document.getElementById("supplierName").value;
    supplierEmail = document.getElementById("supplierEmail").value;
    console.log(supplierName);
    console.log(supplierEmail);

    if(supplierName == "" || supplierEmail == ""){
      alert("Please fill out all fields!");
    }
    else if(!validateEmail(supplierEmail)){
      alert("Please enter a valid email!");
    }
    else {
      $.ajax({
        url: '/purchase/order',
        method: 'POST',
        data: {
          supplierName: supplierName,
          supplierEmail: supplierEmail,
          idIngList: idIngList,
          ingName: ingName,
          numItemsList: numItemsList,
          qtyList: qtyList,
          unitList: unitList,
          orders: orderArray
        },
        error: function(){
          alert("Please fill out the items table.");
        },
        success: function(){
          window.location.href="/procurement"; 
          alert("Email successfully sent!");
      }
      });
    }
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