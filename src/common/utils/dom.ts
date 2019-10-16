
export const initDomExtension = () => {
 
  const fadeIn = (element: HTMLElement, interval: number): Promise<void> => {
    element.style.opacity = '0';
    element.style.display = "block";
    setTimeout(() => element.style.transition = `opacity linear ${interval/1000}s`, 10);
    setTimeout(() => element.style.opacity = '1', 20);
    return new Promise(resolve => {
      setTimeout(
        () => {
          element.style.transition = null;
          resolve();
        },
        interval);
    });
  };
  const fadeOut = (element: HTMLElement, interval: number): Promise<void> => {
    element.style.transition = `opacity linear ${interval/1000}s`;
    element.style.opacity = '1';
    setTimeout(() => element.style.opacity = '0');
    return new Promise(resolve => {
      setTimeout(
        () => {
          element.style.display = 'none';
          element.style.transition = null;
          resolve();
        },
        interval);
    });
  };

  HTMLElement.prototype.fadeIn = function (interval: number = 500): Promise<void> {
    return (this instanceof HTMLElement) && fadeIn(this, interval);
  };
  HTMLElement.prototype.fadeOut = function (interval: number = 500): Promise<void> {
    return (this instanceof HTMLElement) && fadeOut(this, interval);
  };
  HTMLElement.prototype.hide = function () {
    this.style.display = 'none';
    return this;
  };
  HTMLElement.prototype.removeClass = function (className: string) {
    this.classList.remove(className);
    return this;
  };
  HTMLElement.prototype.addClass= function (className: string) {
    this.classList.add(className);
    return this;
  };
};

initDomExtension();

const getDomTopById = (id: string) :number => {
  const dom = document.getElementById(id);
  if (dom) {
    return dom.getBoundingClientRect().top;
  }
  return null;
};

export const getTopDomByIds = (ids: string[] = []) => {
  const list = ids.map(id => ({ id, top: getDomTopById(id) }))
    .filter(i => i.top !== null)
    .sort((i, j) => i.top - j.top);
  return list.length > 0 ? list[0].id : null;
};