function addEvent(element, event, delegate ) {
    if (typeof (window.event) != 'undefined')
        element.attachEvent('on' + event, delegate);
    else 
    element.addEventListener(event, delegate, false);
}

addEvent(document, 'readystatechange', function() {
    if ( document.readyState !== "complete" ) 
        return true;       
});

var products = document.querySelectorAll("ul.products li");
var cart = document.querySelectorAll("div.cart ul")[0];

for (var i = 0; i < products.length; i++) {
    var product =  products[i];
    product.setAttribute("draggable", "true");
    addEvent(product, 'dragstart', onDrag);
};

function onDragOver(event){
    if(event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    return false;
}

addEvent(cart, 'drop', onDrop);
addEvent(cart, 'dragover', onDragOver);

function onDrag(event){
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    var target = event.srcElement;
    var success = event.dataTransfer.setData('text', target.id);
}

function onDrop(event){            
    if(event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    
    var id = event.dataTransfer.getData("text");
    var product = document.getElementById(id);

    var exists = document.querySelectorAll("div.cart ul li[product-id='" + id + "']");
    
    if(exists.length > 0){
        updateCartItem(exists[0]);
    } else {
        addCartItem(product, id);
    }
    
    updateCart();
    
    return false;
}

function addCartItem(product, id) {
    var clone = product.cloneNode(true);
    clone.setAttribute('product-id', id);
    clone.setAttribute('product-quantity', 1);
    clone.removeAttribute('id');
    
    var fragment = document.createElement('div');
    fragment.setAttribute('class', 'product-quantity');
    fragment.innerHTML = ' x 1';
    node = clone.children[0].children[0].children[1];
    node.insertBefore(fragment, node.children[6]);

    fragment = document.createElement('div');
    fragment.setAttribute('class', 'product-count');
    node = clone.children[0].children[0].children[1];
    node.insertBefore(fragment, node.children[7]);                  
    cart.appendChild(clone);
}

function updateCartItem(product){
    var quantity = product.getAttribute('product-quantity');
    quantity = parseInt(quantity) + 1
    product.setAttribute('product-quantity', quantity);
    var div = product.querySelectorAll('div.product-quantity');
    div[0].innerHTML = ' x ' + quantity;
}

function updateCart(){
    var subtotal = 0.0;
    var cart_items = document.querySelectorAll("div.cart ul li")
    for (var i = 0; i < cart_items.length; i++) {
        var cart_item = cart_items[i];
        var quantity = cart_item.getAttribute('product-quantity');
        var priceElement = cart_item.getElementsByClassName('product-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var product_count = parseFloat(quantity * price);
        cart_item.querySelectorAll("div.product-count")[0].innerHTML = " = $" + product_count.toFixed(2);
        
        subtotal += product_count;
    }
    
    var tax = subtotal * .07;
    var total = subtotal + tax;
    document.getElementById("subtotal").innerText = '$' + subtotal.toFixed(2);
    document.getElementById("tax").innerText = '$' + tax.toFixed(2);
    document.getElementById("total").innerText = '$' + total.toFixed(2);
}
    
