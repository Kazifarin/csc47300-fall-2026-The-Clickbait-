// Campus atmosphere and damped perspective, implemented with browser APIs only.

export function initVisuals(): void {
  const scene = document.getElementById('campusScene');
  const tilt = document.getElementById('sceneTilt');
  const particles = document.getElementById('particles');
  if (!scene || !tilt || !particles) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)');
  for (let i = 0; i < 22; i++) {
    const dot = document.createElement('i');
    dot.style.cssText = `left:${(i * 37 + 9) % 100}%;top:${(i * 23 + 13) % 100}%;--delay:${-i * 1.7}s;--duration:${14 + i % 7 * 3}s;--size:${2 + i % 3}px`;
    particles.append(dot);
  }
  let visible = true, frame = 0, x = 0, y = 0, targetX = 0, targetY = 0;
  function stop(): void { cancelAnimationFrame(frame); frame = 0; }
  function tick(): void {
    x += (targetX - x) * .075; y += (targetY - y) * .075;
    tilt!.style.transform = `rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .005) frame = requestAnimationFrame(tick); else frame = 0;
  }
  function sync(): void {
    const active = visible && !document.hidden && !reduced.matches;
    scene!.dataset.active = String(active);
    if (!active || !desktop.matches) { stop(); targetX = targetY = x = y = 0; tilt!.style.transform = ''; }
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; sync(); });
  observer.observe(scene);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync); desktop.addEventListener('change', sync);
  scene.addEventListener('pointermove', e => {
    if (!desktop.matches || reduced.matches || document.hidden) return;
    const rect = scene.getBoundingClientRect();
    targetX = -(e.clientY - rect.top - rect.height / 2) / 105;
    targetY = (e.clientX - rect.left - rect.width / 2) / 105;
    if (!frame) frame = requestAnimationFrame(tick);
  });
  scene.addEventListener('pointerleave', () => { targetX = targetY = 0; if (!frame && visible && !reduced.matches && desktop.matches) frame = requestAnimationFrame(tick); });
  sync();
}
