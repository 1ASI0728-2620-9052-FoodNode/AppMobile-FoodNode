const handlers = {};
export const EventBus = {
  subscribe(eventName, handler) {
    if (!handlers[eventName]) handlers[eventName] = [];
    handlers[eventName].push(handler);
  },
  publish(event) {
    const name = event.constructor.name;
    (handlers[name] || []).forEach((h) => h(event));
  },
  clear() {
    Object.keys(handlers).forEach((k) => delete handlers[k]);
  },
};

