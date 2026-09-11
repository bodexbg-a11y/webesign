#!/usr/bin/env bash
# Re-download the self-hosted webfonts from Google Fonts.
# Only the latin and latin-ext subsets are kept; unicode-range means the
# browser fetches latin-ext only when a page actually uses those glyphs.
set -euo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
URL="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
curl -sS -A "$UA" "$URL" -o /tmp/gf.css
python3 - <<'PY'
import re, os, subprocess
css = open('/tmp/gf.css').read()
blocks = re.findall(r'/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})', css, re.S)
os.makedirs('assets/fonts', exist_ok=True)
out = ["/* Self-hosted subset of Instrument Serif, Inter Tight and JetBrains Mono.",
       "   Regenerate with scripts/build-fonts.sh. */", ""]
for sub, block in blocks:
    if sub not in ('latin', 'latin-ext'):
        continue
    url = re.search(r'url\((https://[^)]+)\)', block).group(1)
    fam = re.search(r"font-family: '([^']+)'", block).group(1)
    weight = re.search(r'font-weight: (\d+)', block).group(1)
    style = re.search(r'font-style: (\w+)', block).group(1)
    name = f"{fam.lower().replace(' ', '-')}-{weight}{'-italic' if style=='italic' else ''}-{sub}.woff2"
    if not os.path.exists(f'assets/fonts/{name}'):
        subprocess.run(['curl', '-sS', '-o', f'assets/fonts/{name}', url], check=True)
    out += [block.replace(url, f'../fonts/{name}'), ""]
open('assets/css/fonts.css', 'w').write("\n".join(out))
print(len([b for s_, b in blocks if s_ in ('latin','latin-ext')]), "faces written")
PY
