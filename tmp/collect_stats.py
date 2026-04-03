import sys
from pathlib import Path
sys.path.append(str((Path(__file__).resolve().parents[1] / 'scripts').resolve()))
import turkkep_watch

env = turkkep_watch.load_env(turkkep_watch.ENV_PATH)
token = env.get('BRAVE_API_KEY')
articles, total = turkkep_watch.collect_articles(token)
print(f"len(arts)={len(articles)} total={total}")
