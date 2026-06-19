const fs = require('fs');
try {
  if (fs.existsSync('app/event')) fs.renameSync('app/event', 'app/kegiatan');
  if (fs.existsSync('app/api/events')) fs.renameSync('app/api/events', 'app/api/kegiatan');
  if (fs.existsSync('database/events.json')) fs.renameSync('database/events.json', 'database/kegiatan.json');
  if (fs.existsSync('components/EventCard.tsx')) fs.renameSync('components/EventCard.tsx', 'components/KegiatanCard.tsx');
  console.log('Renamed successfully');
} catch(e) {
  console.error(e);
}
