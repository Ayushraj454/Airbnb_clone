/*!
 * Scroll-driven UI: sticky sub-nav visibility + active-section tracking, rating-bar
 * and section reveal-on-scroll animations, and header elevation on scroll.
 */
"use strict";

  /* ================= Sticky sub-nav visibility + active section ================= */
  var subNav = document.getElementById('subNav');
  var galleryEl = document.getElementById('photos');
  var sections = ['photos','amenities','reviews','location'].map(function(id){ return document.getElementById(id); });
  var navLinks = document.querySelectorAll('.sub-nav-links a');

  if (typeof IntersectionObserver !== 'undefined'){
    try {
      var galleryObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          subNav.setAttribute('data-visible', entry.isIntersecting ? 'false' : 'true');
        });
      }, {threshold: 0, rootMargin: "-80px 0px 0px 0px"});
      galleryObserver.observe(galleryEl);

      var sectionObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            var id = entry.target.id;
            navLinks.forEach(function(link){
              link.removeAttribute('aria-current');
              if (link.getAttribute('data-section') === id) link.setAttribute('aria-current','true');
            });
          }
        });
      }, {threshold: 0, rootMargin: "-140px 0px -60% 0px"});
      sections.forEach(function(s){ if (s) sectionObserver.observe(s); });

      var barObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('in-view');
            barObserver.unobserve(entry.target);
          }
        });
      }, {threshold: 0.4});
      Array.prototype.forEach.call(document.querySelectorAll('.rating-bar-item'), function(el){ barObserver.observe(el); });

      /* Generic scroll-reveal for section content and staggered groups */
      var revealObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('reveal-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12, rootMargin: "0px 0px -60px 0px"});
      Array.prototype.forEach.call(document.querySelectorAll('.reveal, .reveal-stagger'), function(el){ revealObserver.observe(el); });
    } catch (err){
      console.error('IntersectionObserver setup failed:', err);
    }
  } else {
    /* Fallback: reveal everything immediately if IntersectionObserver isn't supported */
    Array.prototype.forEach.call(document.querySelectorAll('.rating-bar-item'), function(el){ el.classList.add('in-view'); });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal, .reveal-stagger'), function(el){ el.classList.add('reveal-in'); });
  }

  /* ================= Header elevation on scroll ================= */
  var siteHeader = document.querySelector('.site-header');
  var scrollTicking = false;
  function updateHeaderElevation(){
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 4);
    scrollTicking = false;
  }
  window.addEventListener('scroll', function(){
    if (!scrollTicking){
      window.requestAnimationFrame(updateHeaderElevation);
      scrollTicking = true;
    }
  }, {passive:true});
  updateHeaderElevation();
