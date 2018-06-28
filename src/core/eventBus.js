import Element from './element';
import Utils from '../utils';

export default class EventBus {
  constructor() {
    this.events = {};
    this.elementHash = {};
  }

  _createEvent(type, fun, element) {
    return {
      type,
      callback: fun,
      element,
    };
  }

  _passCondition(condition, target) {
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

    const {events, elementHash} = this;
    const event = this._createEvent(type, fun, element);

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
    if (Utils.isEmpty(elementHash[type])) {
      elementHash[type] = [];
    }
    if (element && !elementHash[type].includes(element)) {
      elementHash[type].push(element);
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

    const {events, elementHash} = this;
    const eventType = events[type];
    const eleHash = elementHash[type];
    let deleteEvents = [];
    // 解除绑定事件并移除事件与元素之间的映射
    switch (true) {
      case (!fun && !element):
        deleteEvents = eventType;
        events[type] = [];
        elementHash[type] = [];
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
    const isElement =
      element instanceof Element || element instanceof HTMLElement ||
      (Array.isArray(element) && element.every(ele => (ele instanceof Element || ele instanceof HTMLElement)));
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
        event.callback(...data);
      });
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
