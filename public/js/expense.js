$(document).ready(function(){ 
    $("button.save-btn").click(function(){
        var expenseDate = document.getElementById("expenseDate").value;
        var expenseDesc = document.getElementById("expenseDesc").value;
        var expenseAmt = document.getElementById("expenseAmt").value;
        var expense = document.getElementById("expenseName");
        var expenseID = expense.options[expense.selectedIndex].getAttribute("data-id");
        console.log(expense);
        console.log(expenseID);
        $.ajax({
            url: '/expenseDetails/add',
            method: 'POST',
            data: {
                expenseDate: expenseDate, 
                expenseName: expenseID, 
                expenseDesc: expenseDesc, 
                expenseAmt: expenseAmt 
            },
            error: () => callback(),
            success: function(){
                alert("Expense details successfully saved!");
                window.location.href="/expenseDetails"; 
            }
        });
    });
});