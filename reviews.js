/*!
 * Guest reviews: card data, star ratings, the preview grid, and the "show all reviews" modal.
 */
"use strict";

  /* ---------------- Reviews data ---------------- */
  var reviews = [
    {name:"Marcus", date:"October 2026", color:"#3E7CB1", rating:5, text:"Elena's loft completely exceeded expectations. The light in the mornings is unreal, and the location means we walked everywhere. Check-in was seamless with the smart lock."},
    {name:"Priya", date:"September 2026", color:"#B15A3E", rating:5, text:"Beautiful, spotless, and exactly as pictured. The kitchen was fully stocked and the bed was one of the most comfortable we've had on a trip. Would book again in a heartbeat."},
    {name:"Tomas", date:"September 2026", color:"#5A8F5C", rating:5, text:"Perfect base for exploring downtown Manhattan. Elena was responsive and gave great restaurant recommendations. The building felt very secure."},
    {name:"Hana", date:"August 2026", color:"#8C5EB8", rating:4, text:"Loved the industrial details and the quiet street despite being so central. Only downside is street noise on weekend nights, but we expected that in SoHo."},
    {name:"David", date:"August 2026", color:"#C4952E", rating:5, text:"Stunning space, incredibly clean, and the second bedroom was perfect for our kids. Elevator access made hauling luggage easy."},
    {name:"Sofia", date:"July 2026", color:"#3E9C8F", rating:5, text:"This is our second stay here and it's just as wonderful as the first. Elena thinks of every detail, down to extra towels and a well-stocked coffee station."}
  ];
  var starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7L12 2z"/></svg>';
  function starsMarkup(rating){
    var out = '<span class="review-stars" role="img" aria-label="Rated '+rating+' out of 5 stars">';
    for (var s=0; s<5; s++){
      out += '<span style="opacity:'+(s<rating?'1':'.28')+'">'+starSvg+'</span>';
    }
    out += '</span>';
    return out;
  }
  var reviewsGrid = document.getElementById('reviewsGrid');
  reviews.forEach(function(r){
    var card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML =
      '<div class="review-head">' +
        '<div class="review-avatar" style="background:'+r.color+'">'+r.name.charAt(0)+'</div>' +
        '<div><div class="review-name">'+r.name+'</div><div class="review-date">'+r.date+'</div></div>' +
      '</div>' +
      starsMarkup(r.rating) +
      '<p class="review-text clamped">'+r.text+'</p>';
    reviewsGrid.appendChild(card);
  });

  /* build full reviews list for modal */
  var allReviewsList = document.createElement('div');
  allReviewsList.className = 'reviews-grid';
  var extended = reviews.concat(reviews.map(function(r,i){return Object.assign({},r,{date:"June 2026"});}));
  extended.forEach(function(r){
    var card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML =
      '<div class="review-head">' +
        '<div class="review-avatar" style="background:'+r.color+'">'+r.name.charAt(0)+'</div>' +
        '<div><div class="review-name">'+r.name+'</div><div class="review-date">'+r.date+'</div></div>' +
      '</div>' +
      starsMarkup(r.rating) +
      '<p class="review-text">'+r.text+'</p>';
    allReviewsList.appendChild(card);
  });

  /* ---- Reviews modal ---- */
  var reviewsModal = makeModal('', '');
  reviewsModal.panel.setAttribute('aria-labelledby','reviewsTitle');
  reviewsModal.panel.innerHTML = '<button class="modal-close" aria-label="Close reviews">✕</button><h2 class="modal-title" id="reviewsTitle">128 reviews</h2>';
  reviewsModal.panel.appendChild(allReviewsList);
  reviewsModal.panel.querySelector('.modal-close').addEventListener('click', reviewsModal.close);
  document.getElementById('showAllReviews').addEventListener('click', function(){ reviewsModal.open(); });
