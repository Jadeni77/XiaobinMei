/**
 * Browser checks for the Journey carousel, per the design spec's section 15.
 *
 * Usage:
 *   npm run dev
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
 *     --remote-debugging-port=9222 --user-data-dir=/tmp/journey-verify about:blank &
 *   CDP_PORT=9222 APP_URL=http://localhost:5173/XiaobinMei/ node scripts/verify-journey.mjs
 *
 * Uses real wall-clock timing over CDP. GSAP's requestAnimationFrame ticker
 * does NOT advance under Chrome's --virtual-time-budget, which silently freezes
 * animations a few frames in and produces false failures.
 */
const PORT = process.env.CDP_PORT ?? "9222";
const APP = process.env.APP_URL ?? "http://localhost:5173/XiaobinMei/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => (ws.onopen = resolve));

let seq = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++seq;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }))
    .result?.result?.value;

const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1280, height: 900, deviceScaleFactor: 1, mobile: false,
});
await send("Page.navigate", { url: APP });
await sleep(3000);
await evaluate(`document.documentElement.style.scrollBehavior='auto';
  document.getElementById('journey').scrollIntoView()`);
await sleep(1500);

// 1. Plotted points are circles, not ellipses (the stretched-viewBox regression).
const round = await evaluate(`(() => {
  const r = document.querySelector('.journey-point').getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
})()`);
check("plotted points are round", Math.abs(round.w - round.h) <= 1, `${round.w}x${round.h}`);

// 2. Tab order never enters a non-active card.
const inert = await evaluate(`(() => {
  const cards = [...document.querySelectorAll('.journey-card')];
  const bad = cards.filter(c => !c.classList.contains('is-active') && !c.hasAttribute('inert'));
  return { total: cards.length, missing: bad.length };
})()`);
check("non-active cards are inert", inert.missing === 0,
  `${inert.total - 1 - inert.missing}/${inert.total - 1}`);

// 3. Card content actually finished animating in (the from-vs-fromTo trap).
const content = await evaluate(`(() => {
  const card = document.querySelector('.journey-card.is-active');
  const vis = (sel) => {
    const el = card.querySelector(sel);
    return el ? Number(getComputedStyle(el).opacity) : -1;
  };
  const thumbs = [...card.querySelectorAll('.journey-thumbs button')]
    .map(b => Number(getComputedStyle(b).opacity));
  return { year: vis('.journey-card-year'), story: vis('.journey-card-story'), thumbs };
})()`);
check("year is visible", content.year > 0.95, String(content.year));
check("story is visible", content.story > 0.95, String(content.story));
check("thumbnails are visible", content.thumbs.every((o) => o > 0.4),
  content.thumbs.join(", "));

// 4. The stage claims horizontal wheel but never vertical, so page scrolling
//    is not trapped. defaultPrevented is read off the real dispatched event.
const wheel = await evaluate(`(() => {
  const stage = document.querySelector('.journey-stage');
  const r = stage.getBoundingClientRect();
  const at = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
  const fire = (deltaX, deltaY) => {
    const ev = new WheelEvent('wheel', { deltaX, deltaY, bubbles: true, cancelable: true, ...at });
    stage.dispatchEvent(ev);
    return ev.defaultPrevented;
  };
  return { vertical: fire(0, 120), horizontal: fire(120, 0) };
})()`);
check("vertical wheel passes through to the page", wheel.vertical === false);
check("horizontal wheel is claimed by the carousel", wheel.horizontal === true);

// 5. Advancing draws the curve, moves the accent, and pans the trajectory.
const startAccent = await evaluate(
  `getComputedStyle(document.querySelector('.journey')).getPropertyValue('--journey-accent').trim()`
);
await evaluate(`document.querySelectorAll('.journey-pips button')[4].click()`);
await sleep(1600);
const advanced = await evaluate(`(() => {
  const curve = document.querySelector('.journey-curve');
  const L = curve.getTotalLength();
  const offset = parseFloat(getComputedStyle(curve).strokeDashoffset);
  return {
    drawn: +(1 - offset / L).toFixed(2),
    accent: getComputedStyle(document.querySelector('.journey')).getPropertyValue('--journey-accent').trim(),
    pan: document.querySelector('.journey-pan').style.transform,
    activeIndex: [...document.querySelectorAll('.journey-card')]
      .findIndex(c => c.classList.contains('is-active')),
  };
})()`);
check("curve draws to the end at the last milestone", advanced.drawn > 0.95,
  `drawn ${advanced.drawn}`);
check("accent changes per milestone", advanced.accent !== startAccent,
  `${startAccent} -> ${advanced.accent}`);
check("trajectory pans to centre the active point", /translateX/.test(advanced.pan),
  advanced.pan);
check("pip click selects the last milestone", advanced.activeIndex === 4,
  `index ${advanced.activeIndex}`);

// 6. No horizontal overflow at any breakpoint.
for (const width of [390, 768, 1024, 1440]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await sleep(800);
  const overflow = await evaluate(`document.documentElement.scrollWidth - window.innerWidth`);
  check(`no horizontal overflow at ${width}px`, overflow <= 0, `${overflow}px`);
}

// 7. Reduced motion keeps the carousel operable with no animation applied.
await send("Emulation.setDeviceMetricsOverride", {
  width: 1280, height: 900, deviceScaleFactor: 1, mobile: false,
});
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});
await send("Page.navigate", { url: APP });
await sleep(2800);
await evaluate(`document.getElementById('journey').scrollIntoView()`);
await sleep(1000);
const reduced = await evaluate(`(() => {
  const card = document.querySelector('.journey-card.is-active');
  const title = card.querySelector('.journey-card-title');
  return {
    splitDivs: title.querySelectorAll('div').length,
    titleOpacity: getComputedStyle(title).opacity,
    storyOpacity: getComputedStyle(card.querySelector('.journey-card-story')).opacity,
    navButtons: document.querySelectorAll('.journey-nav').length,
  };
})()`);
check("reduced motion skips SplitText", reduced.splitDivs === 0, `${reduced.splitDivs} divs`);
check("reduced motion leaves title visible", reduced.titleOpacity === "1");
check("reduced motion leaves story visible", reduced.storyOpacity === "1");
check("reduced motion keeps both nav controls", reduced.navButtons === 2);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
ws.close();
process.exit(failed.length ? 1 : 0);
