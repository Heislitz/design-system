'use strict';

( function( $, document ) {

	window.ripple = function( selector, options ) {

		var init = function() {

			var self = this;

			self.selector = selector;
			self.defaults = {
				debug: false,
				on: 'mousedown',

				opacity: 0.4,
				color: 'auto',
				multi: false,

				duration: 0.7,
				rate: function( pxPerSecond ) {
					return pxPerSecond;
				},

				easing: 'linear'
			};

			self.defaults = $.extend( {}, self.defaults, options );

			$( document ).on( self.defaults.on, self.selector, rippleTrigger );
		};

		var rippleTrigger = function( e ) {

			var $this = $( this );
			var $ripple;
			var settings;

			$this.addClass( 'ds-has-ripple' );

			// This instances settings
			settings = $.extend( {}, self.defaults, $this.data() );

			// Create the ripple element
			if ( settings.multi || !settings.multi && $this.find( '.ds-ripple' ).length === 0 ) {
				$ripple = $( '<span></span>' ).addClass( 'ds-ripple' );
				$ripple.appendTo( $this );

				// Set ripple size
				if ( !$ripple.height() && !$ripple.width() ) {
					var size = Math.max( $this.outerWidth(), $this.outerHeight() );

					$ripple.css( {
						height: size,
						width: size
					} );

				}

				// Give the user the ability to change the rate of the animation
				// based on element width
				if ( settings.rate && typeof settings.rate === 'function' ) {

					// rate = pixels per second
					var rate = Math.round( $ripple.width() / settings.duration );

					// new amount of pixels per second
					var filteredRate = settings.rate( rate );

					// Determine the new duration for the animation
					var newDuration = $ripple.width() / filteredRate;

					// Set the new duration if it has not changed
					if ( settings.duration.toFixed( 2 ) !== newDuration.toFixed( 2 ) ) {
						settings.duration = newDuration;
					}
				}

				// Set the color and opacity
				var color = settings.color === 'auto' ? $this.css( 'color' ) : settings.color;
				var css = {
					animationDuration: settings.duration.toString() + 's',
					animationTimingFunction: settings.easing,
					background: color,
					opacity: settings.opacity
				};

				$ripple.css( css );
			}

			// Ensure we always have the ripple element
			if ( !settings.multi ) {
				$ripple = $this.find( '.ds-ripple' );
			}

			// Kill animation
			$ripple.removeClass( 'ds-ripple-animate' );

			// Retrieve coordinates
			var x = e.pageX - $this.offset().left - $ripple.width() / 2;
			var y = e.pageY - $this.offset().top - $ripple.height() / 2;

			/**
			 * We want to delete the ripple elements if we allow multiple so we dont
			 * sacrifice any page performance. We don't do this on single ripples
			 * because once it has rendered, we only need to trigger paints thereafter.
			 */
			if ( settings.multi ) {
				$ripple.one( 'animationend webkitAnimationEnd oanimationend MSAnimationEnd',
					function() {
						$( this ).remove();
					}
				);
			}

			// Set position and animate
			$ripple.css( {
				top: y + 'px',
				left: x + 'px'
			} ).addClass( 'ds-ripple-animate' );
		};

		init();

	};

} )( jQuery, document );