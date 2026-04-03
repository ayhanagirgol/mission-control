import json
import subprocess

entries = [
    [
        "python3",
        "skills/oswalpalash/ontology/scripts/ontology.py",
        "create",
        "--id", "pers_oguzgovem",
        "--type", "Person",
        "--props", json.dumps({"name": "Oğuz Gövem", "notes": "TürkKEP'te e-Belge projesinde çalışıyor"}, ensure_ascii=False),
    ],
    [
        "python3",
        "skills/oswalpalash/ontology/scripts/ontology.py",
        "create",
        "--id", "proj_ebelge",
        "--type", "Project",
        "--props", json.dumps({"name": "e-Belge", "status": "active"}, ensure_ascii=False),
    ],
    [
        "python3",
        "skills/oswalpalash/ontology/scripts/ontology.py",
        "relate",
        "--from", "proj_ebelge",
        "--rel", "has_owner",
        "--to", "pers_oguzgovem",
    ],
]

for cmd in entries:
    subprocess.run(cmd, check=True)

print("OK")
