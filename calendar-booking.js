/*!
 * Mini calendar preview, the full date-range picker modal (with keyboard navigation
 * and live price recalculation), the guest count popover, and the Reserve button.
 */
"use strict";

  /* ---------------- Mini calendar (informational, non-interactive dates) ---------------- */
  var miniCal = document.getElementById('miniCal');
  var blocked = [3,4,11,12,17,24,25];
  for (var d=1; d<=30; d++){
    var cell = document.createElement('span');
    cell.className = 'day ' + (blocked.indexOf(d)>-1 ? 'blocked' : 'open');
    if (d===14) cell.classList.add('today');
    cell.textContent = d;
    miniCal.appendChild(cell);
  }

  /* ---- Calendar (date range) modal ---- */
  var calModal = makeModal('', '');
  calModal.panel.setAttribute('aria-labelledby','calTitle');
  var checkin = null, checkout = null;
  var allDayButtons = [];
  function buildMonth(container, year, month){
    var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var head = document.createElement('div');
    head.style.fontWeight = '600';
    head.style.marginBottom = '12px';
    head.textContent = monthNames[month] + ' ' + year;
    container.appendChild(head);
    var grid = document.createElement('div');
    grid.setAttribute('role','grid');
    grid.setAttribute('aria-label', monthNames[month] + ' ' + year + ' calendar');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(7,36px)';
    grid.style.gap = '4px';
    grid.style.fontSize = '13px';
    grid.style.textAlign = 'center';
    ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(function(d){
      var el = document.createElement('div');
      el.textContent = d.charAt(0);
      el.setAttribute('aria-hidden','true');
      el.style.color = 'var(--foggy)'; el.style.fontWeight='600'; el.style.padding='6px 0';
      grid.appendChild(el);
    });
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month+1, 0).getDate();
    var cells = [];
    for (var k=0;k<firstDay;k++){ grid.appendChild(document.createElement('div')); cells.push(null); }
    var blockedDays = [3,4,11,12,17,24,25];
    for (var day=1; day<=daysInMonth; day++){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day-btn';
      btn.textContent = day;
      var isBlocked = month === 10 && blockedDays.indexOf(day) > -1;
      var dateObj = new Date(year, month, day);
      var fullLabel = dateObj.toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric', year:'numeric'});
      btn.setAttribute('aria-label', fullLabel + (isBlocked ? ', not available' : ''));
      btn.setAttribute('aria-pressed','false');
      btn.style.padding = '8px 0';
      btn.style.border = '1px solid transparent';
      btn.style.background = 'none';
      btn.style.borderRadius = '50%';
      btn.style.cursor = isBlocked ? 'not-allowed' : 'pointer';
      btn.style.color = isBlocked ? 'var(--faint)' : 'var(--hof)';
      btn.style.textDecoration = isBlocked ? 'line-through' : 'none';
      btn.disabled = isBlocked;
      btn.setAttribute('data-date', dateObj.toISOString());
      if (!isBlocked){
        btn.addEventListener('mouseenter', function(){ this.style.background = 'var(--bg-subtle)'; });
        btn.addEventListener('mouseleave', function(){ if(this.getAttribute('aria-pressed')!=='true') this.style.background='none'; });
        btn.addEventListener('click', function(){ pickDate(new Date(this.getAttribute('data-date'))); });
        allDayButtons.push(btn);
      }
      grid.appendChild(btn);
      cells.push(isBlocked ? null : btn);
    }
    /* Arrow-key navigation between day cells (Home/End jump to first/last available day) */
    grid.addEventListener('keydown', function(e){
      var idx = cells.indexOf(document.activeElement);
      if (idx === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = cells[idx+1];
      else if (e.key === 'ArrowLeft') next = cells[idx-1];
      else if (e.key === 'ArrowDown') next = cells[idx+7];
      else if (e.key === 'ArrowUp') next = cells[idx-7];
      else if (e.key === 'Home'){ for (var i=0;i<cells.length;i++){ if (cells[i]){ next = cells[i]; break; } } }
      else if (e.key === 'End'){ for (var j=cells.length-1;j>=0;j--){ if (cells[j]){ next = cells[j]; break; } } }
      if (next){ e.preventDefault(); next.focus(); }
    });
    container.appendChild(grid);
  }
  function fmt(d){ return d.toLocaleDateString('en-US',{month:'short', day:'numeric'}); }
  function pickDate(d){
    if (!checkin || (checkin && checkout)){
      checkin = d; checkout = null;
    } else if (d > checkin) {
      checkout = d;
    } else {
      checkin = d; checkout = null;
    }
    updateCalSelectionUI();
  }
  function updateCalSelectionUI(){
    document.getElementById('calSelectedText').textContent =
      checkin ? (fmt(checkin) + (checkout ? ' – ' + fmt(checkout) : ' – Add checkout date')) : 'Select check-in date';
    document.getElementById('checkinVal').textContent = checkin ? fmt(checkin) : 'Add date';
    document.getElementById('checkoutVal').textContent = checkout ? fmt(checkout) : 'Add date';

    /* reflect selection + range on every day button for sighted + screen-reader users */
    allDayButtons.forEach(function(btn){
      var d = new Date(btn.getAttribute('data-date'));
      var isEdge = (checkin && d.getTime() === checkin.getTime()) || (checkout && d.getTime() === checkout.getTime());
      var inRange = checkin && checkout && d > checkin && d < checkout;
      btn.setAttribute('aria-pressed', isEdge ? 'true' : 'false');
      btn.classList.toggle('in-range', !!inRange);
      if (!isEdge) btn.style.background = inRange ? '' : 'none';
    });

    if (checkin && checkout){
      var nights = Math.round((checkout - checkin) / 86400000);
      var nightly = 214;
      var subtotal = nights * nightly;
      var service = Math.round(subtotal * 0.151);
      document.getElementById('nightsCount').textContent = nights;
      document.getElementById('subtotalVal').textContent = '$' + subtotal.toLocaleString();
      document.getElementById('serviceFeeVal').textContent = '$' + service.toLocaleString();
      document.getElementById('totalVal').textContent = '$' + (subtotal + 75 + service).toLocaleString();
    }
  }
  var calBody = document.createElement('div');
  calBody.className = 'cal-modal-body';
  var m1 = document.createElement('div'); var m2 = document.createElement('div');
  buildMonth(m1, 2026, 10); buildMonth(m2, 2026, 11);
  calBody.appendChild(m1); calBody.appendChild(m2);
  calModal.panel.innerHTML = '<button class="modal-close" aria-label="Close calendar">✕</button><h2 class="modal-title" id="calTitle">Select dates</h2><p id="calSelectedText" aria-live="polite" style="color:var(--foggy);margin:-8px 0 16px;">Select check-in date</p>';
  calModal.panel.appendChild(calBody);
  var calActions = document.createElement('div');
  calActions.className = 'cal-actions';
  calActions.innerHTML = '<button class="icon-btn" id="clearDates" type="button" style="text-decoration:underline;">Clear dates</button><button class="btn-primary" id="closeCalBtn" type="button">Save</button>';
  calModal.panel.appendChild(calActions);
  calModal.panel.querySelector('.modal-close').addEventListener('click', calModal.close);
  calActions.querySelector('#closeCalBtn').addEventListener('click', calModal.close);
  calActions.querySelector('#clearDates').addEventListener('click', function(){ checkin=null; checkout=null; updateCalSelectionUI(); });

  Array.prototype.forEach.call(document.querySelectorAll('[data-open-cal]'), function(btn){
    btn.addEventListener('click', function(){ calModal.open(); });
  });

  /* ================= Guest popover ================= */
  var guestToggle = document.getElementById('guestToggle');
  var guestPopover = document.getElementById('guestPopover');
  var guestCounts = {adults:1, children:0, infants:0, pets:0};
  function updateGuestSummary(){
    var total = guestCounts.adults + guestCounts.children;
    var parts = [total + (total===1 ? ' guest' : ' guests')];
    if (guestCounts.infants) parts.push(guestCounts.infants + (guestCounts.infants===1?' infant':' infants'));
    if (guestCounts.pets) parts.push(guestCounts.pets + (guestCounts.pets===1?' pet':' pets'));
    document.getElementById('guestSummary').textContent = parts.join(', ');
  }
  function closeGuestPopover(){
    guestPopover.setAttribute('data-open','false');
    guestToggle.setAttribute('aria-expanded','false');
  }
  guestToggle.addEventListener('click', function(e){
    e.stopPropagation();
    var open = guestPopover.getAttribute('data-open') === 'true';
    guestPopover.setAttribute('data-open', open ? 'false' : 'true');
    guestToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  document.addEventListener('click', function(e){
    if (!guestPopover.contains(e.target) && e.target !== guestToggle) closeGuestPopover();
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { closeGuestPopover(); closeUserMenu(); } });

  Array.prototype.forEach.call(document.querySelectorAll('[data-step]'), function(btn){
    btn.addEventListener('click', function(){
      var key = btn.getAttribute('data-step');
      var dir = parseInt(btn.getAttribute('data-dir'),10);
      var min = key === 'adults' ? 1 : 0;
      var max = 8;
      guestCounts[key] = Math.min(max, Math.max(min, guestCounts[key] + dir));
      document.getElementById('count-'+key).textContent = guestCounts[key];
      updateGuestSummary();
      updateStepperDisabledStates();
    });
  });
  function updateStepperDisabledStates(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-step]'), function(btn){
      var key = btn.getAttribute('data-step');
      var dir = parseInt(btn.getAttribute('data-dir'),10);
      var min = key === 'adults' ? 1 : 0;
      if (dir === -1) btn.disabled = guestCounts[key] <= min;
      if (dir === 1) btn.disabled = guestCounts[key] >= 8;
    });
  }
  updateStepperDisabledStates();

  /* ================= Reserve button ================= */
  document.getElementById('reserveBtn').addEventListener('click', function(){
    if (!checkin || !checkout){
      showToast('Please select check-in and check-out dates');
      calModal.open();
    } else {
      showToast('Demo only — no real reservation was made');
    }
  });
