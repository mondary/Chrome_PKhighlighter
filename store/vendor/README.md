# Local animation libraries

- GSAP **3.15.0** and ScrollTrigger **3.15.0**: [GSAP standard licence](https://gsap.com/standard-license/).
  Original copyright and licence notices are retained in the distributed files.
  The npm package does not include a separate LICENSE file.
- Three.js **0.180.0**: MIT, see `THREE-LICENSE.txt`.

Exact download URLs and SHA-256 checksums live in `sources.json`.
Refresh explicitly with `python3 store/media-kit/prepare.py --vendor`.
The landing makes no runtime CDN requests. Libraries are only used by the promotional site,
never injected by the Chrome extension.
