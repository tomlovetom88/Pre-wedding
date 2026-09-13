const weddingConfig = {
  brideName: 'NOW',
  groomName: 'TOM',
  weddingDate: '2026-12-28T14:09:00+07:00',
  venue: {
    name: 'บ้านเลขที่ 117 หมู่ 10',
    address: 'ต.ป่าซาง อ.เวียงเชียงรุ้ง จ.เชียงราย',
    mapUrl: 'https://maps.app.goo.gl/VLdhCkeoMF28qCw59'
  },
  gift: { bank: 'BANK NAME', accountName: 'NOW & TOM', accountNumber: '000-0-00000-0' },
  wishesUrl: '#',
  storyVideoUrl: '',
  contact: { bridePhone: '0808617616', groomPhone: '0930347892' },
  musicFile: './assets/music/music.mp3'
};
const $ = (selector) => document.querySelector(selector);
const envelopeScene = $('#envelopeScene');
const envelopeButton = $('#envelopeButton');
const invitation = $('#invitation');
const musicButton = $('#musicButton');
const weddingMusic = $('#weddingMusic');
let envelopeState = 'closed';

function applyConfiguration() {
  document.querySelectorAll('[data-bride]').forEach((el) => { el.textContent = weddingConfig.brideName; });
  document.querySelectorAll('[data-groom]').forEach((el) => { el.textContent = weddingConfig.groomName; });
  document.querySelectorAll('[data-venue]').forEach((el) => { el.textContent = weddingConfig.venue.name; });
  document.querySelectorAll('[data-address]').forEach((el) => { el.textContent = weddingConfig.venue.address; });
  document.querySelectorAll('[data-map]').forEach((el) => { el.href = weddingConfig.venue.mapUrl; });
  document.querySelectorAll('[data-bank]').forEach((el) => { el.textContent = weddingConfig.gift.bank; });
  document.querySelectorAll('[data-account-name]').forEach((el) => { el.textContent = weddingConfig.gift.accountName; });
  document.querySelectorAll('[data-account-number]').forEach((el) => { el.textContent = weddingConfig.gift.accountNumber; });
  const wishesLink = $('#wishesLink');
  if (wishesLink) wishesLink.href = weddingConfig.wishesUrl;
  document.querySelectorAll('[data-bride-phone]').forEach((el) => { el.href = weddingConfig.contact.bridePhone ? `tel:${weddingConfig.contact.bridePhone}` : '#'; });
  document.querySelectorAll('[data-groom-phone]').forEach((el) => { el.href = weddingConfig.contact.groomPhone ? `tel:${weddingConfig.contact.groomPhone}` : '#'; });
  $('[data-bride-phone-text]').textContent = weddingConfig.contact.bridePhone || '………………';
  $('[data-groom-phone-text]').textContent = weddingConfig.contact.groomPhone || '………………';
  if (weddingConfig.storyVideoUrl) {
    $('#videoPlaceholder').innerHTML = `<iframe src="${weddingConfig.storyVideoUrl}" title="Our Story Video" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
  const date = new Date(weddingConfig.weddingDate);
  const display = `${String(date.getDate()).padStart(2, '0')} · ${String(date.getMonth() + 1).padStart(2, '0')} · ${date.getFullYear()}`;
  document.querySelectorAll('[data-display-date]').forEach((el) => { el.textContent = display; });
  $('[data-day]').textContent = String(date.getDate()).padStart(2, '0');
  $('[data-month]').textContent = date.toLocaleDateString('en-US', { month: 'long' });
  $('[data-year]').textContent = date.getFullYear();
  $('[data-weekday]').textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
  if (weddingConfig.musicFile) {
    weddingMusic.querySelector('source').src = weddingConfig.musicFile;
    weddingMusic.load();
  }
}

function hasMusicSource() { return Boolean(weddingMusic.querySelector('source').getAttribute('src')); }
async function tryStartMusic() {
  if (!hasMusicSource()) return;
  try {
    await weddingMusic.play();
    musicButton.classList.add('is-playing');
    musicButton.setAttribute('aria-label', 'หยุดเพลงชั่วคราว');
  } catch (_) { /* The browser may deny playback even after interaction. */ }
}
function handleEnvelope() {
  if (envelopeState === 'closed') {
    envelopeState = 'opening'; envelopeScene.classList.add('is-opening'); envelopeButton.disabled = true;
    musicButton.hidden = false;
    tryStartMusic();
    window.setTimeout(() => {
      envelopeState = 'revealed'; envelopeScene.classList.replace('is-opening', 'is-revealed');
      envelopeButton.disabled = false; envelopeButton.setAttribute('aria-label', 'แตะเพื่อดูคำเชิญฉบับเต็ม');
      musicButton.hidden = false;
    }, 3600);
  } else if (envelopeState === 'revealed') {
    envelopeState = 'next'; invitation.style.display = 'block'; invitation.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => invitation.classList.add('is-visible'));
    envelopeScene.classList.add('is-leaving'); document.body.classList.remove('invitation-locked');
    window.setTimeout(() => { envelopeScene.style.display = 'none'; }, 780);
  }
}
envelopeButton.addEventListener('click', handleEnvelope);
musicButton.addEventListener('click', async () => {
  if (!hasMusicSource()) { musicButton.setAttribute('aria-label', 'ยังไม่ได้เพิ่มไฟล์เพลง'); return; }
  if (weddingMusic.paused) await tryStartMusic();
  else { weddingMusic.pause(); musicButton.classList.remove('is-playing'); musicButton.setAttribute('aria-label', 'เล่นเพลง'); }
});

function updateCountdown() {
  const remaining = Math.max(0, new Date(weddingConfig.weddingDate).getTime() - Date.now());
  const values = { days: Math.floor(remaining / 86400000), hours: Math.floor(remaining / 3600000) % 24, minutes: Math.floor(remaining / 60000) % 60, seconds: Math.floor(remaining / 1000) % 60 };
  Object.entries(values).forEach(([id, value]) => {
    const element = $(`#${id}`);
    const nextValue = String(value).padStart(id === 'days' ? 3 : 2, '0');
    if (element.textContent !== nextValue && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.animate([{ opacity: .45, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360, easing: 'ease-out' });
    }
    element.textContent = nextValue;
  });
}
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const scrollProgress = $('#scrollProgress');
let scrollTicking = false;
function updateScrollEffects() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
  document.documentElement.style.setProperty('--scroll-shift', `${Math.min(10, window.scrollY * 0.015)}px`);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) { window.requestAnimationFrame(updateScrollEffects); scrollTicking = true; }
}, { passive: true });
updateScrollEffects();

