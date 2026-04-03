# HEARTBEAT.md

## Periyodik Görevler

### 🤖 Agent Sağlık Kontrolü (her 2-3 saatte bir)
Şu agent'ların session durumunu kontrol et:
- `agent:bulut:main` (Bulut)
- `agent:demir-agent:main` (Demir)
- `agent:turkkep-agent:main` (Türkkep)
- `agent:gpt-agent:main` (gpt-agent)

Sessiz olan varsa kısaca bildir. Aktifse HEARTBEAT_OK ile geç.

Son kontrol zamanını `memory/heartbeat-state.json` dosyasında tut.
