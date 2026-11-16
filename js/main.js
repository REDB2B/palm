document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic FB & UTM tracking state
  let fbTrackingParams = '';
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
      fbTrackingParams = parts.join('_').replace(/[^a-zA-Z0-9_-]/g, '');
    }
  } catch (err) {
    console.error('FB UTM tracking error:', err);
  }

  // 2. Interactive Quiz Logic
  const quizState = {
    vertical: 'Adult_Dating',
    service: 'Turnkey_Traffic',
    budget: '1Kto5K'
  };

  const verticalLabels = {
    'Adult_Dating': 'Adult / Dating',
    'Gray_Black': 'Gray & Black Hat',
    'Gambling': 'Gambling & Betting',
    'Crypto': 'Crypto & High-Risk',
    'Hard_Other': 'Любая жесть'
  };

  const serviceLabels = {
    'Turnkey_Traffic': 'Трафик под ключ',
    'Agency_Accounts': 'Агентские аккаунты',
    'Cloak_Funnel': 'Клоака & Воронка'
  };

  const budgetLabels = {
    'UpTo1K': 'до $1,000 / сут',
    '1Kto5K': '$1,000 – $5,000 / сут',
    '5KPlus': '$5,000+ / сут'
  };

  function updateAllLinks() {
    let payload = `v_${quizState.vertical}_s_${quizState.service}`;
    if (fbTrackingParams) {
      payload = fbTrackingParams + '_' + payload;
    }
    if (payload.length > 64) payload = payload.slice(0, 64);

    const fullBotLink = 'https://t.me/pg_performance_team_bot?start=' + payload;

    const allTgLinks = document.querySelectorAll('a[href*="t.me/pg_performance_team_bot"]');
    allTgLinks.forEach(link => {
      link.href = fullBotLink;
    });

    const summaryEl = document.getElementById('quiz-summary-text');
    if (summaryEl) {
      summaryEl.innerText = `${verticalLabels[quizState.vertical]} · ${serviceLabels[quizState.service]} · ${budgetLabels[quizState.budget]}`;
    }
  }

  // Handle pill clicks
  const pills = document.querySelectorAll('.quiz-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const parent = pill.closest('.pill-grid');
      if (!parent) return;
      const group = parent.getAttribute('data-group');
      const val = pill.getAttribute('data-val');

      parent.querySelectorAll('.quiz-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      quizState[group] = val;
      updateAllLinks();
    });
  });

  // Initial link setup
  updateAllLinks();

  // 3. Metrics Counter
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
