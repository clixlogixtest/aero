let activeAero;
let productsAero;

(function() {
    var loadScript = function(url, callback) {

        var script = document.createElement("script");
        script.type = "text/javascript";

        // If the browser is Internet Explorer.
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
            // For any other browser.
        } else {
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);

    };
    const createTemplate = (jQuery, $) => {
        // Get HEAD Tag from DOM =============================================
        var head = document.getElementsByTagName('HEAD')[0];
        const body = $('body');
        const url = window.location.href
        // ==================================================================


        // CREATE STYLESHEET ===============================================
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://res.cloudinary.com/launchtip/raw/upload/v1607602542/css/widget.css';
        head.appendChild(link);

        // FONT AWESOME
        const fontawesome = document.createElement('link')
        fontawesome.rel = 'stylesheet';
        fontawesome.type = 'text/css';
        fontawesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'
        head.appendChild(fontawesome);
        // ====================================================================

        // FUNCTION ===== GENERATE FLOATING ADD TO CART ===========================
        const makeCart = (widget) => {
            if (url.includes('product')) {
                // Get Product Name From Url
                const urlChunks = window.location.href.split('/');
                const product = urlChunks[urlChunks.length - 1].split('?')[0];
                const renderBar = (product) => {

                    activeAero = product.variants[0];
                    let image = product.images[0].src
                    let description = product.body_html || "";
                    if (description && description.includes('<p>')) {
                        description = description.replace('<p>', '').replace('</p>', '')
                        description = description.slice(0, 95);
                    }
                    const productDetail = $(`
            <div>
                <div class="floating_atcm" id="floating_atcm">
                    <div class="fatcm_image">
                        <img id="pin_cart_image" src=${image}>
                    </div>
                    <div class="fatcm_container">
                        <div class="fatcm_title">
                            <p>
                                ${product.title}
                            </p>
                            <div class="variant_details">
                                ${description}... .
                            </div>
                            
                        </div>
                        <div class="fatcm_variant">
                            <p class="no_mobile">Variant</p>
                            <select id="fatcm_variant_selector" onchange="handleVariantChange()">
                                ${
                                    product.variants.map((item,i) => {
                                        return(
                                            `<option value=${i} > ${item.title} </option>`
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div clas="fatcm_variant">
                            <p class="no_mobile">Qty</p>
                            <input type="Number" id="variant_quantity" value="1" min="1" onchange="handleVariantChange()">
                        </div>
                        <div class="fatcm_price">
                            <p id="pin_cart_compare_price">
                            ${Shopify.currency.active}</p>
                            <p id="pin_cart_price"
                            
                            >${activeAero.price}</p>
                        </div>
                        <div class="fatcm_button">
                            <button onclick="addVariantToCart()">
                                Add To Cart
                            </button>
                            <button>
                                <a href="/cart">Go to Cart</a>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="added_to_cart_notification" id="added_to_cart_notification">
                    ADDED TO CART
                </div>

                <div class="floating_atc" onclick="toggleFatc()" id="floating_atc" >
                    <div class="cart_icon_container">
                        <img src="https://res.cloudinary.com/dww89xxkb/image/upload/v1601365196/add_to_cart_vgoqwg.png" alt="atc">
                    </div>
                </div>
            </div>
            `)
                    body.append(productDetail)
                }

                // Fetch product Information ========
                jQuery.getJSON(`/products/${product}`, function(data) {
                    const information = data.product
                    //console.log(information)
                    productsAero = information;
                    if(information) activeAero = information.variants[0];
                    if (information) renderBar(information)
                });
                // Fetch Ends ========================

            }
        }


        // FUNCTION ====== GENERATE FLOATING WIDGET ===============================
        const makeApp = (data, icons) => {
        // const icons = iconsArray.sort(function(a, b) { 
        //         return a.order - b.order
        //     });
        const widget = $(`
        <div class="button-cover" id="button-cover"
        style="${
            data.widgetPosition === 'custom'? 
            `right:${data.widgetMr}%; 
            bottom:${data.widgetMb}%`:
            data.widgetPosition === 'bottom-right'? `${`right:1.5%; bottom:20px`}`: 
            data.widgetPosition === 'bottom-left'? `${`right:84%`}`: null
        }"
        >
            <div class="aero-social-icons" id="social-icons" style="margin:0;padding-bottom:10px">
                ${
                    icons && icons.map((icon, i)=>{
                        if(data.plan === "free"){
                            if(i > 1){
                                return
                            }
                        }
                        if(icon.enabled){
                            return `<div class="image-name">
                            <a href=${icon.iconHref} target="_blank"> 
                                <div class="drop-shadow">
                                    ${
                                        data.label === 'labelOn' ?
                                        `<label class="mb-0 mr-3"
                                        style=${`background-color:${data.labelBc};color:${data.labelFc}`}>
                                        ${icon.iconLabel}
                                        </label>`: ''
                                    }
                                </div> 
                                ${
                                    icon.type === 'image' ?
                                    `<img style="background:${icon.background}; width:55px;height:55px" src=${icon.iconImage}></img>` :
                                    `<div class="font_icon">
                                            <div class="floating_icon" style="${icon.style}">
                                                <i class="${icon.iconLinkName}"></i>
                                            </div>
                                    </div>`
                                }
                            </a>
                        </div>`
                        }
                    }).join('')
                } 
                ${
                    data.Drift &&
                    `<div class="image-name">
                            <div class="drop-shadow">
                            ${
                                data.label === 'labelOn'?
                                `<div class="drop-shadow">
                                <label class="mb-0 mr-3 drift-open-chat"
                                style=${`background-color:${data.labelBc};color:${data.labelFc}`}>Drift</label>
                                </div> `: ''
                            }
                            </div>
                            <img class="drift-open-chat" src="https://res.cloudinary.com/launchtip/image/upload/v1606294447/Aero/drift_small.png">   
                    </div>`
                }
                ${
                    data.Slack &&
                    `<div class="image-name">
                        <a href="https://slack.com/app_redirect?channel=${data.Slack}" target="_blank"> 
                            <div class="drop-shadow">
                                ${  
                                    data.label === 'labelOn'?
                                    `<label class="mb-0 mr-3"
                                    style=${`background-color:${data.labelBc};color:${data.labelFc}`}>Slack</label>`: '' 
                                }
                            </div> 
                            <img src="https://res.cloudinary.com/launchtip/image/upload/v1606294444/Aero/slack_small.png">
                        </a>
                    </div>`
                }  
                ${
                    data.Whatsapp &&
                    `<div class="image-name">
                        <a href=${`https://api.whatsapp.com/send?phone=+${data.Whatsapp}&text=Hi%20we%20need%20help%20regarding%20something`} target="_blank"> 
                            ${
                                data.label === 'labelOn'?
                                `<div class="drop-shadow">
                                <label class="mb-0 mr-3"
                                style=${`background-color:${data.labelBc};color:${data.labelFc}`}>Whatsapp</label>
                                </div> `: '' 
                            
                            }
                            <img src="https://res.cloudinary.com/launchtip/image/upload/v1606294442/Aero/whatsapp_small.png">
                        </a>
                    </div>`
                }
                ${
                    data.Facebook &&
                    `<div class="image-name">
                        <a href=${`http://m.me/${data.Facebook}`} target="_blank"> 
                        ${  
                                data.label === 'labelOn'?
                                `<label class="mb-0 mr-3"
                                style=${`background-color:${data.labelBc};color:${data.labelFc}`}>
                                Messenger</label>`: '' 
                        }
                            <img src="https://res.cloudinary.com/launchtip/image/upload/v1606294450/Aero/fb_small.svg">
                        </a>
                    </div>`
                }
                    
            </div>
            <div class="widget_button">
                <div class="toggle-btn button-icon" id="toggle-btn"
                onclick="toggleWidget()"
                ${data.customCSS ? `style="${data.customCSS }"` : `style="background-color:${data.widgetButtonColor};
                border-radius:${
                    data.widgetShape === "circle"? `50%` :
                    data.widgetShape === "square"? `2px` :
                    data.widgetShape === "squircle"? `15px`: ""
                }"`}
                > 
                </div>
            </div> 
        </div>
    `)
            body.append(widget);
            if(data.Drift){
                driftPlugin(data.Drift)
            }
        }

        //FETCH DATA FROM SERVER ============================================
        jQuery.getJSON(`https://cors-anywhere.herokuapp.com/https://useaero.herokuapp.com/widget/${Shopify.shop}?shop=${Shopify.shop}`, function(data) {   
            //console.log(data.data)
            if(data.data.enabled){
                console.log("aero loaded")
                makeApp(data.data, data.icons)
                if (data.data.floatingCart && data.data.plan !== 'free') {
                    makeCart(data.data.floatingAero)
                }
            }else{console.log("aero is currently switched off")}
        })
        // ========================================================================
    }

    //Check If JQUERY Exists || NOT || Add Jquery =======================
    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
        loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', function() {
            jQuery191 = jQuery.noConflict(true);
            createTemplate(jQuery191, jQuery191);
        });
    } else {
        createTemplate(jQuery, jQuery);
    }

    function loadAeroScript(){
        // Gloabl SCRIPTS bundle =============================================
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://res.cloudinary.com/launchtip/raw/upload/v1607603321/javascript/script_dv4lm0.js";
        document.getElementsByTagName("head")[0].appendChild(script)
        // ====================================================================
    }
    loadAeroScript()

    ///////////////////////////////////////////////////////////////////////////////////////////
    function driftPlugin(drift) {
        var scripts = document.createElement("script");
        scripts.type = "text/javascript";
        scripts.innerHTML = `
        "use strict";
        !function() {
        var t = window.driftt = window.drift = window.driftt || [];
        if (!t.init) {
        if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
        t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
        t.factory = function(e) {
          return function() {
            var n = Array.prototype.slice.call(arguments);
            return n.unshift(e), t.push(n), t;
          };
        }, t.methods.forEach(function(e) {
          t[e] = t.factory(e);
        }), t.load = function(t) {
          var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
          o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
          var i = document.getElementsByTagName("script")[0];
          i.parentNode.insertBefore(o, i);
        };
        drift.on('ready',function(api){
            // hide the widget when it first loads
          drift.api.startInteraction({goToConversation: false });
          api.widget.hide()
            // hide the widget when you close the chat
              drift.on('chatClose',function(e){
               api.widget.hide()
            })
        })
      }
    }();
    drift.SNIPPET_VERSION = '0.3.1';
    drift.load("${drift}");
    
    (function() {
    
        var DRIFT_CHAT_SELECTOR = '.drift-open-chat'
        function ready(fn) {
          if (document.readyState != 'loading') {
            fn();
          } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
          } else {
            document.attachEvent('onreadystatechange', function() {
              if (document.readyState != 'loading')
                fn();
            });
          }
        }
        function forEachElement(selector, fn) {
          var elements = document.querySelectorAll(selector);
          for (var i = 0; i < elements.length; i++)
            fn(elements[i], i);
        }
        function openChat(driftApi, event) {
          event.preventDefault();
          driftApi.openChat();
          return false;
        }
        ready(function() {
          drift.on('ready', function(api) {
            var handleClick = openChat.bind(this, api)
            forEachElement(DRIFT_CHAT_SELECTOR, function(el) {
              el.addEventListener('click', handleClick);
            });
          });
        });
    })();
        `;
        document.getElementsByTagName('HEAD')[0].appendChild(scripts)
    }
})();