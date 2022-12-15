//flyout cart
function update_flyoutcart() {
    if (window["_3d_cart"] != undefined) {

        if (_3d_cart.oid == 0)
            return;

            jQuery('#floating-cart .minicart-items').text(_3d_cart.itemsum);
            jQuery('#floating-cart').fadeIn(300);

        CheckCartOpen();

        return;
    }	
    jQuery.ajax({
        url: '/frontapi.asp',
        dataType: 'json',
        type: 'GET',
        cache: false,
        data: {
            module: 'cartajax',
        },
        success: function (data) {

            if (data.ItemsInCart != undefined) {
                if (data.ItemsInCart.length > 0) {

                    var totalItems = 0;
                    for (i = 0; i < data.ItemsInCart.length; i++) {
                        totalItems += data.ItemsInCart[i].qty;
                    }
                    if (totalItems != null) jQuery('#floating-cart .minicart-items').text(totalItems);
                    jQuery('#floating-cart').fadeIn(300);

					//Dropdown cart
					//core_dropdown_cart(data);
                }
            }
        },
        error: function (objError) {
            //alert('Error');
            return;
        }
    });
}

function CheckCartOpen(){

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let isOpenCart = params.oc;

  if (isOpenCart != null){
    jQuery('#c-button--push-right').trigger('click'); 
  }

}

function addcart_callback(productDiv, data) {
    jQuery(productDiv).addClass('ajaxcart-complete');
    setTimeout(function () { jQuery(productDiv).removeClass('ajaxcart-complete'); }, 1000);

    var itemsInCart = 0;
    var subtotal = 0;

    jQuery(data.ItemsInCart).each(function (index, item) {
        itemsInCart += item.qty;
        subtotal += (item.price * item.qty);
    });
	//minicart - subtotal
    subtotal = subtotal.toFixed(jQuery('body').data('decimal'));
    jQuery('.minicart-items').text(itemsInCart);
    update_flyoutcart();

    var currency = jQuery('body').data('currency');
    jQuery('.minicart-subtotal').text(currency + subtotal);   
}

function mailinglist_callfront(form) {
    jQuery(form).find('.mailinglist-input').prop('disabled', true);
    jQuery(form).find('.mailinglist-submit').prop('disabled', true);
    jQuery(form).find('#mailing-btn-txt').addClass('hidden');
    jQuery(form).find('#mailing-btn-load').removeClass('hidden');

    jQuery('#mailinglist-response').slideUp(300);
    jQuery('#mailinglist-response div').addClass('hidden');
}

function mailinglist_response(form, response) {

    jQuery(form).find('.mailinglist-input').prop("disabled", false);
    jQuery(form).find('.mailinglist-submit').prop("disabled", false);


    if (response == 1 || response == 3) {
        jQuery('#mailinglist-response .mailinglist-subscribed').removeClass('hidden');
        jQuery('#mailinglist-response').slideDown(300);
		jQuery('.mailinglist-input').attr( 'aria-invalid', 'false');
    }
    else if (response == -1) {
        jQuery('#mailinglist-response .mailinglist-unsubscribed').removeClass('hidden');
        jQuery('#mailinglist-response').slideDown(300);
		jQuery('.mailinglist-input').attr( 'aria-invalid', 'false');
    }
    else if (response == 2) {
        jQuery('#mailinglist-response .mailinglist-error').removeClass('hidden');
        jQuery('#mailinglist-response').slideDown(300);
		jQuery('.mailinglist-input').attr( 'aria-invalid', 'true');
    }

    jQuery(form).find('#mailing-btn-txt').removeClass('hidden');
    jQuery(form).find('#mailing-btn-load').addClass('hidden');

}

function moveMenu() {
    var respWidth = window.innerWidth;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari/") !== -1 && ua.indexOf("chrom") === -1) {
        respWidth = jQuery(window).width();
    }

    if (respWidth < 767) {
        jQuery('#menulinks').appendTo('#mobile-menulinks');
        jQuery('#categories').appendTo('#mobile-categories');
    }
    else {
        jQuery('#menulinks').appendTo('#menulinks-outer');
        jQuery('#categories').appendTo('#navbar');
    }
}

