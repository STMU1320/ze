import Element from './element';
import Utils from '../utils';

export default class EventBus {
  constructor() {
    this.events = {};
    this.registeredElements = {};
    this._lastTrigger = [];
  }

  _isElement (element) {
    return element instanceof Element || element instanceof HTMLElement ||
    (Array.isArray(element) && element.every(ele => (ele instanceof Element || ele instanceof HTMLElement)));
  }

  _isElementEvent (elementEvent) {
    if (Utils.isEmpty(elementEvent)) {
      return false;
    }
    if (Array.isArray(elementEvent)) {
      return elementEvent.every(ee => this._isElement(ee.element));
    }
    return this._isElement(elementEvent.element);
  }

  _createEvent(type, fun, element, once) {
    return {
      type,
      callback: fun,
      element,
      once
    };
  }

  _createEventData (type, target, position, originEve = {}) {
    const eve = {
      origin: originEve,
      x: position.x,
      y: position.y,
      layerX: position.layerX,
      layerY: position.layerY,
      type,
      target,
      prevent: false,
      stop: false,
      timeStamp: Date.now(),
      preventDefault() {
        eve.prevent = true;
      },
      stopPropagation() {
        eve.stop = true;
      }
    };
    return eve;
  }

  _getTriggerElement(elementEvent, target) {
    let list = elementEvent;
    if (!Array.isArray(elementEvent)) {
      list = [elementEvent];
    }

    const eventItem = list.filter(item => item.element === target)[0];
    return eventItem;
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
        const insertIndex = Utils.findLastIndex(
          eventType,
          item => {
            if (!item.element || !element) {
              return true;
            }
            return element._weight >= item.element._weight;
          }
        );
        if (insertIndex === -1) {
          eventType.unshift(event);
        } else {
          eventType.splice( Math.max(insertIndex - 1, 0) , 0, event);
        }
        // eventType.push(event);
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

  trigger(type, elementEvent, ...data) {
    const {events} = this;
    if (typeof type !== 'string') {
      throw '触发事件类型必须为string类型';
    }
    const triggerEvents = events[type];
    // debugger
    let runEvents = [];
    const onceEvents = [];
    const isElementEvent = this._isElementEvent(elementEvent);
    if (triggerEvents) {
      if (!isElementEvent) {
        data.unshift(elementEvent);
        elementEvent = null;
        runEvents = triggerEvents;
      } else {
        triggerEvents.forEach(event => {
          const triggerElement = this._getTriggerElement(elementEvent, event.element);
          if (triggerElement) {
            runEvents.push({ ...event, eventData: triggerElement.eventData });
          }
        });
      }
    }
    if (!Utils.isEmpty(runEvents)) {
      let eventData;
      for (let i = 0; i < runEvents.length; i++) {
        const current = runEvents[i];
        const params = [...data];
        if (current.eventData) {
          params.unshift(current.eventData);
          eventData = current.eventData;
        }
        current.callback.apply(current.element || this, params);
        if (current.once) {
          onceEvents.push(current);
        }
        if (eventData && eventData.stop) {
          return;
        }
      }
    }
    if (!Utils.isEmpty(onceEvents)) {
      Utils.remove(triggerEvents, event => onceEvents.includes(event));
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
