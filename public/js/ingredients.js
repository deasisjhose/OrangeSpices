// const ingredientController = require('../controllers/ingredientController'); 
// ingredientController.getAllIngredients(req, function(err, ingredients){

//     window.onload = function() { 
//     var i;
//     var stock = document.getElementsByClassName("minStock");
//     var stockVal = document.getElementsByClassName("minStock").value;
//     var current = document.getElementsByClassName("tq"); 
//     var currentVal = document.getElementsByClassName("tq").value;
//     console.log("????");

//     for (i = 0; i < stock.length; i++) {
//         console.log(i);
//         console.log(stockVal);
//         console.log(currentVal);
//         if(stockVal[i] < currentVal[i]){
//             console.log("replacing...");
//             current[i].className = current[i].className.replace(" tq", "bg-danger text-white");
//         }
//     }
// }

// }) 


$(document).ready(function () { 
    $.ajax({
        url: '/ingredients',
        method: 'GET',
        data: {
            minStock: minStock,
            totalQuantity: totalQuantity      
        },
        error: function(){
            console.log("erroooor");
        }, 
        success: function(){
            var i;
            var stock = document.getElementsByClassName("minStock");
            var current = document.getElementsByClassName("tq"); 
            console.log("minstock " + minStock);
            console.log("curstock " + totalQuantity);
            console.log("????");

            for (i = 0; i < minStock.length; i++) {
                console.log(i);
                
                if(totalQuantity < minStock){
                    console.log("replacing...");
                    current[i].className = current[i].className.replace(" tq", "bg-danger text-white");
                }
            }
        }
    });
        
}); 