import json, sys, re

with open(sys.argv[1]) as f:
    data = json.load(f)
text = data[0]['text']

idx1 = text.find('      - id: 482:6196')
idx2 = text.find('      - id: 485:7485')
gv_idx = text.find('globalVars:')

frame1 = text[idx1:idx2]
frame2 = text[idx2:gv_idx]
gv = text[gv_idx:]

fills1 = set(re.findall(r'fills: (\S+)', frame1))
fills2 = set(re.findall(r'fills: (\S+)', frame2))
strokes1 = set(re.findall(r'strokes: (\S+)', frame1))
strokes2 = set(re.findall(r'strokes: (\S+)', frame2))

only1_f = fills1 - fills2
only2_f = fills2 - fills1
only1_s = strokes1 - strokes2
only2_s = strokes2 - strokes1

def resolve_color(name):
    pattern = f"    {name}:\n"
    idx = gv.find(pattern)
    if idx < 0:
        return "???"
    chunk = gv[idx:idx+200]
    m = re.search(r"'(#[0-9A-Fa-f]{6})'", chunk)
    if m:
        return m.group(1)
    m2 = re.search(r"- '?(.+)'?", chunk)
    if m2:
        return m2.group(1).strip().strip("'")
    return "???"

print("=== Liber-only fills ===")
for f in sorted(only1_f):
    print(f"  {f}: {resolve_color(f)}")

print("\n=== Teste-only fills ===")
for f in sorted(only2_f):
    print(f"  {f}: {resolve_color(f)}")

print("\n=== Liber-only strokes ===")
for s in sorted(only1_s):
    print(f"  {s}: {resolve_color(s)}")

print("\n=== Teste-only strokes ===")
for s in sorted(only2_s):
    print(f"  {s}: {resolve_color(s)}")

print(f"\nShared fills: {len(fills1 & fills2)}")
for f in sorted(fills1 & fills2):
    print(f"  {f}: {resolve_color(f)}")

print(f"\nShared strokes: {len(strokes1 & strokes2)}")
for s in sorted(strokes1 & strokes2):
    print(f"  {s}: {resolve_color(s)}")
