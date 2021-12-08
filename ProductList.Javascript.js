// Function that makes adding events to elements quicker
function addEvent(element, event, delegate) {
    if (typeof (window.event) != 'undefined')
        element.attachEvent('on' + event, delegate);
    else 
    element.addEventListener(event, delegate, false);
}

// Adds a readystatechange event which gets triggered when the document state changes
// Used so that the state of the document is complete before attaching the rest of events and logic
addEvent(document, 'readystatechange', function() {
    if ( document.readyState != "complete" ) 
        return true;       
});

// Creates 2 lists of elements, one for products on page, one for cart when items are added to it
var products = document.querySelectorAll("ul.products li");
var cart = document.querySelectorAll("div.cart ul")[0];

// Adds and sets draggable attribute to each product element and sets it to true
// Adds dragstart event to each product element
for (var i = 0; i < products.length; i++) {
    var product =  products[i];
    product.setAttribute("draggable", "true");
    addEvent(product, 'dragstart', onDrag);
};

// Sets the drag options and stores the elememnt id of dragged element
function onDrag(event){
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    var target = event.srcElement;
    var success = event.dataTransfer.setData('text', target.id);
}

// calls preventDefault() in order to allow element being dragged to be dropped into another element
// Shows a cancel icon unless dragged element is over target element
function onDragOver(event){
    if(event.preventDefault) event.preventDefault();
    else event.cancelBubble = true;
    return false;
}

// Once again calls preventDefault() in order to prevent the default event behavior. 
// Checks if product has already been added to cart
// If yes, then UpdateCartItem is called
// If no, AddCartItem is called
// Finally UpdateCart is called to update Subtotal, Tax, and Total values
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

// Adds dragover and drop events to each element added to cart 
addEvent(cart, 'dragover', onDragOver);
addEvent(cart, 'drop', onDrop);

// Clones dragged item into cart and adds quantity value
function addCartItem(product, id) {
    var clone = product.cloneNode(true);
    clone.setAttribute('product-id', id);
    clone.setAttribute('product-quantity', 1);

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

// Updates the quantity value of each time the same product is dropped into cart
function updateCartItem(product){
    var quantity = product.getAttribute('product-quantity');
    quantity = parseInt(quantity) + 1
    product.setAttribute('product-quantity', quantity);
    var div = product.querySelectorAll('div.product-quantity');
    div[0].innerHTML = ' x ' + quantity;
}

// Gets subtotal of each item of cart and subtotal for all items.
// Subtotal is then used to calculate tax and total
function updateCart(){
    var subtotal = 0.0;
    var cart_items = document.querySelectorAll("div.cart ul li")
    for (var i = 0; i < cart_items.length; i++) {
        var cart_item = cart_items[i];
        var quantity = cart_item.getAttribute('product-quantity');
        var priceElement = cart_item.getElementsByClassName('product-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var product_subtotal = parseFloat(quantity * price);
        cart_item.querySelectorAll("div.product-count")[0].innerHTML = " = $" + product_subtotal.toFixed(2);
        
        subtotal += product_subtotal;
    }
    
    var tax = subtotal * .07;
    var total = subtotal + tax;
    document.getElementById("subtotal").innerText = '$' + subtotal.toFixed(2);
    document.getElementById("tax").innerText = '$' + tax.toFixed(2);
    document.getElementById("total").innerText = '$' + total.toFixed(2);
}
    
