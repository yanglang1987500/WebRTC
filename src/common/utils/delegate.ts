let targetMapping: ITarget[] = [];

const findTarget = (selector: string, el: HTMLElement) => {
  let element = el;
  while (element && element.matches && !element.matches(selector)) {
    if (element === document.body) {
      element = null;
      break;
    }
    element = element.parentElement;
  }
  return element;
};

const onDocumentClick = (e: MouseEvent) => {
  targetMapping.forEach(target => {
    const element = findTarget(target.selector, e.target as HTMLElement);
    !!element &&  target.callbacks.forEach(callback => callback(element));
  });
};

window.addEventListener('click', onDocumentClick);

const init = (selector: string, callback: (target: HTMLElement) => void) => {
  const target = targetMapping.filter(item => item.selector === selector);
  if (target.length > 0) {
    target[0].callbacks.push(callback);
  } else {
    targetMapping.push({
      selector,
      callbacks: [callback]
    });
  }
 
  return () => {
    targetMapping = targetMapping.filter(item => item.selector !== selector);
  };
};

interface ITarget {
  selector: string;
  callbacks: Function[];
}

export default init;