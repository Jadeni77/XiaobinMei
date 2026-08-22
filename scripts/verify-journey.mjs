/**
 * Browser checks for the Journey carousel, per the design spec's section 15.
 *
 * Usage:
 *   npm run dev
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
 *     --remote-debugging-port=9222 --user-data-dir=/tmp/journey-verify about:blank &
 *   CDP_PORT=9222 APP_URL=http://localhost:5173/ node scripts/verify-journey.mjs
 *
 * Uses real wall-clock timing over CDP. GSAP's requestAnimationFrame ticker
 * does NOT advance under Chrome's --virtual-time-budget, which silently freezes
 * animations a few frames in and produces false failures.
 */
import { connect, sleep } from "./cdp.mjs";

const APP = process.env.APP_URL ?? "http://localhost:5173/";
const { send, evaluate, check, guard, finish } = await connect();

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

/*
 * 0. The hero name must actually cycle. It silently froze on heroNames[0] for
 *    weeks: SplitText.revert() restored the innerHTML captured at split time,
 *    overwriting the name React had just committed. Nothing caught it because
 *    heroNames[0] === site.name, so the heading always looked plausible.
 */
const seen = new Set();
for (let i = 0; i < 10; i += 1) {
  seen.add(await evaluate(`document.querySelector('.hero-name')?.textContent.trim()`));
  await sleep(1200);
}
check("hero name cycles through every spelling", seen.size >= 3,
  `saw ${seen.size}: ${[...seen].join(", ")}`);

await evaluate(`document.getElementById('journey').scrollIntoView()`);
await sleep(1200);

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

/*
 * 5. Advancing draws the curve, moves the accent, and pans the trajectory.
 *
 * Re-navigate first: section 4's wheel test intentionally moves the index, and
 * the milestone count is read from the DOM rather than hardcoded, so adding a
 * milestone to journey.js cannot silently invalidate this.
 */
await send("Page.navigate", { url: APP });
await sleep(2600);
await evaluate(`document.documentElement.style.scrollBehavior='auto';
  document.getElementById('journey').scrollIntoView()`);
await sleep(1200);

const milestoneCount = await evaluate(
  `document.querySelectorAll('.journey-pips button').length`
);
const startAccent = await evaluate(
  `getComputedStyle(document.querySelector('.journey')).getPropertyValue('--journey-accent').trim()`
);
await evaluate(
  `document.querySelectorAll('.journey-pips button')[${milestoneCount - 1}].click()`
);
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
  `drawn ${advanced.drawn} at milestone ${milestoneCount} of ${milestoneCount}`);
check("accent changes per milestone", advanced.accent !== startAccent,
  `${startAccent} -> ${advanced.accent}`);
check("trajectory pans to centre the active point", /translateX/.test(advanced.pan),
  advanced.pan);
check("pip click selects the last milestone",
  advanced.activeIndex === milestoneCount - 1,
  `index ${advanced.activeIndex} of ${milestoneCount}`);

/*
 * 5b. The drag preview must travel WITH the pointer. The distance calculation
 *     had its sign flipped, so cards slid the opposite way and then jumped
 *     backwards on release. Unit tests only covered the committed index.
 */
await evaluate(`document.querySelectorAll('.journey-pips button')[2].click()`);
await sleep(1300);
const stageMid = await evaluate(`(() => {
  const r = document.querySelector('.journey-stage').getBoundingClientRect();
  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + 40) };
})()`);
const cardX = () =>
  evaluate(`Number(document.querySelector('.journey-card.is-active')
    .style.transform.match(/translate3d\\(([-0-9.]+)px/)?.[1] ?? 0)`);

await send("Input.dispatchMouseEvent", { type: "mousePressed", x: stageMid.x, y: stageMid.y, button: "left", clickCount: 1 });
await sleep(140);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: stageMid.x - 60, y: stageMid.y, button: "left" });
await sleep(140);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: stageMid.x - 140, y: stageMid.y, button: "left" });
await sleep(160);
const draggedX = await cardX();
await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: stageMid.x - 140, y: stageMid.y, button: "left", clickCount: 1 });
await sleep(1200);
check("drag preview follows the pointer", draggedX < 0,
  `pointer moved left, card translateX ${draggedX}px`);

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

// 8. Photo autoplay. Section 7 left prefers-reduced-motion emulated, which is
//    a free assertion that autoplay stays off under it — check that, then
//    clear the override before testing the motion-enabled behaviour.
const reducedPhotoBefore = await evaluate(`(() => {
  const c = document.querySelector('.journey-card.is-active');
  return [...c.querySelectorAll('.journey-thumbs button')]
    .findIndex(b => b.classList.contains('is-on'));
})()`);
await sleep(3600);
const reducedPhotoAfter = await evaluate(`(() => {
  const c = document.querySelector('.journey-card.is-active');
  return [...c.querySelectorAll('.journey-thumbs button')]
    .findIndex(b => b.classList.contains('is-on'));
})()`);
check("reduced motion suppresses photo autoplay",
  reducedPhotoAfter === reducedPhotoBefore, `held on ${reducedPhotoBefore}`);

await send("Emulation.setEmulatedMedia", { features: [] });
await send("Page.navigate", { url: APP });
await sleep(3000);
await evaluate(`document.documentElement.style.scrollBehavior='auto';
  document.getElementById('journey').scrollIntoView()`);
