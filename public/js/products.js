function confirmDelete(product){
    var deleteProduct = product.parentElement.parentElement.getAttribute('data-id');
    var delRow = product.parentElement.parentElement;
    var x = confirm("Are you sure you want to delete this product?");
    
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
                //delRow.remove();
                window.location.href="/products"; 
            }
        });
    else 
        window.location.href="/products";
}