/*!
 * Hero photo gallery grid, the "show all photos" grid modal, and the fullscreen lightbox.
 */
"use strict";

  /* ---------------- Build hero gallery grid ---------------- */
  var galleryGrid = document.getElementById('galleryGrid');
  for (var i=0;i<5;i++){
    var tile = document.createElement('div');
    tile.className = 'g-tile' + (i===0 ? ' g-main':'');
    tile.setAttribute('role','button');
    tile.setAttribute('tabindex','0');
    tile.setAttribute('data-index', i);
    tile.setAttribute('aria-label','Open photo: ' + photoTitles[i]);
    tile.style.animationDelay = (i * 0.06) + 's';
    var img = document.createElement('img');
    img.src = svgDataUri(i);
    img.alt = photoTitles[i] + ' — Sunlit Loft in the Heart of SoHo';
    tile.appendChild(img);
    var cap = document.createElement('span');
    cap.className = 'g-caption';
    cap.setAttribute('aria-hidden','true');
    cap.textContent = photoTitles[i];
    tile.appendChild(cap);
    galleryGrid.appendChild(tile);
  }

  /* ---------------- Build "show all photos" modal grid ---------------- */
  var photoGridModal = document.createElement('div');
  photoGridModal.className = 'photo-grid-modal';
  for (var j=0;j<PHOTO_COUNT;j++){
    (function(idx){
      var t = document.createElement('div');
      t.className = 'g-tile';
      t.setAttribute('role','button');
      t.setAttribute('tabindex','0');
      t.setAttribute('aria-label','Open photo: ' + photoTitles[idx]);
      var im = document.createElement('img');
      im.src = svgDataUri(idx);
      im.alt = photoTitles[idx];
      t.appendChild(im);
      var cap2 = document.createElement('span');
      cap2.className = 'g-caption';
      cap2.setAttribute('aria-hidden','true');
      cap2.textContent = photoTitles[idx];
      t.appendChild(cap2);
      t.addEventListener('click', function(){ openLightbox(idx); });
      t.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault(); openLightbox(idx);} });
      photoGridModal.appendChild(t);
    })(j);
  }

  /* ---- Photos "show all" modal ---- */
  var photosModal = makeModal('', '');
  photosModal.panel.innerHTML = '<button class="modal-close" aria-label="Close photos">✕</button><h2 class="modal-title" id="photosModalTitle">All photos</h2>';
  photosModal.panel.setAttribute('aria-labelledby','photosModalTitle');
  photosModal.panel.appendChild(photoGridModal);
  photosModal.panel.querySelector('.modal-close').addEventListener('click', photosModal.close);
  document.getElementById('showAllPhotos').addEventListener('click', function(){ photosModal.open(); });

  /* ---- Lightbox ---- */
  var lightbox = makeModal('lightbox-overlay', 'lightbox-panel');
  var lbIndex = 0;
  lightbox.panel.innerHTML =
    '<button class="modal-close" aria-label="Close photo viewer">✕</button>' +
    '<div class="lightbox-img-wrap"><button class="lightbox-nav-btn prev" aria-label="Previous photo">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="black" stroke-width="2.4"><path d="M15 18l-6-6 6-6"/></svg></button>' +
    '<img id="lbImg" alt="" style="max-height:70vh;border-radius:8px;">' +
    '<button class="lightbox-nav-btn next" aria-label="Next photo"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="black" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg></button></div>' +
    '<div class="lightbox-counter"><span id="lbTitle" style="font-weight:600;"></span> · <span id="lbCounter"></span></div>';
  lightbox.panel.setAttribute('aria-label','Photo viewer');
  function renderLightbox(){
    lightbox.panel.querySelector('#lbImg').src = svgDataUri(lbIndex);
    lightbox.panel.querySelector('#lbImg').alt = photoTitles[lbIndex];
    lightbox.panel.querySelector('#lbTitle').textContent = photoTitles[lbIndex];
    lightbox.panel.querySelector('#lbCounter').textContent = (lbIndex+1) + ' / ' + PHOTO_COUNT;
  }
  function openLightbox(i){ lbIndex = i; renderLightbox(); lightbox.open(lightbox.panel.querySelector('.modal-close')); }
  lightbox.panel.querySelector('.modal-close').addEventListener('click', lightbox.close);
  lightbox.panel.querySelector('.prev').addEventListener('click', function(){ lbIndex = (lbIndex-1+PHOTO_COUNT)%PHOTO_COUNT; renderLightbox(); });
  lightbox.panel.querySelector('.next').addEventListener('click', function(){ lbIndex = (lbIndex+1)%PHOTO_COUNT; renderLightbox(); });
  lightbox.overlay.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft'){ lbIndex = (lbIndex-1+PHOTO_COUNT)%PHOTO_COUNT; renderLightbox(); }
    if (e.key === 'ArrowRight'){ lbIndex = (lbIndex+1)%PHOTO_COUNT; renderLightbox(); }
  });
  Array.prototype.forEach.call(galleryGrid.children, function(tile){
    tile.addEventListener('click', function(){ openLightbox(parseInt(tile.getAttribute('data-index'),10)); });
    tile.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLightbox(parseInt(tile.getAttribute('data-index'),10)); } });
  });
