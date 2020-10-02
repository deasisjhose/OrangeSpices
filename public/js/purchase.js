$(document).ready(function() {
    $("button.save-btn").click(function() {
        var purchDate = document.getElementById("purchDate").value;
        var expDate = document.getElementById("expDate").value;
        var numItems = document.getElementById("numItems").value;
        var purchPrice = document.getElementById("purchPrice").value;
        var supplyName = document.getElementById("supplyName");
        var supplyID = supplyName.options[supplyName.selectedIndex].getAttribute("data-id");

        var today = new Date();

        if (purchDate == "" || expDate == "" || numItems == "" || purchPrice == "" || supplyName == "Select Supply") {
            alert("Incomplete data");
        } else if (numItems <= 0 || purchPrice <= 0) {
            alert("You cannot enter a zero or negative value!");
        }
        else if(qty % 1 != 0){
            alert("Invalid value! Enter intger for quantity.");
        }
        else if (purchDate.getTime() > today.getTime() || expDate.getTime() < purchDate.getTime()) {
            alert("Invalid dates");
        }    
        else {
            $.ajax({
                url: '/purchase/add',
                method: 'POST',
                data: {
                    purchDate: purchDate,
                    supplyName: supplyID,
                    numItems: numItems,
                    expDate: expDate,
                    purchPrice: purchPrice
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