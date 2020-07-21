class Mediators {
  constructor () {
    this.events = {};
  }
  on(name, callback) {
    if (this.type(name) && typeof callback === 'function') {
      if (!this.events[name]) {
        this.events[name] = [];
      }
      this.events[name].push(callback);
    }
  }
  trigger(name, info) {
    if (this.events[name] && this.events[name].length) {
      for (let i = 0; i < this.events[name].length; i++) {
        this.events[name][i](info);
      }
    }
  }
}

export default Mediators;