document.addEventListener('DOMContentLoaded', () => {
  // 1. Number Counter Animation
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-counter');
    let count = 0;
    const step = Math.max(5, Math.floor(target / 40));

    const updateCounter = () => {
      count += step;
      if (count < target) {
        counter.innerText = count;
        setTimeout(updateCounter, 25);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
});
