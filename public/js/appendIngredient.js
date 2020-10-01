var ingArray = [];

function addIng(id, qty, unit) {
    ingArray.push({id: id, qty: Number.parseInt(qty), unit: unit});
}

$(document).ready(function(){
    
    var id; 

    var idIngList = [], ingName = [], qtyList = [], unitList = [];

    $("#addIngredient").click(function(){

        id = $("#selectIng").attr('data-id');
        var selectedValue = selectIng.options[selectIng.selectedIndex].value;
        var selectedVal = selectIng.options[selectIng.selectedIndex].getAttribute("data-id");

        var qty = document.getElementById("quantity").value;
        console.log(qty); 
        var unit = document.getElementById("unit").value;
       // var unit = unit.options[unit.selectedIndex].value;
       console.log(selectedValue);
       console.log(selectedVal);
       console.log("selectedValue");

        idIngList.push(selectedValue);
        ingName.push(selectedVal);
        qtyList.push(qty);
        unitList.push(unit); 
        addIng(selectedValue, qty, unit);

        var html = '<div class="row"><span>'+ $("#selectIng").val() + '</span> <span>' + $("#quantity").val() + '</span><span>'+ $("#unit").val() +'</span><button type="button" style="margin-left: 25px; width: 80px" id="remove" class="btn btn-primary btn-sm can-btn">Remove</button></div>';
        $(".col-12").append(html);

        console.log(idIngList); 
        console.log(ingName); 
        console.log(qtyList);
        console.log(unitList); 
    });

    $("#remove").on("click", "#remove", function(){
        $(this).parent().remove();
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

