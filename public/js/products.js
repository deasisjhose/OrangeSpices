function confirmDelete(product){
    var deleteProduct = product.parentElement.parentElement.getAttribute('data-id');
    var delRow = product.parentElement.parentElement;
    console.log("deleteProduct");
    console.log(deleteProduct);
    var x = confirm("Are you sure you want to delete this product?");
    console.log("x");
    console.log(x);
    if (x == true)
        $.ajax({
            url: '/product/delete/:id',
            method: 'POST',
            data: {
                id: deleteProduct
            },
            error: function(){
              alert("Cannot delete product.");
            },
            success: function(){
                delRow.remove(); 
            }
        });
    else 
        window.location.href="/products";
}