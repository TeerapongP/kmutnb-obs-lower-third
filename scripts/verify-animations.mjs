import { io } from 'socket.io-client';

const baseUrl = process.env.VERIFY_URL || 'http://localhost:3000';
const templates = ['standard', 'modern', 'glass', 'minimal'];
const effects = [
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'fade',
  'scale',
  'wipe',
  'blur',
  'staggered',
  'light-sweep',
];

async function patchSettings(change) {
  const response = await fetch(`${baseUrl}/api/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(change),
  });
  if (!response.ok) throw new Error(await response.text());
}

const socket = io(baseUrl, { transports: ['websocket'] });
await new Promise((resolve, reject) => {
  socket.once('connect', resolve);
  socket.once('connect_error', reject);
});

function command(type) {
  return new Promise((resolve, reject) => {
    socket.timeout(3000).emit('command', { type }, (error, result) => {
      if (error || !result?.ok)
        reject(error || new Error(result?.error || `${type} failed`));
      else resolve();
    });
  });
}

let combinations = 0;
for (const template of templates) {
  for (const effect of effects) {
    await patchSettings({
      template,
      animation: {
        effect,
        duration: 0.3,
        easing: effect === 'scale' ? 'spring' : 'ease-out',
        enabled: true,
      },
    });
    await command('show');
    await command('hide');
    await command('replay');
    combinations++;
  }
}

const state = await fetch(`${baseUrl}/api/state`).then((response) => response.json());
if (!state.live.visible || state.settings.animation.effect !== 'light-sweep')
  throw new Error('Final synchronized state did not match the last replay.');

socket.close();
console.log(`Verified show, hide, and replay for ${combinations} template/preset pairs.`);
