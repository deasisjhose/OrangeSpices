var totalAmount = 0; 
var discounted = 0;

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

function openPay(event, payment) {
    document.getElementById("bao").style.display = "none";
    document.getElementById(payment).style.display = "block";
    // event.currentTarget.className += " active";
}

function openBill(event, bill) {
    document.getElementById("pay").style.display = "none";
    document.getElementById(bill).style.display = "block";
    // event.currentTarget.className += " active";
}

function addDiscount(total){
    return total = total * 0.8;
}

function checkDiscount() {   
    // Get the checkbox   
    // totalAmount = document.getElementsByClassName("amt").text;  
    var checkBox = document.getElementById("discount");   
    if (checkBox.checked == true){     
        console.log("pasok discount hehe");
        console.log(totalAmount);
        discounted= addDiscount(totalAmount);
        var value = parseFloat(discounted).toFixed(2);      
        var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $('.amt').html("₱" + formattedString);
    } 
    else{
        var value = parseFloat(totalAmount).toFixed(2);      
        var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $('.amt').html("₱" + formattedString);
    }
} 

function computechange(){
    var cash = document.getElementById("cash").value;
    var checkBox = document.getElementById("discount");   
    
    if (checkBox.checked == true){     
        var change = cash - discounted;
        var value = parseFloat(change).toFixed(2);      
        var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("change").placeholder = formattedString;
    } 
    else{
        var change = cash - totalAmount;
        var value = parseFloat(change).toFixed(2);      
        var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("change").placeholder = formattedString;
    }
    
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
            qty = document.getElementById("qty").value;

            $.ajax({
                url: '/check/ingredients',
                method: 'post',
                data: {
                    id: id,
                    orderQuantity: qty
                },
                error: function(){
                    console.log("pasok?");
                    alert("Not enough ingredients! Try again!");
                    $("#myModal").modal('hide');
                },
                success: function(){
                    sub = qty * price;
                    idList.push(id);
                    productName.push(prodName);
                    priceList.push(price);
                    qtyList.push(qty);
                    subList.push(sub);

                    var priceNew = parseFloat(price).toFixed(2);      
                    var formattedPrice= priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var subNew = parseFloat(sub).toFixed(2);
                    var formattedSub = subNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    saveOrder(prodName, qty, price);
                    markup = "<tr><td class='leftdiz'>" + prodName  
                        + "</td>" + "<td class='text-right' style='padding-right: 42px;'>" + qty + "</td>" 
                        + "<td class='text-right' style='padding-right: 55px;'>₱ " + formattedPrice + "</td>" 
                        + "<td class='text-right pr-2'>₱ " + formattedSub + "</td>" 
                        + "<td><img src='public/img/x-mark.png' width='13' height='13'></td></tr>"; 
                    tableBody = $("table tbody"); 
                    tableBody.append(markup); 
                    totalAmount += price * qty;
                    var value = parseFloat(totalAmount).toFixed(2);      
                    var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    $('.amt').html("₱" + formattedString);
                    $("#myModal").modal('hide');
                
                }
            });
            
        }
        else{
            alert("Enter quantity first!");
            document.getElementById('qty').style.borderColor = "#c64327";
            return false;
        }
    }); 

    $("button.checkout").click(function(){
        var checkBox = document.getElementById("discount");   
        if (checkBox.checked == true){     
            $.ajax({
                url: '/checkout',
                method: 'POST',
                data: {
                    id: idList,
                    productName: productName,
                    orderQuantity: qtyList,
                    productPrice: priceList,
                    subTotal: subList,
                    totalAmount: discounted
                },
                error: () => callback(),
                success: function(){
                    alert("Order successfully saved!");
                }
            });
        } else {
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
                success: function(){
                    alert("Order successfully saved!");
                }
            });
        }
         window.location.replace("/POS");
     })
}); 