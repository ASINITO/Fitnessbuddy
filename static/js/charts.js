/**
 * FitBuddy Chart.js configurations
 */
function initChart(canvasId, type, data, options) {
  const el = document.getElementById(canvasId);
  if (!el) return null;
  return new Chart(el.getContext('2d'), {
    type: type,
    data: data,
    options: options
  });
}
