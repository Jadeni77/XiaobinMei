/**
 * Browser checks for the Experience timeline's show-more behaviour.
 *
 * Usage:
 *   npm run dev
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
 *     --remote-debugging-port=9222 --user-data-dir=/tmp/exp-verify about:blank &
 *   CDP_PORT=9222 APP_URL=http://localhost:5173/XiaobinMei/ node scripts/verify-experience.mjs
 *
 * Real wall-clock timing over CDP: GSAP's rAF ticker does not advance under
 * Chrome's --virtual-time-budget.
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
    // offsetHeight, not getBoundingClientRect: the rail carries a scaleY
    // transform, so a rect-based measurement reports scrub progress, not layout.
    timelineHeight: document.querySelector('.timeline').offsetHeight,
  };
})()`);
check("collapsed shows only two roles", collapsed.items === 2, `${collapsed.items} items`);
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
check("expanded reveals every role", expanded.items === 6, `${expanded.items} items`);
check("button flips to collapse", /fewer/.test(expanded.label ?? ""), expanded.label);
check("button reports expanded state", expanded.expanded === "true");
check("timeline layout actually grew",
  expanded.timelineHeight > collapsed.timelineHeight * 1.8,
  `${collapsed.timelineHeight}px -> ${expanded.timelineHeight}px`);
check("no revealed card left invisible", expanded.minCardOpacity > 0.9,
  `min opacity ${expanded.minCardOpacity}`);
check("every role keeps its highlight disclosure", expanded.detailsCount === 6,
  `${expanded.detailsCount} disclosures`);

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

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
ws.close();
process.exit(failed.length ? 1 : 0);
