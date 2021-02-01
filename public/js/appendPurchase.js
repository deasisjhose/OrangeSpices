$(document).ready(function() {
    var itemsArray = [];

    // exp = expiry date,
    function addPurchase(id, exp, qty, price) {
        itemsArray.push({id: id, exp: Date.parse(exp), qty: Number.parseInt(qty), price: Number.parseInt(price)});
    }
      
    var i = 1;  
    var idSupplyList = [], supplyList = [], expDateList = [], qtyList = [], priceList = [];

    $('#addPurchase').click(function(){
        var selectSupply = document.getElementById("supplyName");
        var selectedSupply = selectSupply.options[selectSupply.selectedIndex].value;
        var selectedSupplyID = selectSupply.options[selectSupply.selectedIndex].getAttribute("data-id");
        var expiryDate = document.getElementById("expDate").value
        var expDate = new Date(expiryDate).toJSON().slice(0,10).split('-').reverse().join('/');
        var qty = document.getElementById("numItems").value;
        var price = document.getElementById("purchPrice").value;

        if(expiryDate == "" && qty == "" && price == ""){
            alert("Please fill out all fields!");
        }
        else if (expiryDate == "" && qty != "" && price != ""){
            alert("Please enter expiry date!");
        }
        else if (expiryDate != "" && qty == "" && price != ""){
            alert("Please enter quantity!");
        }
        else if(expiryDate != "" && qty != "" && price == ""){
            alert("Please enter purchase price!");
        }
        else if(expiryDate != "" && qty == "" && price == ""){
            alert("Please enter quantity and purchase price!");
        }
        else if(expiryDate == "" && qty != "" && price == ""){
            alert("Please enter expiry date and purchase price!");
        }
        else if(expiryDate == "" && qty == "" && price != ""){
            alert("Please enter expiry date and quantity!");
        }
        else if (qty <= 0 || price <= 0) {
            alert("You cannot enter a zero or negative value!");
        }
        else if (qty % 1 != 0) {
            alert("Invalid value! Enter intger for number of items.");
        }
        else {
            idSupplyList.push(selectedSupplyID);
            supplyList.push(selectedSupply);
            expDateList.push(expiryDate);
            qtyList.push(qty);
            priceList.push(price);

            addPurchase(selectedSupplyID, expiryDate, qty, price);
            i++;

            $('#dynamic_field').append('<tr id="row'+i+'"><td><input disabled="disabled" class="form-control" id="supplyName" name="supplyName" placeholder="' + selectedSupply +'" style="width:215px;"></input></td><td><input type="name" class="form-control" id="expDate" disabled="disabled" style="width:170px; height: 40px;" placeholder="' + expDate + '"</input></td><td><input disabled="disabled" type="number" class="form-control" id="numItems" placeholder="'+ qty +'" style="width:120px; height: 40px;" min="1"></td><td><input disabled="disabled" type="number" class="form-control" id="purchPrice" placeholder="'+ price +'" style="width:145px; height: 40px;" min="1" step="0.01"</input></td><td><button style="width: 100px; height: 40px;" type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">x Remove</button></td></tr>');
        }
    });

    $(document).on('click', '.btn_remove', function(){  
        var button_id = $(this).attr("id");
        var index = button_id - 2; 
        console.log("removing..." + button_id);  
        $('#row'+button_id+'').remove();  
        idSupplyList.splice(index, 1);
        supplyList.splice(index, 1);
        qtyList.splice(index, 1);
        priceList.splice(index, 1); 
    });  

    $("button.save-btn").click(function() {
        var purchDate = document.getElementById("purchDate").value;

        var today = new Date();
        var d1 = new Date(purchDate);
        //var d2 = new Date(expDate);

        if (purchDate == "") {
            alert("Please enter purchase date");
        } 
        // TO DO: validations when "save" button is clicked
        // if may laman yung purchase date tapos empty yung list pag nag save button siya inaaccept niya
        // else if (d1.getTime() > today.getTime() || d2.getTime() < d1.getTime()) {
        //     alert("Invalid dates");
        // } 
        else {
            $.ajax({
                url: '/purchase/add',
                method: 'POST',
                data: {
                    purchDate: purchDate,
                    idSupplyList: idSupplyList,
                    supplyList: supplyList,
                    numItems: qtyList,
                    expDate: expDateList,
                    purchPrice: priceList
                },
                error: () => callback(),
                success: function() {
                    window.location.href = "/procurement";
                }
            });
        }
    });
});