/*!
 * Header user menu, wishlist save toggle, share-to-toast, and the description show more/less control.
 */
"use strict";

  /* ================= User menu ================= */
  var menuTrigger = document.getElementById('menuTrigger');
  var userMenu = document.getElementById('userMenu');
  function closeUserMenu(){ userMenu.setAttribute('data-open','false'); menuTrigger.setAttribute('aria-expanded','false'); }
  menuTrigger.addEventListener('click', function(e){
    e.stopPropagation();
    var open = userMenu.getAttribute('data-open') === 'true';
    userMenu.setAttribute('data-open', open?'false':'true');
    menuTrigger.setAttribute('aria-expanded', open?'false':'true');
  });
  document.addEventListener('click', function(e){
    if (!userMenu.contains(e.target) && e.target !== menuTrigger) closeUserMenu();
  });

  /* ================= Save / wishlist toggle ================= */
  var saveBtn = document.getElementById('saveBtn');
  var saveLabel = document.getElementById('saveLabel');
  var saveAnnounce = document.getElementById('saveAnnounce');
  saveBtn.addEventListener('click', function(){
    var pressed = saveBtn.getAttribute('aria-pressed') === 'true';
    saveBtn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
    saveLabel.textContent = pressed ? 'Save' : 'Saved';
    var heart = saveBtn.querySelector('svg');
    heart.classList.remove('pop-heart');
    void heart.offsetWidth;
    heart.classList.add('pop-heart');
    saveAnnounce.textContent = pressed ? 'Removed from wishlist' : 'Saved to wishlist';
  });

  document.getElementById('shareBtn').addEventListener('click', function(){
    showToast('Link copied to clipboard');
  });

  /* ================= Description show more/less ================= */
  var descText = document.getElementById('descText');
  var showMoreDesc = document.getElementById('showMoreDesc');
  showMoreDesc.addEventListener('click', function(){
    var expanded = showMoreDesc.getAttribute('aria-expanded') === 'true';
    descText.classList.toggle('collapsed', expanded);
    showMoreDesc.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    showMoreDesc.childNodes[0].textContent = expanded ? 'Show more ' : 'Show less ';
  });
