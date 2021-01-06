function openDiv(event, ingredient) {
    var i, menu, button;
    menu = document.getElementsByClassName("divmenu");
    for (i = 0; i < menu.length; i++) {
        menu[i].style.display = "none";
    }

    button = document.getElementsByClassName("categorybtn");
    for (i = 0; i < button.length; i++) {
        button[i].className = button[i].className.replace(" active", "");
    }

    document.getElementById(ingredient).style.display = "block";
    event.currentTarget.className += " active";
}

function confirmCancel() {
    var choice = confirm("Are you sure you want to discard this order?");
    if( choice == true ) {
        window.location.replace("/POS");
        return true;
    }
    
}
var orderArray = [];
function saveOrder(id, qty, price) {
    orderArray.push({id: id, qty: Number.parseInt(qty), price: Number.parseFloat(price)});
}

$(document).ready(function () { 
    var idList = [], productName = [], priceList = [], qtyList = [], subList = [];
    var id, prodName, qty, sub;
    var totalAmount = 0;

    $("button.prod-btn").click(function(){
        id = $(this).attr('data-id');
        // idList.push(id);
        prodName = $(this).attr('data-name');
        // productName.push(prodName);
        price = $(this).attr('data-price');
        // priceList.push(price);
        var input = document.querySelector('input[name=id]');
        input.setAttribute('value', id);
        document.getElementById('qty').style.borderColor = "#d1d3e2";
        document.getElementById('qty').value = "";

    })

    $(".save-qty").click(function () { 
        if(document.getElementById("qty").value !== "") {
            // do your actions
            qty = document.getElementById("qty").value;
            sub = qty * price;
            idList.push(id);
            productName.push(prodName);
            priceList.push(price);
            qtyList.push(qty);
            subList.push(sub);
            saveOrder(prodName, qty, price);
            markup = "<tr><td class='leftdiz'>" + prodName  
                + "</td>" + "<td class='text-right' style='padding-right: 42px;'>" + qty + "</td>" 
                + "<td class='text-right' style='padding-right: 55px;'>₱ " + price + "</td>" 
                + "<td class='text-right pr-2'>₱ " + sub + "</td></tr>"; 
            tableBody = $("table tbody"); 
            tableBody.append(markup); 
            totalAmount += price * qty;
            $('#amt').html("₱" + totalAmount);
            $("#myModal").modal('hide');
        }
        else{
            alert("Enter quantity first!");
            document.getElementById('qty').style.borderColor = "#c64327";
            return false;
        }
    }); 

    $("button.checkout").click(function(){
        $.ajax({
            url: '/checkout',
            method: 'POST',
            data: {
                id: idList,
                productName: productName,
                orderQuantity: qtyList,
                productPrice: priceList,
                subTotal: subList,
                totalAmount: totalAmount
            },
            error: () => callback(),
            success: a => callback(a)
        });
        window.location.replace("/POS");
        alert("Order successfully saved!");
    })

    
}); 