// Only count the published portfolio. Rotate the random browser identifier every IST day.
(() => {
  if (location.hostname !== 'codedbysrihari.github.io' || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  async function record() {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', record);
    const day = new Date(Date.now() + 19800000).toISOString().slice(0,10);
    let browser = crypto.randomUUID();
    try {
      const stored = JSON.parse(localStorage.getItem('portfolio-visit'));
      if (stored?.day === day) browser = stored.browser;
      else localStorage.setItem('portfolio-visit', JSON.stringify({ day, browser }));
    } catch { /* Storage can be disabled. Each page then receives a fresh ID. */ }
    let country = 'Unknown';
    try {
      const response = await fetch('https://api.country.is/', {credentials:'omit', referrerPolicy:'no-referrer', signal:AbortSignal.timeout(1800)});
      if (response.ok) country = (await response.json()).country || country;
    } catch { /* A failed lookup still counts as a visit. */ }
    const endpoint = 'https://script.google.com/macros/s/AKfycbyXw6ww6h71w6vwxEuuoBGZCVRMBLiaktxZUGeQPJQfPQN1TdM24W25by5x49oLnnsUow/exec';
    fetch(endpoint, { method:'POST', credentials:'omit', keepalive:true,
      body:new URLSearchParams({event:'view', browser, country}) }).catch(() => {});
  }
  document.addEventListener('visibilitychange', record);
  record();
})();
