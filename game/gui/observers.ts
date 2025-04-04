const observers: Array<() => void> = [];

export function createEffect(callback: () => void) {
  const execute = () => {
    observers.push(execute);

    try {
      callback();
    } finally {
      observers.pop();
    }
  };

  execute();
}

export function createSignal<T>(value: T): [() => T, (value: T) => void] {
  const subscribers = new Set<() => void>();

  const getValue = () => {
    const current = observers[observers.length - 1];
    if (current) {
      subscribers.add(current);
    }

    return value;
  };

  const setValue = (newValue: T) => {
    value = newValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  return [getValue, setValue];
}
