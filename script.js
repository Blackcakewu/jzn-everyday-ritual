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
  '完成挑戰': { value: '陪伴與肯定', detail: '你想慶祝的不只是成果，而是彼此一路接住對方的默契。', tags: ['陪伴','成就','感謝'], title: '元氣正好・三入概念禮盒', copy: '綠豆椪・鳳梨酥・核桃杏香酥', message: '你做到了，而我很開心一路都在。', glyph: '好' },
  '久別重逢': { value: '連結與珍惜', detail: '時間讓你們走向不同生活，但再見面時仍想好好接住彼此。', tags: ['重逢','陪伴','回憶'], title: '見面真好・四入概念禮盒', copy: '綠豆椪・太陽餅・鳳梨酥', message: '日子各自忙碌，見到你還是很好。', glyph: '聚' },
  '新的開始': { value: '勇氣與祝福', detail: '你想讓對方知道，新的選擇有人理解，也有人真心期待。', tags: ['勇氣','成長','祝福'], title: '好事發生・六入概念禮盒', copy: '經典漢餅・綠豆椪・季節糕點', message: '新的日子，願每一步都有好事發生。', glyph: '喜' },
  '單純想念': { value: '思念與在乎', detail: '不需要特殊理由，你只是想讓對方在普通的一天感受到被記得。', tags: ['想念','日常','溫柔'], title: '有你真好・三入概念禮盒', copy: '鳳梨酥・核桃杏香酥・太陽餅', message: '沒有特別的日子，只是今天剛好想起你。', glyph: '念' }
};

let selectedOccasion = '完成挑戰';
let currentStory = '';
const stepNumber = document.querySelector('#step-number');
const steps = document.querySelectorAll('.finder-step');
const flowSteps = document.querySelectorAll('.demo-flow span');

function showStep(step) {
  steps.forEach((item) => item.classList.toggle('active', Number(item.dataset.step) === step));
  stepNumber.textContent = String(step).padStart(2, '0');
  flowSteps.forEach((item, index) => item.classList.toggle('active', index + 1 <= step));
}

document.querySelectorAll('.occasion').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.occasion').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    selectedOccasion = button.dataset.occasion;
  });
});

function applyRecommendation() {
  const pick = recommendations[selectedOccasion];
  document.querySelector('#value-title').textContent = pick.value;
  document.querySelector('#value-copy').textContent = pick.detail;
  document.querySelector('#value-tags').innerHTML = pick.tags.map((tag) => `<span>${tag}</span>`).join('');
  document.querySelector('#result-title').textContent = pick.title;
  document.querySelector('#result-copy').textContent = pick.copy;
  document.querySelector('#result-glyph').textContent = pick.glyph;
  document.querySelector('#ritual-action').textContent = `一起拆開「${pick.title.replace(/・.*$/, '')}」禮盒`;
  document.querySelector('#ritual-message').textContent = `「${pick.message}」`;
  document.querySelector('#memory-occasion').textContent = `${selectedOccasion}的日子`;
  document.querySelector('#memory-title').textContent = pick.message;
  document.querySelector('#memory-page-title').textContent = pick.message;
  document.querySelector('#memory-page-story').textContent = currentStory;
  document.querySelector('#memory-page-message').textContent = `「${pick.message}」`;
}

document.querySelector('.demo-next').addEventListener('click', () => {
  currentStory = document.querySelector('#story-input').value.trim();
  const error = document.querySelector('#story-error');
  if (currentStory.length < 12) {
    error.textContent = '再多告訴我們一點吧，至少輸入 12 個字。';
    return;
  }
  error.textContent = '';
  applyRecommendation();
  showStep(2);
});

document.querySelectorAll('.back-button').forEach((button) => button.addEventListener('click', () => {
  const active = Number(document.querySelector('.finder-step.active').dataset.step);
  showStep(Math.max(1, active - 1));
}));

document.querySelector('.value-next').addEventListener('click', () => showStep(3));

function makeStoryUrl() {
  const data = btoa(unescape(encodeURIComponent(JSON.stringify({ story: currentStory, occasion: selectedOccasion }))));
  return `${location.origin}${location.pathname}?memory=${encodeURIComponent(data)}#memory`;
}

document.querySelector('.story-next').addEventListener('click', () => {
  showStep(4);
  const url = makeStoryUrl();
  const qrTarget = document.querySelector('#story-qr');
  qrTarget.innerHTML = '';
  if (window.QRCode) {
    new QRCode(qrTarget, {
      text: url,
      width: 168,
      height: 168,
      colorDark: '#33261d',
      colorLight: '#fffaf0',
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    qrTarget.textContent = 'QR Code 載入失敗，請使用下方預覽連結。';
  }
  document.querySelector('.memory-preview').href = url;
});

document.querySelector('.restart-button').addEventListener('click', () => {
  document.querySelector('#story-input').value = '';
  document.querySelector('.memory-page').classList.remove('visible-memory');
  showStep(1);
});

const memoryParam = new URLSearchParams(location.search).get('memory');
if (memoryParam) {
  try {
    const saved = JSON.parse(decodeURIComponent(escape(atob(memoryParam))));
    currentStory = saved.story;
    selectedOccasion = saved.occasion;
    applyRecommendation();
    document.querySelector('.memory-page').classList.add('visible-memory');
  } catch (error) {
    console.warn('無法讀取故事資料。', error);
  }
}
