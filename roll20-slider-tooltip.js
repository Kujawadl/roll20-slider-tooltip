// ==UserScript==
// @name Roll20 Multi-Sided Slider Tooltip
// @namespace https://githup.com/Kujawadl/roll20-slider-tooltip
// @version 0.1
// @description Displays the selected value of multiside value sliders via tipsy
// @match https://app.roll20.net/editor
// @copyright 2022+ Dylan Jager-Kujawa
// ==/UserScript==

/**
 * Listens for changes to the given DOM element
 * @param {HTMLElement} el
 * @param {(mutations: MutationRecord[]) => void} callback
 */
function observeDOM(el, callback) {
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;

  if (!el || el.nodeType !== 1) {
    return;
  }

  if (MutationObserver) {
    // define a new observer
    const mutationObserver = new MutationObserver(callback);

    // have the observer observe the element for changes in children
    mutationObserver.observe(el, { childList: true, subtree: true });
    return mutationObserver;
  }
}

/**
 * @param {MutationRecord[]} mutations
 */
function main(mutations) {
  const addedNodes =
    Array.isArray(mutations) &&
    mutations.reduce(
      (acc, rec) =>
        acc.concat(...(rec ? rec.addedNodes : [])).concat(rec.target),
      []
    );

  // Find the sliders that were added, if any
  const sliders = $(addedNodes).find(".sideslider");

  // Attach event listeners to the sliders to show the tooltip
  sliders.each(function () {
    const slider = $(this);
    slider.tipsy({
      trigger: "manual",
      gravity: "n",
    });
    slider.on("slidestop", function () {
      slider.tipsy("hide");
    });
    slider.on("slidestart", function () {
      slider.tipsy("show");
    });
    slider.on("slide", function (e, ui) {
      slider.attr("title", ui.value);
    });
    slider.attr("title", slider.slider("value"));
  });
}

$(document).ready(function () {
  observeDOM(document.body, main);
});
