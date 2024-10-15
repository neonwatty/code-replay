class Timer {
  constructor() {
    this.counter = 0;
    this.interval = null;
  }

  // Start the timer
  start() {
    if (this.interval) return; // Prevent multiple intervals
    this.interval = setInterval(() => {
      this.convertSec(this.counter++);
    }, 100);
  }

  // Stop the timer
  stop() {
    clearInterval(this.interval);
    this.interval = null; // Reset the interval
  }

  // Clear the timer display
  clear() {
    this.counter = 0; // Reset counter
  }

  convertSec(cnt) {
    const milliseconds = cnt % 10; // Get the last digit for milliseconds
    const seconds = Math.floor(cnt / 10) % 60; // Get seconds
    const minutes = Math.floor(cnt / 600); // Get total minutes

    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}.${milliseconds}`;
  }
}

export default Timer;
