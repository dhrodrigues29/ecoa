import secrets, csv, os

secrets.randbits(64)          # burn seed
ids = {secrets.randbits(63) for _ in range(103)}  # 103 unique 63-bit ints

# 1. console
for uid in ids:
    print(uid)

# 2. or save beside the tags CSV
with open('poi_uuids.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['uuid'])
    for uid in sorted(ids):
        writer.writerow([uid])