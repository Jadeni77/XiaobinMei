/**
 * Shared CDP harness for the browser verification scripts.
 *
 * Extracted because ~45 lines were duplicated byte-for-byte between
 * verify-journey.mjs and verify-experience.mjs, so fixing a bug in one left it
 * live in the other.
 *
 * Real wall-clock timing throughout: GSAP's requestAnimationFrame ticker does
 * NOT advance under Chrome's --virtual-time-budget, which silently freezes
 * animations a few frames in and reports false failures.
 */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function connect({ port = process.env.CDP_PORT ?? "9222" } = {}) {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  if (!page) {
    throw new Error(
      `No page target on CDP port ${port}. Is headless Chrome running with --remote-debugging-port=${port}?`
    );
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("Could not open the CDP WebSocket"));
  });

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

  /**
   * Evaluate in the page. Throws on a page-side exception rather than
   * returning undefined — silently swallowing exceptionDetails meant a failing
   * expression produced `undefined`, and the NEXT line then threw an unrelated
   * TypeError that named neither the check nor the cause, aborting the run
   * before any summary printed.
   */
  const evaluate = async (expression) => {
    const reply = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    const details = reply.result?.exceptionDetails;
    if (details) {
      const text = details.exception?.description ?? details.text ?? "unknown error";
      throw new Error(`page-side evaluate failed: ${text}`);
    }
    return reply.result?.result?.value;
  };

  const results = [];
  const check = (name, pass, detail) => {
    results.push({ name, pass });
    console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  };

  /**
   * Runs a group of checks, converting a thrown error into a single FAIL so one
   * broken assumption cannot hide every check after it.
   */
  const guard = async (label, fn) => {
    try {
      await fn();
    } catch (error) {
      check(`${label} (aborted)`, false, error.message);
    }
  };

  const finish = () => {
    const failed = results.filter((r) => !r.pass);
    console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
    ws.close();
    return failed.length === 0;
  };

  return { send, evaluate, check, guard, finish, results };
}
