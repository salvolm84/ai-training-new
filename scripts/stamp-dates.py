#!/usr/bin/env python3
"""Refresh the author byline dates in assets/app.js before a release.

Each page's `upd` becomes the date of the last commit that touched it or its
Italian copy in it/, or today if either has uncommitted changes. RELEASE
becomes today. Run it from the
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


dirty = set(git('status', '--porcelain', '-uall').replace('\r', '').split('\n'))
dirty = {line[3:].split(' -> ')[-1] for line in dirty if line}

src = open(APP, encoding='utf-8').read()


def page_date(m):
    files = [m.group(2), 'it/' + m.group(2)]
    if any(f in dirty for f in files):
        date = today
    else:
        date = git('log', '-1', '--format=%ad', '--date=short', '--', *files) or today
    return m.group(1) + date + m.group(3)


src = re.sub(r"(file: '([^']+)',[^\n]*?upd: ')\d{4}-\d{2}-\d{2}(')", page_date, src)
src = re.sub(r"(var RELEASE = ')\d{4}-\d{2}-\d{2}(')", r'\g<1>' + today + r'\2', src)
open(APP, 'w', encoding='utf-8').write(src)
print('RELEASE =', today)