const galleryImages = [...document.querySelectorAll('.gallery__item img')];
const lightbox = $('#lightbox'); const lightboxImage = $('#lightboxImage'); const lightboxCounter = $('#lightboxCounter');
let currentImage = 0; let touchStartX = 0;
function showImage(index) { currentImage = (index + galleryImages.length) % galleryImages.length; lightboxImage.src = galleryImages[currentImage].src; lightboxImage.alt = galleryImages[currentImage].alt; lightboxCounter.textContent = `${currentImage + 1} / ${galleryImages.length}`; }
function openLightbox(index) { showImage(index); lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('.lightbox__close').focus(); }
function closeLightbox() { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; $(`.gallery__item[data-index="${currentImage}"]`).focus(); }
document.querySelectorAll('.gallery__item').forEach((item) => item.addEventListener('click', () => openLightbox(Number(item.dataset.index))));
$('.lightbox__close').addEventListener('click', closeLightbox);
$('.lightbox__prev').addEventListener('click', () => showImage(currentImage - 1));
$('.lightbox__next').addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => { const delta = event.changedTouches[0].clientX - touchStartX; if (Math.abs(delta) > 45) showImage(currentImage + (delta < 0 ? 1 : -1)); }, { passive: true });
document.addEventListener('keydown', (event) => { if (!lightbox.classList.contains('is-open')) return; if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowLeft') showImage(currentImage - 1); if (event.key === 'ArrowRight') showImage(currentImage + 1); });

const storyVideoPlayer = $('#storyVideoPlayer');
const videoPlayPause = $('#videoPlayPause');
const videoMute = $('#videoMute');
const videoFullscreen = $('#videoFullscreen');
const videoMenu = $('#videoMenu');
const videoSeek = $('#videoSeek');
const videoCurrentTime = $('#videoCurrentTime');
const videoDuration = $('#videoDuration');

if (storyVideoPlayer && videoPlayPause) {
  const formatVideoTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  };
  const syncVideoControls = () => {
    const isPlaying = !storyVideoPlayer.paused && !storyVideoPlayer.ended;
    videoPlayPause.textContent = isPlaying ? '❚❚' : '▶';
    videoPlayPause.setAttribute('aria-label', isPlaying ? 'หยุดวิดีโอชั่วคราว' : 'เล่นวิดีโอ');
    videoMute.textContent = storyVideoPlayer.muted || storyVideoPlayer.volume === 0 ? '🔇' : '🔊';
    videoCurrentTime.textContent = formatVideoTime(storyVideoPlayer.currentTime);
    videoDuration.textContent = formatVideoTime(storyVideoPlayer.duration);
    videoSeek.value = storyVideoPlayer.duration ? (storyVideoPlayer.currentTime / storyVideoPlayer.duration) * 100 : 0;
  };
  videoPlayPause.addEventListener('click', async () => {
    if (storyVideoPlayer.paused) {
      weddingMusic.pause();
      musicButton.classList.remove('is-playing');
      try { await storyVideoPlayer.play(); } catch (_) { /* Browser may block playback. */ }
    } else storyVideoPlayer.pause();
  });
  videoMute.addEventListener('click', () => { storyVideoPlayer.muted = !storyVideoPlayer.muted; syncVideoControls(); });
  videoSeek.addEventListener('input', () => {
    if (storyVideoPlayer.duration) storyVideoPlayer.currentTime = (Number(videoSeek.value) / 100) * storyVideoPlayer.duration;
  });
  videoFullscreen.addEventListener('click', async () => {
    const target = $('#videoPlaceholder');
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (target.requestFullscreen) await target.requestFullscreen();
    else if (storyVideoPlayer.webkitEnterFullscreen) storyVideoPlayer.webkitEnterFullscreen();
  });
  const playbackRates = [1, 1.25, 1.5, 2, 0.75];
  videoMenu.addEventListener('click', () => {
    const currentIndex = playbackRates.indexOf(storyVideoPlayer.playbackRate);
    storyVideoPlayer.playbackRate = playbackRates[(currentIndex + 1) % playbackRates.length];
    videoMenu.title = `ความเร็ว ${storyVideoPlayer.playbackRate}x`;
    videoMenu.setAttribute('aria-label', `ความเร็ววิดีโอ ${storyVideoPlayer.playbackRate} เท่า`);
  });
  storyVideoPlayer.addEventListener('play', syncVideoControls);
  storyVideoPlayer.addEventListener('pause', syncVideoControls);
  storyVideoPlayer.addEventListener('ended', syncVideoControls);
  storyVideoPlayer.addEventListener('volumechange', syncVideoControls);
  storyVideoPlayer.addEventListener('timeupdate', syncVideoControls);
  storyVideoPlayer.addEventListener('loadedmetadata', syncVideoControls);
  storyVideoPlayer.addEventListener('click', () => videoPlayPause.click());
  syncVideoControls();
}

applyConfiguration(); updateCountdown(); window.setInterval(updateCountdown, 1000);
