import Element from './element';
import Utils from '../utils';

export default class EventBus {
  constructor() {
    this.events = {};
    this.registeredElements = {};
  }

  _isElement (element) {
    return element instanceof Element || element instanceof HTMLElement ||
    (Array.isArray(element) && element.every(ele => (ele instanceof Element || ele instanceof HTMLElement)));
  }

  _createEvent(type, fun, element, once) {
    return {
      type,
      callback: fun,
      element,
      once
    };
  }

  _passCondition(condition, target) {
    if (Array.isArray(condition)) {
      return condition.includes(target);
    }
    return condition === target;
  }

  _clearEvent (elements) {
    const { registeredElements, events } = this;
    if (!Array.isArray(elements)) {
      elements = [elements];
    }
    const rmEvents = [];
    elements.forEach(element => {
      for (let key in events) {
        const temp = Utils.remove(events[key], event => event.element === element);
        if (temp.length > 0) {
          rmEvents.concat(temp);
          Utils.remove(registeredElements[key], ele => ele === element);
        }
      }
    });
    return rmEvents;
  }

  on(type, fun, element, once = false) {
    if (!fun || !type) {
      throw '添加事件函数必须接收事件类型和事件处理函数两个参数';
    } else if (typeof fun !== 'function' || typeof type !== 'string') {
      throw '事件类型必须为字符串，处理函数必须为Function类型';
    }

    const {events, registeredElements} = this;
    const event = this._createEvent(type, fun, element, once);

    // 添加事件
    if (type in events) {
      const eventType = events[type];
      const hasEvent = eventType.find(event => {
        if (event.element) {
          return event.callback === fun && event.element === element;
        }

        return event.callback === fun;
      });
      if (!hasEvent) {
        eventType.push(event);
      }
    } else {
      events[type] = [event];
    }

    // 添加事件与元素的映射
    if (Utils.isEmpty(registeredElements[type])) {
      registeredElements[type] = [];
    }
    if (element && !registeredElements[type].includes(element)) {
      registeredElements[type].push(element);
    }

    return events[type].length;
  }

  off(type, fun, element) {
    if (!type) {
      throw '必须传入需要移除的事件类型或者绑定的事件元素';
    }
    if (fun && typeof fun !== 'function') {
      element = fun;
      fun = null;
    }
    if (this._isElement(type)) {
      return this._clearEvent(type);
    }
    const {events, registeredElements} = this;
    const eventType = events[type];
    const eleHash = registeredElements[type];
    let deleteEvents = [];
    // 解除绑定事件并移除事件与元素之间的映射
    switch (true) {
      case (!fun && !element):
        deleteEvents = eventType;
        events[type] = [];
        registeredElements[type] = [];
        break;

      case (fun && !element):
        deleteEvents = Utils.remove(eventType, event => event.callback === fun);
        if (deleteEvents.length !== 0) {
          const eventEle = deleteEvents[0].element;
          if (eventEle) {
            const has = eventType.some(event => (event.element && event.element === eventEle));
            if (!has) {
              Utils.remove(eleHash, ele => ele === eventEle);
            }
          }
        }
        break;

      case (!fun && element):
        deleteEvents = Utils.remove(eventType, event => event.element === element);
        Utils.remove(eleHash, ele => ele === element);
        break;

      default:
        deleteEvents = Utils.remove(eventType, event => event.callback === fun && event.element === element);
        const has = eventType.some(event => event.element === element);
        if (!has) {
          Utils.remove(eleHash, ele => ele === element);
        }
        break;
    }

    return deleteEvents;
  }

  trigger(type, element, ...data) {
    const {events} = this;
    if (typeof type !== 'string') {
      throw '触发事件类型必须为string类型';
    }
    let runEvents = events[type];
    const onceEvents = [];
    const isElement = this._isElement(element);
    if (!isElement) {
      data.unshift(element);
      element = null;
    }
    if (element) {
      runEvents = runEvents.filter(event => {
        // if (event.element) {
          
        // }
        // return true;
        return this._passCondition(element, event.element);
      });
    }
    runEvents &&
      runEvents.forEach(event => {
        if ( data[0] instanceof UIEvent && event.element ) {
          data[0].shape =  event.element;
        }
        event.callback.apply(event.element || this, data);
        if (event.once) {
          onceEvents.push(event);
        }
      });
    if (onceEvents.length > 0) {
      Utils.remove(runEvents, event => onceEvents.includes(event));
    }
  }

  once (...arg) {
    arg[3] = true;
    this.on(...arg);
  }

  addEventListener(...arg) {
    this.on(...arg);
  }

  removeEventListener(...arg) {
    this.off(...arg);
  }

  emit(...arg) {
    this.trigger(...arg);
  }
}
