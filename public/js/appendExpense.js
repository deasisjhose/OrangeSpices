$(document).ready(function() {
    var expenseArray = [];

    function addExpense(exp, expenseType, description, amount) {
        expenseArray.push({exp: exp, expenseType: expenseType, description: description, amount: Number.parseInt(amount)});
    }

    var i = 1;  
    var expenseList = [], expType = [], descList = [], amountList = [];

    $('#addExpense').click(function(){
        var expense = document.getElementById("expenseName").value;
        var selectExpType = document.getElementById("expenseType");
        var selectedExpType = selectExpType.options[selectExpType.selectedIndex].value;
        var desc = document.getElementById("expenseDesc").value;
        var amount = document.getElementById("expenseAmt").value;

        if(expense == "" && desc == "" && amount == ""){
            alert("Please fill out all fields!");
        }
        else if (expense == "" && desc != "" && amount != ""){
            alert("Please enter expense name!");
        }
        else if (expense != "" && desc == "" && amount != ""){
            alert("Please enter description!");
        }
        else if (expense != "" && desc != "" && amount == ""){
            alert("Please enter expense amount!");
        }
        else if (expense != "" && desc == "" && amount == ""){
            alert("Please enter description and amount!");
        }
        else if (expense == "" && desc != "" && amount == ""){
            alert("Please enter expense name and amount!");
        }
        else if (expense == "" && desc == "" && amount != ""){
            alert("Please enter expense name and description!");
        }
        else if (amount <= 0) {
            alert("You cannot enter a zero or negative value!");
        }
        else {
            expenseList.push(expense);
            expType.push(selectedExpType);
            descList.push(desc);
            amountList.push(amount);

            addExpense(expense, selectedExpType, desc, amount);
            i++;

            $('#dynamic_field').append('<tr id="row'+i+'"><td><input disabled="disabled" class="form-control" id="expenseName" placeholder="' + expense +'" style="width:150px;"></input></td><td><input type="name" class="form-control" id="expenseType" disabled="disabled" style="width:110px; height: 40px;" placeholder="' + selectedExpType + '"</input></td><td><input disabled="disabled" type="name" class="form-control" id="expenseDesc" placeholder="'+ desc +'" style="width:230px; height: 40px;" min="1"></td><td><input disabled="disabled" type="number" class="form-control" id="expenseAmt" placeholder="'+ amount +'" style="width:120px; height: 40px;" min="1" step="0.01"</input></td><td><button style="width: 100px; height: 40px;" type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">x Remove</button></td></tr>');
        }
    });

    $(document).on('click', '.btn_remove', function(){  
        var button_id = $(this).attr("id");
        var index = button_id - 2; 
        console.log("removing..." + button_id);  
        $('#row'+button_id+'').remove();  
        expenseList.splice(index, 1);
        expType.splice(index, 1);
        descList.splice(index, 1);
        amountList.splice(index, 1); 
    }); 

    $("button.save-btn").click(function() {
        var expenseDate = document.getElementById("expenseDate").value;
        var expense = document.getElementById("expenseName").value;
        var desc = document.getElementById("expenseDesc").value;
        var amount = document.getElementById("expenseAmt").value;

        var today = new Date();
        var d1 = new Date(expenseDate);

        if (expenseDate == "") {
            alert("Please enter expense date");
        } 
        else if(expenseDate == "" && expense == "" && desc == "" && amount == ""){
            alert("Please fill out all fields!");
        }
        else if (expense == "" && desc != "" && amount != ""){
            alert("Please enter expense name!");
        }
        else if (expense != "" && desc == "" && amount != ""){
            alert("Please enter description!");
        }
        else if (expense != "" && desc != "" && amount == ""){
            alert("Please enter expense amount!");
        }
        else if (expense != "" && desc == "" && amount == ""){
            alert("Please enter description and amount!");
        }
        else if (expense == "" && desc != "" && amount == ""){
            alert("Please enter expense name and amount!");
        }
        else if (expense == "" && desc == "" && amount != ""){
            alert("Please enter expense name and description!");
        }
        else if (amount <= 0) {
            alert("You cannot enter a zero or negative value!");
        }
        // else if (d1.getTime() > today.getTime()) {
        //     alert("Invalid date. Cannot be future");
        // } 
        else {
            $.ajax({
                url: '/expense/add',
                method: 'POST',
                data: {
                    expenseDate: expenseDate,
                    expenseList: expenseList,
                    expenseType: expType,
                    expenseDesc: descList,
                    expenseAmt: amountList
                },
                error: () => callback(),
                success: function() {
                    alert("Expenses successfully saved!");
                    window.location.href = "/expense";
                }
            });
        }
    });
});