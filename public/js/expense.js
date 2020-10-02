$(document).ready(function() {
    $("button.save-btn").click(function() {
        var expenseDate = document.getElementById("expenseDate").value;
        var expenseDesc = document.getElementById("expenseDesc").value;
        var expenseAmt = document.getElementById("expenseAmt").value;
        var expense = document.getElementById("expenseName");
        var expenseID = expense.options[expense.selectedIndex].getAttribute("data-id");
        console.log(expense);
        console.log(expenseID);

        var today = new Date();

        if (expenseDate == "" || expenseDesc == "" || expenseAmt == "" || expense == "") {
            alert("Please input all fields.");
        } else if (expenseAmt <= 0) {
            alert("Invalid value for amount.");
        }
        if (expenseDate.getTime() > today.getTime()) {
            alert("Invalid date. Cannot be future");
        } else {
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
                success: function() {
                    alert("Expense details successfully saved!");
                    window.location.href = "/expenseDetails";
                }
            });
        }
    });
});