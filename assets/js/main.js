/* Precision Asset Transportation — site behaviour
   Everything here is progressive enhancement: the site is fully usable
   with JavaScript turned off. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------ reveal on scroll */
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      io.observe(el);
    });
  }

  /* ------------------------------------------------------ portfolio filter */
  var filters = document.querySelectorAll(".filter");
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        document.querySelectorAll(".project").forEach(function (p) {
          p.hidden = !(f === "all" || p.getAttribute("data-cat") === f);
          p.classList.add("is-in");
        });
      });
    });
  }

  /* ------------------------------------------------------------ quote form
     By default the form has no server behind it, so we hand the enquiry to
     the visitor's mail client. To switch to a hosted form service, set
     FORM_ENDPOINT below to the URL you are given (Formspree, FormSubmit,
     Netlify Forms, etc.) and the form will POST there instead.           */
  var FORM_ENDPOINT = "";
  var FALLBACK_EMAIL = "monroe@aseherbs.com";

  var form = document.getElementById("quote-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function say(message, ok) {
    if (!status) return;
    status.textContent = message;
    status.style.color = ok ? "#1c6b3f" : "#a3341f";
    status.classList.add("is-visible");
  }

  form.addEventListener("submit", function (e) {
    if (!form.checkValidity()) return; /* let the browser show its messages */

    var data = new FormData(form);
    var lines = [];
    data.forEach(function (value, key) {
      if (String(value).trim() !== "") {
        lines.push(key.replace(/_/g, " ").toUpperCase() + ": " + value);
      }
    });

    if (FORM_ENDPOINT) {
      e.preventDefault();
      var button = form.querySelector("button[type=submit]");
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        say("Thank you — your request is in. We reply within one business day. Need us sooner? Call 1-888-751-9924.", true);
      }).catch(function () {
        say("That did not go through. Please call us at 1-888-751-9924 and we will take the details by phone.", false);
      }).then(function () {
        if (button) { button.disabled = false; button.textContent = "Request My Estimate"; }
      });
      return;
    }

    /* No endpoint configured: open the visitor's mail client, pre-filled. */
    e.preventDefault();
    var subject = "Quote request — " + (data.get("service") || "Property services");
    var href = "mailto:" + FALLBACK_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
    say("Your email program is opening with these details. If nothing happens, call 1-888-751-9924 or email " + FALLBACK_EMAIL + ".", true);
  });

  /* Pre-select the service when arriving from a "Get an estimate" link. */
  var wanted = new URLSearchParams(location.search).get("service");
  var sel = form.querySelector("#service");
  if (wanted && sel) {
    var w = wanted.toLowerCase();
    for (var i = 0; i < sel.options.length; i++) {
      var o = sel.options[i].text.toLowerCase();
      if (o && (o.indexOf(w.slice(0, 6)) === 0 || (w.indexOf("moving") === 0 && o.indexOf("moving") === 0))) { sel.selectedIndex = i; break; }
    }
  }

  /* Set a sensible default for the "preferred date" minimum. */
  var dateField = form.querySelector('input[type="date"]');
  if (dateField && !dateField.min) {
    dateField.min = new Date().toISOString().slice(0, 10);
  }
})();
