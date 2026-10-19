const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '關閉' : '選單';
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '選單';
}));

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach((item) => observer.observe(item));

const recommendations = {
  cheer: { title: '元氣正好・三入概念禮盒', copy: '以舊振南綠豆椪、鳳梨酥與核桃杏香酥組成，替平凡的一天補上一點甜。', message: '你已經做得很好，慢慢來也沒關係。', glyph: '好' },
  meet: { title: '見面真好・四入概念禮盒', copy: '以綠豆椪、太陽餅與鳳梨酥組成分享風味，適合泡一壺茶，把沒說完的近況慢慢聊完。', message: '日子各自忙碌，見到你還是很好。', glyph: '聚' },
  thanks: { title: '有你真好・三入概念禮盒', copy: '以舊振南經典糕餅搭配成溫潤風味，替一句簡單的謝謝，多留一點餘韻。', message: '謝謝你，把普通的日子變得溫柔。', glyph: '謝' },
  new: { title: '好事發生・六入概念禮盒', copy: '以經典漢餅與季節糕點組成，陪伴新的住處、新的工作，或每一個重新出發。', message: '新的日子，願每一步都有好事發生。', glyph: '喜' }
};

let selectedMood = '';
const stepNumber = document.querySelector('#step-number');
const steps = document.querySelectorAll('.finder-step');
const result = document.querySelector('.finder-result');

function showStep(step) {
  steps.forEach((item) => item.classList.toggle('active', Number(item.dataset.step) === step));
  result.classList.remove('active');
  stepNumber.textContent = String(step).padStart(2, '0');
}

document.querySelectorAll('.choice').forEach((choice) => {
  choice.addEventListener('click', () => {
    selectedMood = choice.dataset.mood;
    showStep(2);
  });
});

document.querySelector('.back-button').addEventListener('click', () => showStep(1));

document.querySelectorAll('.recipient').forEach((button) => {
  button.addEventListener('click', () => {
    const pick = recommendations[selectedMood];
    document.querySelector('#result-title').textContent = pick.title;
    document.querySelector('#result-copy').textContent = `${pick.copy} 這次，送給${button.dataset.person}。`;
    document.querySelector('#result-message').textContent = `「${pick.message}」`;
    document.querySelector('#result-glyph').textContent = pick.glyph;
    steps.forEach((item) => item.classList.remove('active'));
    result.classList.add('active');
    stepNumber.textContent = '✓';
  });
});

document.querySelector('.restart-button').addEventListener('click', () => showStep(1));
