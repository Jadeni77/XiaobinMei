/**
 * Browser checks for the Experience timeline's show-more behaviour.
 *
 * Usage:
 *   npm run dev
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
 *     --remote-debugging-port=9222 --user-data-dir=/tmp/exp-verify about:blank &
 *   CDP_PORT=9222 APP_URL=http://localhost:5173/ node scripts/verify-experience.mjs
 *
 * Real wall-clock timing over CDP: GSAP's rAF ticker does not advance under
 * Chrome's --virtual-time-budget.
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
  document.getElementById('experience').scrollIntoView()`);
await sleep(1300);

const collapsed = await evaluate(`(() => {
  const btn = document.querySelector('.timeline-more button');
  return {
    items: document.querySelectorAll('.timeline-item').length,
    label: btn?.textContent.trim(),
    expanded: btn?.getAttribute('aria-expanded'),
    controls: btn?.getAttribute('aria-controls'),
    firstDetailsOpen: !!document.querySelector('.timeline-details[open]'),
    // "Show 4 more roles" -> 4, so the expected total is derived, not assumed.
    hiddenCount: Number((btn?.textContent.match(/(\\d+) more role/) ?? [])[1] ?? 0),
    // offsetHeight, not getBoundingClientRect: the rail carries a scaleY
    // transform, so a rect-based measurement reports scrub progress, not layout.
    timelineHeight: document.querySelector('.timeline').offsetHeight,
  };
})()`);
check("collapsed renders two full roles plus a peek", collapsed.items === 3,
  `${collapsed.items} items`);

// The peek exists to hint the list continues, so it must be clipped, faded,
// and unreachable — a half-visible card must never take focus.
const peek = await evaluate(`(() => {
  const el = document.querySelector('.timeline-item.is-peek');
  if (!el) return null;
  const full = document.querySelector('.timeline-item:not(.is-peek)');
  const cs = getComputedStyle(el);
  return {
    height: Math.round(el.getBoundingClientRect().height),
    fullHeight: Math.round(full.getBoundingClientRect().height),
    masked: (cs.maskImage || cs.webkitMaskImage || "none") !== "none",
    inert: el.hasAttribute('inert'),
    ariaHidden: el.getAttribute('aria-hidden'),
    focusables: el.querySelectorAll('button, a, summary, [tabindex]').length,
  };
})()`);
check("peek row exists", peek !== null);

/*
 * Everything below dereferences `peek`. Guarding means a missing peek row
 * reports one FAIL instead of throwing a TypeError that aborts the script and
 * hides every remaining check.
 */
if (peek) {
  check("peek is clipped well below a full row", peek.height < peek.fullHeight * 0.6,
    `${peek.height}px vs ${peek.fullHeight}px`);
  check("peek fades out", peek.masked);
  check("peek is inert and hidden from assistive tech",
    peek.inert === true && peek.ariaHidden === "true");
} else {
  check("peek is clipped well below a full row", false, "no peek row to measure");
  check("peek fades out", false, "no peek row to measure");
  check("peek is inert and hidden from assistive tech", false, "no peek row to measure");
}

// Prove inert actually removes it from the tab order rather than just being set.
const tabLandsInPeek = await evaluate(`(() => {
  const peekEl = document.querySelector('.timeline-item.is-peek');
  if (!peekEl) return null;
  const focusable = peekEl.querySelector('button, a, summary, [tabindex]');
  if (!focusable) return false;
  focusable.focus();
  return peekEl.contains(document.activeElement);
})()`);
check("focus cannot enter the peek", tabLandsInPeek === false,
  peek ? `${peek.focusables} focusable node(s) inside, all unreachable` : "no peek row");
check("button names the remaining count", /more role/.test(collapsed.label ?? ""),
  collapsed.label);
check("button reports collapsed state", collapsed.expanded === "false");
check("button points at the list it controls",
  collapsed.controls === "experience-timeline", collapsed.controls);
check("highlight disclosure still works", collapsed.firstDetailsOpen);

await evaluate(`document.querySelector('.timeline-more button').click()`);
await sleep(1600);
const expanded = await evaluate(`(() => {
  const btn = document.querySelector('.timeline-more button');
  return {
    items: document.querySelectorAll('.timeline-item').length,
    label: btn?.textContent.trim(),
    expanded: btn?.getAttribute('aria-expanded'),
    timelineHeight: document.querySelector('.timeline').offsetHeight,
    minCardOpacity: Math.min(...[...document.querySelectorAll('.timeline-card')]
      .map(c => Number(getComputedStyle(c).opacity))),
    detailsCount: document.querySelectorAll('.timeline-details').length,
  };
})()`);
/*
 * Counts come from the button label, not a hardcoded 6. verify-journey.mjs was
 * made count-agnostic in 838fa4c after a sixth milestone broke it; this script
 * never got the same treatment and would fail on any experience.js edit.
 */
const expectedRoles = collapsed.hiddenCount + 2; // two shown in full + the rest
check("expanded reveals every role", expanded.items === expectedRoles,
  `${expanded.items} of an expected ${expectedRoles}`);
check("button flips to collapse", /fewer/.test(expanded.label ?? ""), expanded.label);
check("button reports expanded state", expanded.expanded === "true");
check("timeline layout actually grew",
  expanded.timelineHeight > collapsed.timelineHeight * 1.8,
  `${collapsed.timelineHeight}px -> ${expanded.timelineHeight}px`);
check("no revealed card left invisible", expanded.minCardOpacity > 0.9,
  `min opacity ${expanded.minCardOpacity}`);
check("every role keeps its highlight disclosure",
  expanded.detailsCount === expectedRoles,
  `${expanded.detailsCount} disclosures for ${expectedRoles} roles`);
check("expanding removes the peek treatment",
  (await evaluate(`document.querySelectorAll('.timeline-item.is-peek').length`)) === 0);
check("no expanded row is inert",
  (await evaluate(`document.querySelectorAll('.timeline-item[inert]').length`)) === 0);

/*
 * The real test of ScrollTrigger.refresh(): walk to the end of the longer list
 * and confirm the newly revealed dots light and the rail scrubs to full. Without
 * the refresh these measure against the collapsed geometry and never fire.
 */
const bottom = await evaluate(`(() => {
  const t = document.querySelector('.timeline');
  return Math.round(window.scrollY + t.getBoundingClientRect().bottom);
})()`);
for (let y = await evaluate(`window.scrollY`); y < bottom + 300; y += 250) {
  await evaluate(`window.scrollTo(0,${y})`);
  await sleep(160);
}
await sleep(1200);
const scrubbed = await evaluate(`(() => ({
  total: document.querySelectorAll('.timeline-item').length,
  lit: document.querySelectorAll('.timeline-item.is-reached').length,
  railScaleY: +new DOMMatrixReadOnly(
    getComputedStyle(document.querySelector('.timeline-rail')).transform).d.toFixed(2),
}))()`);
check("every revealed dot lights up", scrubbed.lit === scrubbed.total,
  `${scrubbed.lit}/${scrubbed.total}`);
check("rail scrubs to full over the expanded list", scrubbed.railScaleY > 0.95,
  `scaleY ${scrubbed.railScaleY}`);

process.exit(finish() ? 0 : 1);
