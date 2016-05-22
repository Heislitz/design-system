(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// : init

'use strict';

var search = require( './search' ),
	fabricator = require( './fabricator' ),
	ripple = require( './ripple' );

( function( $ ) {

	search.init();
	fabricator.init();
	fabricator.buildColorChips();
	fabricator.setActiveItem();
	fabricator.fixSidebar();
	ripple.init( $ );

} )( jQuery );

},{"./fabricator":2,"./ripple":4,"./search":5}],2:[function(require,module,exports){
/**
 * Fabricator Module
 *
 * @module fabricator/scripts/fabricator
 */

'use strict';

var helpers = require( './helpers' );

module.exports = {

	init: function() {
		/**
		 * Cache DOM
		 * @type {Object}
		 */
		this.dom = {
			root: document.querySelector( 'html' ),
			primaryMenu: document.querySelector( '.f-menu' ),
			menuToggle: document.querySelector( '.f-menu-toggle' )
		};

		/**
		 * Set cached DOM as variables and set this to self
		 */
		var self = this,
			menuIcon = this.dom.menuToggle,
			htmlEl = this.dom.root,
			menuItems = this.dom.primaryMenu.getElementsByTagName( 'a' );

		/**
		 * Default options
		 * @type {Object}
		 */
		this.options = {
			menu: false,
			mq: 768
		};

		// open menu by default if large screen
		this.options.menu = window.innerWidth >= this.options.mq;

		//only fire event listeners on mobile
		if ( false === this.options.menu ) {
			// toggle classes on click
			menuIcon.addEventListener( 'click', function() {
				self.toggleClasses( htmlEl, menuIcon );
			} );

			for ( var i = 0; i < menuItems.length; i++ ) {
				menuItems[i].addEventListener( 'click', function() {
					self.toggleClasses( htmlEl, menuIcon );
				} );
			}
		}

		// pass dom selectors to functions
		this.setActiveItem( menuItems );

		return this;

	}, /* end initialize */

	/**
	 * Build color chips
	 * @return {Object}
	 */
	buildColorChips: function() {

		var chips = document.querySelectorAll( '.f-color-chip' ),
			color;

		for ( var i = chips.length - 1; i >= 0; i-- ) {
			color = chips[ i ].querySelector( '.f-color-chip__color' ).innerHTML;
			chips[ i ].style.borderTopColor = color;
			chips[ i ].style.borderBottomColor = color;
		}

		return this;

	},

	/**
	 * Add `f-active` class to active menu item
	 * @return {Object}
	 */
	setActiveItem: function( menuItems ) {

		window.addEventListener( 'hashchange', this.setActive );

		if ( 'undefined' !== typeof menuItems ) {
			this.setActive( menuItems );
		}

		return this;

	},

	/**
	 * Match the window location with the menu item, set menu item as active
	 */
	setActive: function( menuLinks ) {
		var locPath = window.location.pathname,
			locHash = window.location.hash;

		// get current file and hash without first slash
		var current = ( locPath + locHash ).replace( /(^\/)([^#]+)?(#[\w\-\.]+)?$/ig, function( match, slash, file, hash ) {
				hash = hash || '';
				file = file.replace( 'dist/', '' ).replace( 'design-system/', '' ) || '';
				// Currently, without a scrolling listener, there's no way to
				// change as we visit new 'hashes'. Better to leave at top
				// level link
				return './' + file; // + hash.split('.')[0];
			} ) || 'index.html', href;

		// find the current section in the items array
		for ( var i = menuLinks.length - 1; i >= 0; i-- ) {
			var item = menuLinks[ i ];

			// get item href without first slash
			href = item.getAttribute( 'href' ).replace( /^\//g, '' );

			if ( href === current ) {
				helpers.addClass( item, 'current' );
			} else {
				helpers.removeClass( item, 'current' );
			}
		}

		return this;
	},

	/**
	 * Toggle f-menu-active class
	 */
	toggleClasses: function( htmlEl, menuIcon ) {
		if ( !helpers.hasClass( htmlEl, 'f-menu-active' ) ) {
			//if it does not have class, add it
			helpers.addClass( htmlEl, 'f-menu-active' );
			menuIcon.setAttribute( 'aria-expanded', 'true' );
		} else {
			//if it does have class, then remove it
			helpers.removeClass( htmlEl, 'f-menu-active' );
			menuIcon.setAttribute( 'aria-expanded', 'false' );
		}
	},

	/**
	 * Add fixed class to sidebar on scroll
	 * @return {Object}
	 */
	fixSidebar: function() {
		var dsHeaderTop = document.querySelector( '.f-header-top' ),
			dsHeader = document.querySelector( '.f-header' ),
			dsSidebar = document.querySelector( '.f-menu' ),
			headerTopHeight = dsHeaderTop.offsetHeight,
			headerHeight = dsHeader.offsetHeight,
			totalHeaderHeight = headerTopHeight + headerHeight;

		if ( 'undefined' === typeof dsHeaderTop || null === dsHeaderTop ) {
			return;
		}

		if ( 'undefined' === typeof dsHeader || null === dsHeader ) {
			return;
		}

		if ( 'undefined' === typeof dsSidebar || null === dsSidebar ) {
			return;
		}

		window.onscroll = function() {
			var topOffset = window.pageYOffset;

			if ( topOffset > totalHeaderHeight ) {
				helpers.addClass( dsSidebar, 'fixed' );
			} else {
				helpers.removeClass( dsSidebar, 'fixed' );
			}
		};

		return this;

	}
};

},{"./helpers":3}],3:[function(require,module,exports){
/**
 * Helpers Module
 *
 * @module fabricator/scripts/helpers
 */

'use strict';

module.exports = {
	/**
	 * Helper: Add Class to Element
	 */
	addClass: function( el, className ) {
		//Check if element is undefined or null first
		if ( 'undefined' === typeof el || null === el ) {
			return;
		}
		// So we don't have duplicates
		this.removeClass( el, className );
		el.className += ' ' + className;

		return this;
	},

	/**
	 * Helper: Remove Class from Element
	 */
	removeClass: function( el, className ) {
		//Check if element is undefined or null first
		if ( 'undefined' === typeof el || null === el ) {
			return;
		}

		//Go to end of index for existing classes and remove desired class
		if ( el.className.indexOf( ' ' + className ) > -1 ) {
			el.className = el.className.replace( ' ' + className, '' );
		} else if ( el.className.indexOf( className ) > -1 ) {
			el.className = el.className.replace( className, '' );
		}

		return this;
	},

	/**
	 * Helper to check for className on an element
	 */
	hasClass: function( el, className ) {
		//Check if element is undefined or null first
		if ( 'undefined' === typeof el || null === el ) {
			return false;
		}

		return el.className.indexOf( className ) > -1;
	}
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = {

	init: function( $ ) {
		$.ripple( '.btn', {
			debug: false, // Turn Ripple.js logging on/off
			on: 'mousedown', // The event to trigger a ripple effect

			opacity: 0.4, // The opacity of the ripple
			color: 'auto', // Set the background color. If set to "auto", it will use the text color
			multi: false, // Allow multiple ripples per element

			duration: 0.7, // The duration of the ripple

			// Filter function for modifying the speed of the ripple
			rate: function( pxPerSecond ) {
				return pxPerSecond;
			},

			easing: 'linear' // The CSS3 easing function of the ripple
		} );
	}
};


},{}],5:[function(require,module,exports){
/**
 * Search Module
 *
 * @module fabricator/scripts/search
 */

'use strict';

module.exports = {

	init: function() {
		this.input = document.getElementById( 'search-input' );
		this.results = document.getElementById( 'search-results' );
		this.loop =	document.querySelectorAll( '.f-menu .nav a' );

		this.input.addEventListener( 'change', this.watch.bind( this ), false );
		this.input.addEventListener( 'keyup', this.watch.bind( this ), false );
	},

	watch: function() {
		var self = this;

		this.clean();

		if ( '' !== self.input.value ) {
			this.results.className = this.results.className.replace( ' hide', '' );
			Object.keys( this.loop ).map( function( key ) {
				if ( new RegExp( self.input.value, 'i' ).test( self.loop[ key ].text ) ) {
					self.append( self.loop[ key ].cloneNode( true ) );
				}
			} );
		}

	},

	/**
	 * Append the passed value to the results node
	 *
	 * @param  {object} value HTML object
	 * @return {object}       this
	 */
	append: function( value ) {
		this.results.appendChild( value );
		return this;
	},

	/**
	 * Clean out all children
	 * @return {object} this
	 */
	clean: function() {
		this.results.className = this.results.className.replace( ' hide', '' );
		this.results.className += ' hide';
		this.results.innerHTML = '';
		return this;
	}

};

},{}]},{},[1]);