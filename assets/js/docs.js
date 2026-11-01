/* Fena Media Manager documentation: screenshots, contents navigation, active chapter. Vanilla JS, no dependencies. */
( function () {
	'use strict';

	/* Screenshots: show the image once it exists, otherwise keep the dashed placeholder. */
	document.querySelectorAll( '.shot img' ).forEach( function ( img ) {
		var figure = img.closest( '.shot' );

		function loaded() {
			if ( img.naturalWidth > 0 ) {
				figure.classList.add( 'is-loaded' );
			}
		}

		if ( img.complete && img.naturalWidth > 0 ) {
			loaded();
		} else {
			img.addEventListener( 'load', loaded );
		}
	} );

	/* Contents button on small screens. */
	var toggle = document.querySelector( '.nav-toggle' );
	var toc = document.getElementById( 'toc' );
	var wide = window.matchMedia ? window.matchMedia( '(min-width: 1024px)' ) : null;

	function setOpen( open, returnFocus ) {
		if ( ! toggle || ! toc ) {
			return;
		}
		toc.classList.toggle( 'is-open', open );
		toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		if ( ! open && returnFocus ) {
			toggle.focus();
		}
	}

	if ( toggle && toc ) {
		toggle.addEventListener( 'click', function () {
			setOpen( 'true' !== toggle.getAttribute( 'aria-expanded' ), false );
		} );

		toc.addEventListener( 'click', function ( event ) {
			if ( event.target.closest( 'a' ) ) {
				setOpen( false, false );
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' === event.key && 'true' === toggle.getAttribute( 'aria-expanded' ) ) {
				setOpen( false, toc.contains( document.activeElement ) );
			}
		} );

		if ( wide && wide.addEventListener ) {
			wide.addEventListener( 'change', function () {
				setOpen( false, false );
			} );
		}
	}

	/* Active chapter in the contents list. */
	var links = Array.prototype.slice.call( document.querySelectorAll( '.toc a[href^="#"]' ) );
	var byId = {};

	links.forEach( function ( a ) {
		byId[ a.getAttribute( 'href' ).slice( 1 ) ] = a;
	} );

	function mark( id ) {
		links.forEach( function ( a ) {
			if ( byId[ id ] === a ) {
				a.setAttribute( 'aria-current', 'location' );
			} else {
				a.removeAttribute( 'aria-current' );
			}
		} );
	}

	if ( 'IntersectionObserver' in window ) {
		var sections = Object.keys( byId ).map( function ( id ) {
			return document.getElementById( id );
		} ).filter( Boolean );
		var visible = {};

		var observer = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				visible[ entry.target.id ] = entry.isIntersecting;
			} );
			if ( window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2 ) {
				mark( sections[ sections.length - 1 ].id );
				return;
			}
			for ( var i = 0; i < sections.length; i++ ) {
				if ( visible[ sections[ i ].id ] ) {
					mark( sections[ i ].id );
					return;
				}
			}
		}, { rootMargin: '-15% 0px -70% 0px', threshold: 0 } );

		sections.forEach( function ( s ) {
			observer.observe( s );
		} );

		window.addEventListener( 'scroll', function () {
			if ( window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2 ) {
				mark( sections[ sections.length - 1 ].id );
			}
		}, { passive: true } );
	}
}() );
