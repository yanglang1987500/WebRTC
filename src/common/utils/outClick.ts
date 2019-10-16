let targetMapping: ITarget[] = [];

const onDocumentClick = (e: MouseEvent) => {
  targetMapping.forEach(obj => {
    // If you click on the element in the current pop-up box, you don't need to close it.
    if (e.target === obj.element || OutClick.isParent(e.target, obj.element)) {
      return;
    }

    obj.callbacks.forEach(callback => callback());
  });
};

window.document.body.addEventListener('click', onDocumentClick);

const OutClick = {
  // Determine if the click is in the element of the pop-up box
  isParent: (obj: EventTargetExpand, parentObj: HTMLElement) => {
    let origin = obj;
    while (origin && origin.tagName && origin.tagName.toLowerCase() !== 'body') {
      if (origin === parentObj) {
        return true;
      }
      origin = origin.parentNode;
    }

    return false;
  },
  init: (element: HTMLElement, callback: Function) => {
    const target = targetMapping.filter(item => item.element === element);
    if (target.length > 0) {
      target[0].callbacks.push(callback);
    } else {
      targetMapping.push({
        element,
        callbacks: [callback]
      });
    }

    return {
      // Clearing events
      clear: () => {
        targetMapping = targetMapping.filter(item => item.element !== element);
      }
    };
  }
};

interface EventTargetExpand extends EventTarget {
  tagName?: string;
  parentNode?: Node;
}

interface ITarget {
  element: HTMLElement;
  callbacks: Function[];
}

export default OutClick;