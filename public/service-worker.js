// service-worker.js
let isTracking = false;
let focusedTime = parseInt(localStorage.getItem('focusedTime')) || 0;
let totalTime = parseInt(localStorage.getItem('totalTime')) || 0;

self.addEventListener('message', (event) => {
  if (event.data === 'startTracking') {
    isTracking = true;
    startTracking();
  } else if (event.data === 'stopTracking') {
    isTracking = false;
  }
});

const startTracking = () => {
  setInterval(() => {
    if (isTracking) {
      totalTime += 1;
      const isFocused = Math.random() > 0.5; // Replace with actual face tracking logic
      if (isFocused) {
        focusedTime += 1;
      }
      // Save focus data to localStorage
      localStorage.setItem('focusedTime', focusedTime);
      localStorage.setItem('totalTime', totalTime);
      // Broadcast focus data to all clients
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'focusUpdate',
            focusedTime,
            totalTime,
          });
        });
      });
    }
  }, 1000);
};