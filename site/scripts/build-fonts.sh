#!/usr/bin/env bash
# Download the self-hosted webfonts. Only latin, latin-ext, cyrillic and
# cyrillic-ext are kept — the site is Bulgarian and English, so Greek,
# Vietnamese and the symbol subsets are dropped. unicode-range means a browser
# fetches the Cyrillic files only on the Bulgarian pages.
set -euo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
URL="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Onest:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap"
curl -sS -A "$UA" "$URL" -o /tmp/gf.css
python3 - <<'PY'
import re, os, subprocess
KEEP = ('latin', 'latin-ext', 'cyrillic', 'cyrillic-ext')
css = open('/tmp/gf.css').read()
blocks = re.findall(r'/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})', css, re.S)
os.makedirs('assets/fonts', exist_ok=True)
out = ["/* Self-hosted: Source Serif 4 (display), Onest (UI), JetBrains Mono (labels).",
       "   Regenerate with scripts/build-fonts.sh — do not edit by hand. */", ""]
n = 0
for sub, block in blocks:
    if sub not in KEEP:
        continue
    url = re.search(r'url\((https://[^)]+)\)', block).group(1)
    fam = re.search(r"font-family: '([^']+)'", block).group(1)
    weight = re.search(r'font-weight: ([\d ]+)', block).group(1).strip().replace(' ', '-')
    style = re.search(r'font-style: (\w+)', block).group(1)
    name = f"{fam.lower().replace(' ', '-')}-{weight}{'-i' if style == 'italic' else ''}-{sub}.woff2"
    if not os.path.exists(f'assets/fonts/{name}'):
        subprocess.run(['curl', '-sS', '-o', f'assets/fonts/{name}', url], check=True)
    out += [block.replace(url, f'../fonts/{name}'), ""]
    n += 1
open('assets/css/fonts.css', 'w').write("\n".join(out))
total = sum(os.path.getsize('assets/fonts/' + f) for f in os.listdir('assets/fonts'))
print(f"{n} faces, {total // 1024} KB")
PY
