import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('fetch', 'scripts/fetch_outlook_data.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print(mod.ENV_FILE)
print(mod.ENV_MAP)