await sleep(1200);
await evaluate(`document.querySelectorAll('.journey-pips button')[0].click()`);
await sleep(1200);
// Park the pointer off the cards, or hover-pause suppresses the autoplay.
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
const activePhoto = () =>
  evaluate(`(() => {
    const c = document.querySelector('.journey-card.is-active');
    return [...c.querySelectorAll('.journey-thumbs button')]
      .findIndex(b => b.classList.contains('is-on'));
  })()`);

/*
 * Poll rather than sleep a fixed interval: the hold is PHOTO_HOLD_MS in
 * JourneyCard.jsx and tuning it should not break this check.
 */
const waitForPhotoChange = async (from, budgetMs = 9000) => {
  for (let waited = 0; waited < budgetMs; waited += 250) {
    await sleep(250);
    const now = await activePhoto();
    if (now !== from) return now;
  }
  return from;
};

const photoBefore = await activePhoto();
const photoAfter = await waitForPhotoChange(photoBefore);
check("centre deck auto-advances", photoAfter !== photoBefore,
  `photo ${photoBefore} -> ${photoAfter}`);

const offCentre = await evaluate(`(() => [...document.querySelectorAll('.journey-card:not(.is-active)')]
  .map(c => [...c.querySelectorAll('.journey-thumbs button')]
    .findIndex(b => b.classList.contains('is-on'))))()`);
check("off-centre decks do not cycle", offCentre.every((v) => v === 0),
  `indices ${offCentre.join(",")}`);

await evaluate(`document.querySelector('.journey-card.is-active .journey-thumbs button').click()`);
await sleep(300);
const pinned = await activePhoto();
// Fixed wait, and it must exceed PHOTO_HOLD_MS to prove nothing moved.
await sleep(5000);
check("clicking a thumbnail pins that deck", (await activePhoto()) === pinned,
  `held on ${pinned} for 5s`);

await evaluate(`document.querySelectorAll('.journey-pips button')[1].click()`);
await sleep(1200);
const otherBefore = await activePhoto();
check("other decks keep autoplaying",
  (await waitForPhotoChange(otherBefore)) !== otherBefore,
  "unaffected by the pause");

await evaluate(`document.querySelectorAll('.journey-pips button')[0].click()`);
await sleep(1200);
const returned = await activePhoto();
await sleep(5000);
check("pause is remembered per deck", (await activePhoto()) === returned,
  `still held on ${returned} for 5s`);

// 9. Phone: real touch emulation. A synthetic swipe caught a bug that mouse
//    testing and the unit tests both missed, so these checks stay permanent.
await send("Emulation.setDeviceMetricsOverride", {
  width: 390, height: 844, deviceScaleFactor: 3, mobile: true,
});
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Page.navigate", { url: APP });
await sleep(3200);
await evaluate(`document.documentElement.style.scrollBehavior='auto';
  document.getElementById('journey').scrollIntoView()`);
await sleep(1300);

const phone = await evaluate(`(() => {
  const stage = document.querySelector('.journey-stage');
  const card = document.querySelector('.journey-card.is-active');
  const box = card.querySelector('.journey-photo-main');
  const cr = card.getBoundingClientRect(), br = box.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  return {
    cardFitsStage: cr.bottom <= sr.bottom + 1,
    photoRatio: +(br.width / br.height).toFixed(2),
    neighboursHidden: [...document.querySelectorAll('.journey-card:not(.is-active)')]
      .every(c => Number(getComputedStyle(c).opacity) === 0),
    touchAction: getComputedStyle(stage).touchAction,
  };
})()`);
check("phone: card fits inside the stage", phone.cardFitsStage);
check("phone: photo is not letterboxed", phone.photoRatio < 1.8, `${phone.photoRatio}:1`);
check("phone: one card at a time", phone.neighboursHidden);
check("phone: touch-action leaves vertical scroll to the page",
  phone.touchAction === "pan-y", phone.touchAction);

const swipeY = await evaluate(`(() => {
  const r = document.querySelector('.journey-stage').getBoundingClientRect();
  return Math.round(r.top + r.height * 0.25);
})()`);
const indexNow = () =>
  evaluate(`[...document.querySelectorAll('.journey-card')]
    .findIndex(c => c.classList.contains('is-active'))`);
const touch = (type, x) =>
  send("Input.dispatchTouchEvent", {
    type,
    touchPoints: type === "touchEnd" ? [] : [{ x, y: swipeY, id: 1 }],
  });

const beforeSwipe = await indexNow();
await touch("touchStart", 300);
for (const x of [270, 230, 190, 150, 120]) {
  await touch("touchMove", x);
  await sleep(45);
}
await touch("touchEnd", 120);
await sleep(1300);
const afterSwipe = await indexNow();
check("phone: touch swipe advances the carousel", afterSwipe === beforeSwipe + 1,
  `index ${beforeSwipe} -> ${afterSwipe}`);

const scrollBefore = await evaluate(`window.scrollY`);
await touch("touchStart", 200);
for (const step of [1, 2, 3, 4]) {
  await send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 200, y: swipeY - step * 40, id: 1 }],
  });
  await sleep(45);
}
await touch("touchEnd", 200);
await sleep(900);
const scrollAfter = await evaluate(`window.scrollY`);
check("phone: vertical touch still scrolls the page", scrollAfter !== scrollBefore,
  `scrollY ${Math.round(scrollBefore)} -> ${Math.round(scrollAfter)}`);

process.exit(finish() ? 0 : 1);
