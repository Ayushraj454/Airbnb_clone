/*!
 * The "show all amenities" modal, grouped by category.
 */
"use strict";

  /* ---- Amenities modal ---- */
  var amenitiesModal = makeModal('', '');
  amenitiesModal.panel.setAttribute('aria-labelledby','amenTitle');
  var amenityData = {
    "Essentials": ["Wifi","Kitchen","Washer","Dryer","Air conditioning","Heating"],
    "Features": ["Dedicated workspace","Smart lock self check-in","Elevator","Iron","Hangers","Extra pillows &amp; blankets"],
    "Safety": ["Smoke alarm","Carbon monoxide alarm","Fire extinguisher","First aid kit"],
    "Not included": ["Pool","Pets allowed","Free parking on premises","Gym"]
  };
  var amenHtml = '<button class="modal-close" aria-label="Close amenities">✕</button><h2 class="modal-title" id="amenTitle">What this place offers</h2><div class="amenity-modal-grid">';
  Object.keys(amenityData).forEach(function(cat){
    amenHtml += '<h3 class="amenity-modal-cat">'+cat+'</h3>';
    amenityData[cat].forEach(function(name){
      var unavailable = cat === "Not included";
      amenHtml += '<div class="amenity-item'+(unavailable?' unavailable':'')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="22" height="22"><circle cx="12" cy="12" r="9"/></svg>'+name+'</div>';
    });
  });
  amenHtml += '</div>';
  amenitiesModal.panel.innerHTML = amenHtml;
  amenitiesModal.panel.querySelector('.modal-close').addEventListener('click', amenitiesModal.close);
  document.getElementById('showAllAmenities').addEventListener('click', function(){ amenitiesModal.open(); });
