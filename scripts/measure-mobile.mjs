// Node 24 + installed Chrome; no npm dependencies. Measures built docs/, not dev mode.
// node scripts/measure-mobile.mjs <built-site-directory> <report.json> [runs]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import zlib from 'node:zlib';
import { spawn } from 'node:child_process';

const root = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
const runs = Number(process.argv[4] || 3);
const settings = { width: 390, height: 844, cpuSlowdown: 4, latencyMs: 150, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 75000, observationMs: 12000 };
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'foldora-perf-chrome-'));
const chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless', '--disable-gpu', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
const files = new Map();
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  if (!files.has(file)) files.set(file, fs.readFileSync(file));
  let body = files.get(file);
  const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' }[path.extname(file)] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'no-store');
  if (/^text\//.test(type) || type === 'image/svg+xml') { body = zlib.gzipSync(body); res.setHeader('Content-Encoding', 'gzip'); }
  else if (req.headers.range) {
    const [, start, end] = req.headers.range.match(/bytes=(\d+)-(\d*)/) || [];
    if (start !== undefined) { const a = Number(start), b = end ? Number(end) : body.length - 1; res.writeHead(206, { 'Content-Range': `bytes ${a}-${b}/${body.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 }); res.end(body.subarray(a, b + 1)); return; }
  }
  res.setHeader('Content-Length', body.length); res.end(body);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function connect(url) {
  const ws = new WebSocket(url); await new Promise((r, reject) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let id = 0; const pending = new Map();
  ws.addEventListener('message', e => { const d = JSON.parse(e.data); if (pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); clearTimeout(p.timer); d.error ? p.reject(Error(JSON.stringify(d.error))) : p.resolve(d.result); } });
  return { ws, send: (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; const timer = setTimeout(() => { pending.delete(n); reject(Error('CDP timeout: ' + method)); }, 20000); pending.set(n, { resolve, reject, timer }); ws.send(JSON.stringify({ id: n, method, params })); }) };
}
const instrumentation = `(() => {
  window.__perf = {lcp: [], shifts: [], tasks: [], transitions: []};
  new PerformanceObserver(l => l.getEntries().forEach(e => __perf.lcp.push({time:e.startTime, tag:e.element?.tagName, text:e.element?.textContent?.slice(0,100), url:e.url}))).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(l => l.getEntries().forEach(e => {if(!e.hadRecentInput)__perf.shifts.push({time:e.startTime,value:e.value})})).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l => l.getEntries().forEach(e => __perf.tasks.push({time:e.startTime,duration:e.duration}))).observe({type:'longtask',buffered:true});
  let previous=''; setInterval(() => {
    const h=document.querySelector('h1'); const rect=h?.getBoundingClientRect();
    const state=JSON.stringify({heading:!!rect&&rect.width>0&&rect.height>0,cta:!![...document.querySelectorAll('a[data-foldora-checkout]')].find(e=>e.getBoundingClientRect().height>0)});
    if(state!==previous){__perf.transitions.push({time:performance.now(),...JSON.parse(state)});previous=state;}
  },50);
})();`;
let active;
let browserDebugUrl;
try {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; !fs.existsSync(portFile) && i < 150; i++) await sleep(100);
  const debugPort = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const debug = 'http://127.0.0.1:' + debugPort;
  const base = 'http://127.0.0.1:' + server.address().port;
  const version = await (await fetch(debug + '/json/version')).json();
  browserDebugUrl = version.webSocketDebuggerUrl;
  const results = [];
  for (const route of ['/', '/ai-file-organizer/']) for (let run = 1; run <= runs; run++) {
    const target = await (await fetch(debug + '/json/new?about:blank', { method: 'PUT' })).json();
    active = await connect(target.webSocketDebuggerUrl); const send = active.send;
    await send('Page.enable'); await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Network.setBlockedURLs', { urls: ['*google-analytics.com*', '*googletagmanager.com*', '*tawk.to*'] });
    await send('Emulation.setDeviceMetricsOverride', { width: settings.width, height: settings.height, deviceScaleFactor: 1, mobile: true });
    await send('Emulation.setCPUThrottlingRate', { rate: settings.cpuSlowdown });
    await send('Network.emulateNetworkConditions', { offline: false, latency: settings.latencyMs, downloadThroughput: settings.downloadBytesPerSecond, uploadThroughput: settings.uploadBytesPerSecond, connectionType: 'cellular4g' });
    await send('Storage.clearDataForOrigin', { origin: base, storageTypes: 'all' });
    await send('Page.addScriptToEvaluateOnNewDocument', { source: instrumentation });
    await send('Page.navigate', { url: base + route }); await sleep(settings.observationMs);
    const evaluate = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true }); if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
    const data = await evaluate(`({...__perf, paints:performance.getEntriesByType('paint').map(e=>({name:e.name,time:e.startTime})), resources:performance.getEntriesByType('resource').map(e=>({name:e.name.replace(location.origin,''),type:e.initiatorType,start:e.startTime,end:e.responseEnd,transfer:e.transferSize})), heading:document.querySelector('h1')?.textContent, overflow:document.documentElement.scrollWidth>innerWidth, consent:window.FoldoraPrivacy?.getState(), nav:performance.getEntriesByType('navigation').map(e=>({domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd}))})`);
    data.route = route; data.run = run; data.fcpMs = data.paints.find(e => e.name === 'first-contentful-paint')?.time;
    data.lcpMs = data.lcp.at(-1)?.time; data.observedBlockingMs = data.tasks.reduce((a, e) => a + Math.max(0, e.duration - 50), 0);
    const gaps = data.transitions.filter((t, i) => i && !t.heading).map(t => ({start:t.time,end:data.transitions.find(x=>x.time>t.time&&x.heading)?.time||settings.observationMs}));
    data.headingBlankMs = gaps.reduce((a, g) => a + g.end - g.start, 0);
    data.localJsTransferBytes = data.resources.filter(e => e.name.endsWith('.js')).reduce((a,e)=>a+e.transfer,0);
    // Same-page pricing navigation only: never open checkout or generate an order.
    if (route === '/') data.pricing = await evaluate(`(()=>{const a=[...document.querySelectorAll('nav a')].find(e=>e.hash==='#pricing');if(!a)return {found:false};a.click();return {found:true,hash:location.hash,targetExists:!!document.getElementById('pricing')||!!document.getElementById('download'),checkoutHref:document.querySelector('#download a[data-foldora-checkout]')?.href}})()`);
    results.push(data);
    console.log(JSON.stringify({route,run,fcpMs:data.fcpMs,lcpMs:data.lcpMs,headingBlankMs:data.headingBlankMs,observedBlockingMs:data.observedBlockingMs,jsBytes:data.localJsTransferBytes,overflow:data.overflow}));
    active.ws.close(); active = undefined; await fetch(debug + '/json/close/' + target.id);
  }
  fs.mkdirSync(path.dirname(output), {recursive:true}); fs.writeFileSync(output, JSON.stringify({settings,browser:version.Browser,root,results}, null, 2));
  console.log('Report: ' + output);
} finally {
  if (active) active.ws.close();
  if (browserDebugUrl) {
    try {
      const browser = await connect(browserDebugUrl);
      await browser.send('Browser.close');
      browser.ws.close();
    } catch { /* The isolated test browser may already have exited. */ }
  }
  chrome.kill();
  server.close();
}
