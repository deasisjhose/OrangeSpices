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

// $(document).ready(function () { 
//     console.log("pasok");
//     $(".save-qty").click(function () { 
//         markup = "<tr><td class='leftdiz'>Ala Carte"  
//             + "</td>" + "<td class='text-right' style='padding-right: 32px;'>4</td>" 
//             + "<td class='text-right' style='padding-right: 35px;'>₱ 00.00</td>" 
//             + "<td class='text-right pr-2'>₱ 00.00</td></tr>"; 
//         tableBody = $("table tbody"); 
//         tableBody.append(markup); 
//         $("#myModal").modal('hide');
//     }); 
// }); 

$(document).ready(function(){
    $("button.prod-btn").click(function(){
        var id = $(this).attr('data-id');
        console.log(id);
        var input = document.querySelector('input[name=id]');
        input.setAttribute('value', id);
        console.log(input);
    })
})