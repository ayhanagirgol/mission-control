import json
import subprocess

commands = [
    [
        "python3","skills/oswalpalash/ontology/scripts/ontology.py",
        "create","--id","pers_aykutkutlusan","--type","Person",
        "--props", json.dumps({"name":"Aykut Kutlusan","notes":"PMO ofisinin yöneticisi"}, ensure_ascii=False)
    ],
    [
        "python3","skills/oswalpalash/ontology/scripts/ontology.py",
        "relate","--from","proj_ebelge","--rel","has_owner","--to","pers_aykutkutlusan"
    ],
    [
        "python3","skills/oswalpalash/ontology/scripts/ontology.py",
        "relate","--from","pers_oguzgovem","--rel","architectural_advisor_for","--to","proj_ebelge"
    ]
]
for cmd in commands:
    subprocess.run(cmd, check=True)
print('OK')