jQuery(document).ready(function () {

    update_flyoutcart();

    jQuery('#mobile-menu-trigger').click(function (e) {
        e.preventDefault();

        jQuery('#mobile-menu').show(0, function () {
            jQuery('body').addClass('menu-open');
        });
    });

    jQuery('.mobile-menu-close').click(function (e) {
        e.preventDefault();

        jQuery('body').removeClass('menu-open');
        setTimeout(function () {
            jQuery('#mobile-menu').hide(0);
        }, 250);
    });


    var respWidth = window.innerWidth;
    if (respWidth >= 767) {
    	jQuery('.navbar .dropdown').hover(function () {
    		jQuery(this).find('.dropdown-menu').first().stop(true, true).delay(250).slideDown('fast');

    	}, function () {
    		jQuery(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp('fast');

    	});

    	jQuery('.navbar .dropdown > a').click(function () {
    		location.href = this.href;
    	});
    }

});

jQuery(function () { 
	jQuery('.navbar .dropdown > a').attr("aria-expanded","false");
	jQuery('.navbar .dropdown > a').attr("aria-haspopup","true");
    jQuery('.navbar .dropdown > a').hover(function (e) {
        var menuItem = jQuery( e.currentTarget );

        if (menuItem.attr( 'aria-expanded') === 'true') {
            jQuery(this).attr( 'aria-expanded', 'false');
        } else {
            jQuery(this).attr( 'aria-expanded', 'true');
        }
    });
});


jQuery(window).load(function () {
    moveMenu();
});
jQuery(window).resize(function () {
    moveMenu();
});

jQuery(function ($) {
	$('.navbar .dropdown').hover(function () {
		$(this).find('.dropdown-menu').first().stop(true, true).delay(250).slideDown();

	}, function () {
		$(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp();

	});

	$('.navbar .dropdown > a').click(function () {
		location.href = this.href;
	});

});

(function(window) {

  'use strict';

  /**
   * Extend Object helper function.
   */
  function extend(a, b) {
    for(var key in b) { 
      if(b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * Each helper function.
   */
  function each(collection, callback) {
    for (var i = 0; i < collection.length; i++) {
      var item = collection[i];
      callback(item);
    }
  }

  /**
   * Menu Constructor.
   */
  function Menu(options) {
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }

  /**
   * Menu Options.
   */
  Menu.prototype.options = {
    wrapper: '#o-wrapper',          // The content wrapper
    type: 'slide-left',             // The menu type
    menuOpenerClass: '.c-button',   // The menu opener class names (i.e. the buttons)
    maskId: '#c-mask'               // The ID of the mask
  };

  /**
   * Initialise Menu.
   */
  Menu.prototype._init = function() {
    this.body = document.body;
    this.wrapper = document.querySelector(this.options.wrapper);
    this.mask = document.querySelector(this.options.maskId);
    this.menu = document.querySelector('#c-menu--' + this.options.type);
    this.closeBtn = this.menu.querySelector('.c-menu__close');
    this.menuOpeners = document.querySelectorAll(this.options.menuOpenerClass);
    this._initEvents();
  };

  /**
   * Initialise Menu Events.
   */
  Menu.prototype._initEvents = function() {
    // Event for clicks on the close button inside the menu.
    this.closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));

    // Event for clicks on the mask.
    this.mask.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));
  };

  /**
   * Open Menu.
   */
  Menu.prototype.open = function() {
    this.body.classList.add('has-active-menu');
    this.wrapper.classList.add('has-' + this.options.type);
    this.menu.classList.add('is-active');
    this.mask.classList.add('is-active');
    this.disableMenuOpeners();
  };

  /**
   * Close Menu.
   */
  Menu.prototype.close = function() {
    this.body.classList.remove('has-active-menu');
    this.wrapper.classList.remove('has-' + this.options.type);
    this.menu.classList.remove('is-active');
    this.mask.classList.remove('is-active');
    this.enableMenuOpeners();
  };

  /**
   * Disable Menu Openers.
   */
  Menu.prototype.disableMenuOpeners = function() {
    each(this.menuOpeners, function(item) {
      item.disabled = true;
    });
  };

  /**
   * Enable Menu Openers.
   */
  Menu.prototype.enableMenuOpeners = function() {
    each(this.menuOpeners, function(item) {
      item.disabled = false;
    });
  };

  /**
   * Add to global namespace.
   */
  window.Menu = Menu;

})(window);

var pushRight = new Menu({
	wrapper: '#o-wrapper',
	type: 'push-right',
	menuOpenerClass: '.c-button',
	maskId: '#c-mask'
  });

  var pushRightBtn = document.querySelector('#c-button--push-right');

  pushRightBtn.addEventListener('click', function(e) {
	e.preventDefault;
	pushRight.open();
  });

var baseItem = $('.cart-item0');
jQuery('#open-cart').click(function(e) {
    updatecart_callback();
});

jQuery(document).ready(function(){
    
    if(localStorage.getItem('cart_modal') == 'show'){
        //flycart();
        jQuery('#c-button--push-right').trigger('click'); 
        localStorage.setItem("cart_modal", "hide");
    }else{                    
        localStorage.setItem("cart_modal", "hide");         
    }
    
    jQuery("#c-button--push-rightMob").click(function(){
		jQuery("#c-button--push-right").click();
	});
});


if (typeof window.reloadCart == 'undefined' || window.reloadCart == true) {
  jQuery(".dropdown-cart").load("/view_cart.asp #recalculate", function() {
	  jQuery('#AjaxLoading').hide();
	  // jQuery('.dropdown-cart form').attr('id', 'DropdownCartForm');
	   jQuery(".dropdown-cart .checkout-btns").after("<a class='btn view-cart-btn' href='/view_cart.asp'>View Cart</a>");
	   if(!jQuery(".dropdown-cart").is(':animated')) {
		 jQuery(".dropdown-cart").slideDown('fast');
	   }

	  // Toggle Options
	  jQuery('a.view-options').click(function (e) {
		 e.preventDefault();
		 var target = jQuery(this).data('target');
		 jQuery(target).slideToggle();
	  });

	  //Update cart
		 jQuery('.update-qty').click(function (e) {
			e.preventDefault();
			jQuery('#recalculate').submit();
		 });

  });
  window.reloadCart = false;
} 

jQuery('.addToCartBlock button#Add').click(function (e) {
	e.preventDefault();    
    localStorage.setItem("cart_modal", "show");        
}); 

function deleteGCReload(txtQtd) {
    if (jQuery(`#${txtQtd}`)) {
        jQuery(`#${txtQtd}`).val(0);
        return true;
    } else
        return false;
}