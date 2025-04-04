const observers = [];

function getCurrentObserver() {
  return observers[observers.length - 1];
}

export function createEffect(fn) {
  const execute = () => {
    observers.push(execute);

    try {
      fn();
    } finally {
      observers.pop();
    }
  };

  execute();
}

export function createSignal(value) {
  const subscribers = new Set();
  const getValue = () => {
    const current = getCurrentObserver();
    if (current) {
      subscribers.add(current);
    }
    return value;
  };
  const setValue = (newValue) => {
    value = newValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  };
  return [getValue, setValue];
}
