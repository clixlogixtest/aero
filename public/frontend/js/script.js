const button = document.getElementById('toggle-btn');
const iconContainer = document.getElementById('social-icons');

function toggleWidget(){
    const elem = document.getElementById('toggle-btn');
    const iconContainer = document.getElementById('social-icons');
    iconContainer.classList.toggle('auto-hw')
    elem.classList.toggle('rotate-button');
}

function toggleFatc(){
    const modal = document.getElementById("floating_atcm");
    const ftb = document.getElementById("floating_atc");
    modal.classList.toggle("open_fatc")
    ftb.classList.toggle("floating_atc_open")
    ftb.classList.toggle("cross")
}
function handleVariantChange() {
    const value = document.getElementById("fatcm_variant_selector").value;
    const quantity = document.getElementById("variant_quantity").value;
    activeAero = productsAero.variants[value] || productsAero.variants[0];
    image = productsAero.images[value] && productsAero.images[value].src
    const price = document.getElementById("pin_cart_price");
    price.innerHTML = `${activeAero.price}`
}
async function addVariantToCart() {
    const quantity = document.getElementById("variant_quantity").value;
    const items = {quantity: quantity || 1, id: activeAero.id};
    let produc = await fetch('/cart/add.js', {
        method: 'post',
        body: JSON.stringify(items),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With':'xmlhttprequest'
        },
        credentials: 'same-origin',
    })
    if(produc.status == 422) return
    produc = await produc.json();
    const notification = document.getElementById("added_to_cart_notification");
    notification.classList.add("notification_show")
    setTimeout(()=>{notification.classList.remove("notification_show")}, 1000)
}