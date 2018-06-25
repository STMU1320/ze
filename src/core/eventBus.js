import Element from './element';

export default class EventBus {
  constructor() {
    this.events = {};
  }

  _createEvent(type, fun, element) {
    return {
      type,
      function: fun,
      element,
    };
  }

  _passCondition (condition, target) {
    if (Array.isArray(condition)) {
      return condition.includes(target);
    }
    return condition === target;
  }

  on(type, fun, element) {
    if (!fun || !type) {
      throw '添加事件函数必须接收事件类型和事件处理函数两个参数';
    } else if (typeof fun !== 'function' || typeof type !== 'string') {
      throw '事件类型必须为字符串，处理函数必须为Function类型';
    }

    const {events} = this;
    const event = this._createEvent(type, fun, element);

    if (type in events) {
      const eventType = events[type];
      const hasEvent = eventType.find(
        event => {
          if (event.element) {
            return event.function === fun && event.element === element;
          }

          return event.function === fun;
        }
          
      );
      if (!hasEvent) {
        eventType.push(event);
      }
    } else {
      events[type] = [event];
    }

    return events[type].length;
  }

  off(type, fun, element) {
    if (!type) {
      throw '必须传入需要移除的事件类型';
    }
    if (fun && typeof fun !== 'function') {
      element = fun;
      fun = null;
    }

    const {events} = this;
    const eventType = events[type];
    let deleteEvents = [];
    if (!fun && !element) {
      events[type] = [];
      deleteEvents = eventType;
    } else if (fun && !element) {
      const index = eventType.findIndex(event => event.function === fun);
      if (index !== -1) {
        deleteEvents = eventType.splice(index, 1);
      }
    } else if (!fun && element) {
      const index = eventType.findIndex(event => event.element === element);
      if (index !== -1) {
        deleteEvents = eventType.splice(index, 1);
      }
    } else {
      const index = eventType.findIndex(event => {
        return event.function === fun && event.element === element;
      });
      if (index !== -1) {
        deleteEvents = eventType.splice(index, 1);
      }
    }

    return deleteEvents;
  }

  trigger(type, element, ...data) {
    const { events } = this;
    if (typeof type !== 'string') {
      throw '触发事件类型必须为string类型';
    }
    let runEvents = events[type];
    const isElement = element instanceof Element || (Array.isArray(element) && element.every(ele => ele instanceof Element));
    if (!isElement) {
      data.unshift(element);
      element = null;
    }
    if (element) {
      runEvents = runEvents.filter(event => this._passCondition(element, event.element));
    }
    runEvents &&
      runEvents.forEach(event => {
        event.function(...data);
      });
  }

  addEventListener (...arg) {
    this.on(...arg);
  }

  removeEventListener (...arg) {
    this.off(...arg);
  }

  emit (...arg) {
    this.trigger(...arg);
  }
}
