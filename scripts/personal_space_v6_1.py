from pathlib import Path

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v6-1-icon-hotfix'

if MARKER in html:
    print('v6.1 already applied')
    raise SystemExit(0)

html = html.replace("${icon('left')}</button>${nums.join('')}<button", "${icon('arrowLeft')}</button>${nums.join('')}<button", 1)
html = html.replace("${icon('right')}</button></div></footer>", "${icon('chevron')}</button></div></footer>", 1)
html = html.replace("${icon('layers')}<span class=\"personal-bulk-label\">", "${icon('more')}<span class=\"personal-bulk-label\">", 1)

style_end = html.rfind('</style>')
html = html[:style_end] + '\n/* personal-space-v6-1-icon-hotfix */\n' + html[style_end:]
path.write_text(html, encoding='utf-8')
print('Applied v6.1 icon hotfix')
