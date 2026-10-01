import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const store = fileURLToPath(new URL('../', import.meta.url));

export async function verify({taskSpace, spaceId = 26, base = 'http://127.0.0.1:4176', out = '/var/folders/jb/07k9zyks6_d60c27tclhjd2h0000gn/T/opencode/pkh-qa'}) {
  await mkdir(out,{recursive:true});
  const task = await taskSpace(spaceId);
  const page = task.page('p1');
  const manifest = JSON.parse(await readFile(store + '../src/manifest.json','utf8'));
  assert.match(manifest.version,/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,3}$/);
  assert.ok(manifest.version.split('.').every(n => +n <= 65535));
  assert.equal(manifest.version_name.split('.').map(Number).join('.'),manifest.version);
  const script = await page.cdp('Page.addScriptToEvaluateOnNewDocument',{source:`window.__errors=[];window.__metrics={};addEventListener('error',e=>__errors.push(e.message||e.target?.src),true);addEventListener('unhandledrejection',e=>__errors.push(String(e.reason)));new PerformanceObserver(l=>{for(const e of l.getEntries())__metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)__metrics.cls=(__metrics.cls||0)+e.value}).observe({type:'layout-shift',buffered:true});`});
  const results = [];
  try {
    for (const width of [390,768,1440,1920]) {
      await page.cdp('Emulation.setDeviceMetricsOverride',{width,height:width<768?844:1000,deviceScaleFactor:1,mobile:width<768});
      for (const lang of ['fr','en']) {
        await page.goto(base + '/store/website/');
        await page.click(`[data-lang="${lang}"]`);
        await page.waitForFunction(()=>!window.gsap||!gsap.isTweening('.hero-copy > *'));
        assert.equal(await page.evaluate(()=>document.documentElement.lang),lang);
        for (const anchor of ['#main','#demo','#styles','.final']) {
          await page.evaluate(s=>document.querySelector(s).scrollIntoView({behavior:'instant'}),anchor);
          await page.waitForFunction(s=>[...document.querySelectorAll(s+' img')].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).every(i=>i.complete&&i.naturalWidth>0),anchor);
          const state = await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,errors:window.__errors}));
          assert.ok(state.scroll <= state.width,`${width}/${lang}/${anchor} overflow`);
          assert.deepEqual(state.errors,[],`${width}/${lang} runtime errors`);
        }
        await page.click('[data-compare="before"]');
        assert.equal(await page.evaluate(()=>document.querySelector('#comparison').dataset.state),'before');
        await page.click('[data-compare="after"]');
        assert.equal(await page.evaluate(()=>document.querySelector('#comparison').dataset.state),'after');
        for (const mode of ['candy','offset','bold','origami','pastel','neon','sticker']) {
          await page.click(`[data-style="${mode}"]`);
          await page.waitForFunction(mode=>{const i=document.querySelector('#style-image');return i.complete&&i.naturalWidth>0&&i.src.endsWith('/'+mode+'.webp')},mode);
          assert.equal(await page.evaluate(()=>document.querySelectorAll('[data-style][aria-pressed="true"]').length),1);
        }
        const safety = await page.evaluate(()=>({empty:[...document.querySelectorAll('a,button')].filter(e=>e.getBoundingClientRect().height>0&&!e.textContent.trim()&&!e.getAttribute('aria-label')).length,unsafe:[...document.querySelectorAll('a[target="_blank"]')].filter(a=>!a.rel.includes('noopener')).length}));
        assert.deepEqual(safety,{empty:0,unsafe:0});
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`${out}/${width}-${lang}-hero.png`});
        results.push({width,lang,...await page.evaluate(()=>({webgl:document.documentElement.dataset.webgl||'not-loaded',metrics:window.__metrics,resourceBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)}))});
      }
    }
    await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await page.reload();
    await page.waitForFunction(()=>document.documentElement.dataset.motion==='off');
    assert.equal(await page.evaluate(()=>document.querySelectorAll('.hero-canvas').length),0);
    await page.cdp('Emulation.setEmulatedMedia',{features:[]});
    // Simulate storage denial and unavailable WebGL on the isolated local test page.
    const fallback = await page.cdp('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}});const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return t.includes('webgl')?null:get.call(this,t,...a)};`});
    try {
      await page.reload();
      await page.click('[data-lang="en"]');
      assert.equal(await page.evaluate(()=>document.documentElement.lang),'en');
      await page.waitForFunction(()=>document.documentElement.dataset.webgl==='unavailable');
      assert.ok(await page.evaluate(()=>document.querySelector('.product-window img').naturalWidth>0));
      assert.deepEqual(await page.evaluate(()=>window.__errors),[]);
    } finally { await page.cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:fallback.identifier}); }
    await page.reload();
    await page.click('[data-lang="fr"]');
    await page.click('#motion-toggle');
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.motion),'off');
    await page.click('#motion-toggle');
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.motion),'on');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await writeFile(out+'/results.json',JSON.stringify({checks:'PASS',results,fallBacks:['reduced motion','blocked storage','no WebGL','manual motion control']},null,2)+'\n');
    console.log(JSON.stringify({status:'PASS',checks:'4 viewports × 2 languages, seven styles, before/after, safe links, runtime errors, reduced motion, storage denial, WebGL fallback',results},null,2));
  } finally { await page.cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier}); }
}
