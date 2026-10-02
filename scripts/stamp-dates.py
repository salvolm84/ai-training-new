#!/usr/bin/env python3
"""Refresh the author byline dates in assets/app.js before a release.

Each page's `upd` becomes the date of the last commit that touched it, or
today if it has uncommitted changes. RELEASE becomes today. Run it from the
repository root just before committing a release:

    python3 scripts/stamp-dates.py
"""
import datetime
import re
import subprocess

APP = 'assets/app.js'
today = datetime.date.today().isoformat()


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True).stdout.strip()


dirty = set(git('status', '--porcelain').replace('\r', '').split('\n'))
dirty = {line[3:].split(' -> ')[-1] for line in dirty if line}

src = open(APP, encoding='utf-8').read()


def page_date(m):
    file = m.group(2)
    date = today if file in dirty else (git('log', '-1', '--format=%ad', '--date=short', '--', file) or today)
    return m.group(1) + date + m.group(3)


src = re.sub(r"(file: '([^']+)',[^\n]*?upd: ')\d{4}-\d{2}-\d{2}(')", page_date, src)
src = re.sub(r"(var RELEASE = ')\d{4}-\d{2}-\d{2}(')", r'\g<1>' + today + r'\2', src)
open(APP, 'w', encoding='utf-8').write(src)
print('RELEASE =', today)
