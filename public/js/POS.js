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
        //delete orderlist from the db
        window.location.replace("/POS");
        return true;
    }
    
}
var orderArray = [];
function saveOrder(id, qty, price) {
    orderArray.push({id: id, qty: Number.parseInt(qty), price: Number.parseFloat(price)});
}

$(document).ready(function () { 
    console.log("pasok");
    var idList = [];
    var id, prodName, price;
    var totalAmount = 0;
    $("button.prod-btn").click(function(){
        id = $(this).attr('data-id');
        idList.push(id);
        prodName = $(this).attr('data-name');
        price = $(this).attr('data-price');
        var input = document.querySelector('input[name=id]');
        input.setAttribute('value', id);
        console.log(id);
    })

    $(".save-qty").click(function () { 
        var qty = document.getElementById("qty").value;
        console.log(id);
        console.log(qty);
        console.log(price);
        saveOrder(prodName, qty, price);
        markup = "<tr><td class='leftdiz'>" + prodName  
            + "</td>" + "<td class='text-right' style='padding-right: 32px;'>" + qty + "</td>" 
            + "<td class='text-right' style='padding-right: 35px;'>₱ " + price + "</td>" 
            + "<td class='text-right pr-2'>₱ " + qty * price + "</td></tr>"; 
        tableBody = $("table tbody"); 
        tableBody.append(markup); 
        // var check = orderArray.reduce((accumulator, e) => accumulator + e.qty * e.price, 0);
        totalAmount += price * qty;
        // console.log("check");
        // console.log(check);
        console.log("orderarray");
        console.log(orderArray);
        $('#amt').html("₱" + totalAmount);
        $("#myModal").modal('hide');
    }); 

    $("button.checkout").click(function(){
        $.ajax({
            url: '/checkout',
            method: 'POST',
            data: {
                id: idList,
                totalAmount: totalAmount
            },
            error: () => callback(),
            success: a => callback(a)
        });
    })
}); 