#!/usr/bin/env node
/**
 * Calendar Location Alert
 * - Checks upcoming events (next 20 min)
 * - If event has location and starts in ~15 min, opens Apple Maps
 * - Tracks already-alerted events to avoid duplicates
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const STATE_FILE = path.join(process.cwd(), 'logs/calendar_location_state.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { alerted: {} };
  }
}

function saveState(state) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getUpcomingEvents() {
  try {
    const now = new Date();
    const from = now.toISOString();
    const to = new Date(now.getTime() + 20 * 60 * 1000).toISOString();
    
    const result = execSync(
      `gog calendar list primary -a ayhan.agirgol@gmail.com --from "${from}" --to "${to}" --format json 2>/dev/null`,
      { timeout: 15000, encoding: 'utf8' }
    );
    
    return JSON.parse(result || '[]');
  } catch (e) {
    console.error('Failed to fetch events:', e.message);
    return [];
  }
}

function openAppleMaps(location) {
  const query = encodeURIComponent(location);
  execSync(`open "https://maps.apple.com/?q=${query}"`);
  console.log(`🗺️ Apple Maps opened for: ${location}`);
}

function main() {
  const state = loadState();
  const now = Date.now();
  
  // Clean old alerts (older than 24h)
  for (const [id, ts] of Object.entries(state.alerted)) {
    if (now - ts > 24 * 60 * 60 * 1000) delete state.alerted[id];
  }
  
  const events = getUpcomingEvents();
  
  for (const event of events) {
    const location = event.location;
    const eventId = event.id;
    const startStr = event.start || event['start-local'];
    
    if (!location || !startStr || !eventId) continue;
    if (state.alerted[eventId]) continue;
    
    const startTime = new Date(startStr).getTime();
    const minutesUntil = (startTime - now) / 60000;
    
    // Alert if event is 10-20 minutes away (covers the ~15 min window)
    if (minutesUntil >= 0 && minutesUntil <= 20) {
      console.log(`📍 Event "${event.summary}" starts in ${Math.round(minutesUntil)} min at "${location}"`);
      openAppleMaps(location);
      state.alerted[eventId] = now;
    }
  }
  
  saveState(state);
}

main();
