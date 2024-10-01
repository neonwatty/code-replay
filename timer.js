class Timer {
  constructor(timerElement) {
    this.timerElement = timerElement;
    this.counter = 0;
    this.interval = null;
  }

  // Start the timer
  start() {
    if (this.interval) return; // Prevent multiple intervals
    this.interval = setInterval(() => {
      this.timerElement.innerHTML = this.convertSec(this.counter++);
    }, 1000);
  }

  // Stop the timer
  stop() {
    clearInterval(this.interval);
    this.interval = null; // Reset the interval
  }

  // Clear the timer display
  clear() {
    this.counter = 0; // Reset counter
    this.timerElement.innerHTML = "00:00";
  }

  // Convert seconds to MM:SS format
  convertSec(cnt) {
    let sec = cnt % 60;
    let min = Math.floor(cnt / 60);
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  }
}

export default Timer;
