/*!
 * Shared utilities: focus trapping, the accessible modal factory, toast notifications,
 * and a delegated safety-net handler so every modal close (X) button always works.
 */
"use strict";

  var lastFocused = null;
  function trapFocus(panel, e){
    var focusables = panel.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  function makeModal(overlayClass, panelClass){
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay ' + overlayClass;
    overlay.setAttribute('data-open','false');
    var panel = document.createElement('div');
    panel.className = 'modal-panel ' + panelClass;
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function close(){
      overlay.setAttribute('data-open','false');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    function open(focusTarget){
      lastFocused = document.activeElement;
      overlay.setAttribute('data-open','true');
      document.body.style.overflow = 'hidden';
      setTimeout(function(){ (focusTarget||panel.querySelector('button, [href], input')||panel).focus(); }, 10);
    }
    overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
    overlay.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ close(); }
      if (e.key === 'Tab'){ trapFocus(panel, e); }
    });
    return {overlay:overlay, panel:panel, open:open, close:close};
  }

  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg){
    toast.textContent = msg;
    toast.setAttribute('data-show','true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.setAttribute('data-show','false'); }, 2600);
  }

  /* ================= Universal safety-net close handler =================
     Delegated at the document level so every modal's close (✕) button and
     backdrop click always works, independent of any per-button binding. */
  document.addEventListener('click', function(e){
    var closeBtn = e.target.closest ? e.target.closest('.modal-close') : null;
    if (closeBtn){
      var ov = closeBtn.closest('.modal-overlay');
      if (ov){
        ov.setAttribute('data-open','false');
        document.body.style.overflow = '';
        if (lastFocused) { lastFocused.focus(); }
      }
    }
  });
