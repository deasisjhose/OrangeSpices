$(document).ready(function() {
    var itemsArray = [];

    // exp = expiry date,
    function addPurchase(id, exp, qty, price) {
        itemsArray.push({id: id, exp: Date.parse(exp), qty: Number.parseInt(qty), price: Number.parseInt(price)});
        // console.log("testing addPurchase func");
        // console.log("id");
        // console.log(id);
        // console.log("exp");
        // console.log(exp);
        // console.log("qty");
        // console.log(qty);
        // console.log("price");
        // console.log(price);
    }
      
    var i = 1;  
    var idSupplyList = [], supplyList = [], expDateList = [], qtyList = [], priceList = [];
    var prod, category, price;

    $('#addPurchase').click(function(){
        var selectSupply = document.getElementById("supplyName");
        var selectedSupply = selectSupply.options[selectSupply.selectedIndex].value;
        var selectedSupplyID = selectSupply.options[selectSupply.selectedIndex].getAttribute("data-id");
        var expiryDate = document.getElementById("expDate").value;
        var qty = document.getElementById("numItems").value;
        var price = document.getElementById("purchPrice").value;

        console.log("selectedSupplyID");
        console.log(selectedSupplyID);
        console.log("selectedSupply");
        console.log(selectedSupply);
        console.log("expiryDate line 34");
        console.log(expiryDate);
        console.log("num items");
        console.log(qty);
        console.log("purchase price");
        console.log(price);

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

            console.log("expiryDate b4 parsed");
            console.log(expiryDate);
            addPurchase(selectedSupplyID, expiryDate, qty, price);
            console.log("expiryDate after parsed");
            console.log(expiryDate);
            i++;

            $('#dynamic_field').append('<tr id="row'+i+'"><td><input disabled="disabled" class="form-control" id="supplyName" name="supplyName" placeholder="' + selectedSupply +'" style="width:215px;"></input></td><td><input type="date" class="form-control" id="expDate" disabled="disabled" style="width:170px; height: 40px;" placeholder="' + Date.parse(expiryDate) + '"</input></td><td><input disabled="disabled" type="number" class="form-control" id="numItems" placeholder="'+ qty +'" style="width:120px; height: 40px;" min="1"></td><td><input disabled="disabled" type="number" class="form-control" id="purchPrice" placeholder="'+ price +'" style="width:145px; height: 40px;" min="1" step="0.01"</input></td><td><button style="margin-left: 25px; height: 40px;" type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">x Remove</button></td></tr>');
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
                    alert("Purchase successfully added!");
                    window.location.href = "/procurement";
                }
            });
        }
    });
});