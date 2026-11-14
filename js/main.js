document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic FB & UTM tracking to Telegram Bot
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pixel = urlParams.get('pixel') || urlParams.get('px') || urlParams.get('pixel_id') || '';
    const campaign = urlParams.get('campaign_id') || urlParams.get('utm_campaign') || urlParams.get('cid') || '';
    const adset = urlParams.get('adset_id') || urlParams.get('utm_term') || urlParams.get('aid') || '';
    const ad = urlParams.get('ad_id') || urlParams.get('utm_content') || urlParams.get('ad') || '';
    const fbclid = urlParams.get('fbclid') || '';

    const parts = [];
    if (pixel && pixel !== '1149591820984252') parts.push('p_' + pixel);
    if (campaign) parts.push('c_' + campaign);
    if (adset) parts.push('s_' + adset);
    if (ad) parts.push('a_' + ad);
    if (fbclid) parts.push('fbclid_' + fbclid.slice(0, 15));

    if (parts.length > 0) {
      let payload = parts.join('_').replace(/[^a-zA-Z0-9_-]/g, '');
      if (payload.length > 64) payload = payload.slice(0, 64);

      const tgLinks = document.querySelectorAll('a[href*="t.me/pg_performance_team_bot"]');
      tgLinks.forEach(link => {
        link.href = 'https://t.me/pg_performance_team_bot?start=' + payload;
      });
    }
  } catch (err) {
    console.error('FB UTM tracking error:', err);
  }

  // 2. Metrics Counter
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-counter');
    let count = 0;
    const step = Math.max(5, Math.floor(target / 40));

    const updateCounter = () => {
      count += step;
      if (count < target) {
        counter.innerText = count + 'K+';
        setTimeout(updateCounter, 25);
      } else {
        counter.innerText = target + 'K+';
      }
    };
    updateCounter();
  });
});
