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
    
    var fragment = document.createElement('span');
    fragment.setAttribute('class', 'product-quantity');
    fragment.innerHTML = ' x 1';
    clone.appendChild(fragment);    
    
    fragment = document.createElement('span');
    fragment.setAttribute('class', 'sub-total');
    clone.appendChild(fragment);                    
    cart.appendChild(clone);
}

function updateCartItem(product){
    var quantity = product.getAttribute('product-quantity');
    quantity = parseInt(quantity) + 1
    product.setAttribute('product-quantity', quantity);
    var span = product.querySelectorAll('span.product-quantity');
    span[0].innerHTML = ' x ' + quantity;
}

function updateCart(){
    var total = 0.0;
    var cart_items = document.querySelectorAll("div.cart ul li")
    for (var i = 0; i < cart_items.length; i++) {
        var cart_item = cart_items[i];
        var quantity = cart_item.getAttribute('product-quantity');
        var priceElement = cart_item.getElementsByClassName('product-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var sub_total = parseFloat(quantity * price);
        cart_item.querySelectorAll("span.sub-total")[0].innerHTML = " = $" + sub_total.toFixed(2);
        
        total += sub_total;
    }
    
    var tax = (total * .07).toFixed(2);
    total = (total + parseFloat(tax)).toFixed(2);
    document.getElementsByClassName("tax")[0].innerText = 'Tax: $' + tax;
    document.getElementsByClassName("total")[0].innerText = 'Total: $' + total;
}
    
