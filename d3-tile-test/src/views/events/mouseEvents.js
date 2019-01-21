//@flow

const getPath = (event: any): Array<HTMLElement> => {
  if (event.path) {
    let path = [];
    for (let i = 0; i < event.path.length - 1; i++) {
      if (event.path[i].nodeName === "svg" || event.path[i].tagName === "svg")
        break;
      path.push(event.path[i]);
    }
    return path;
  } else {
    let path = [];
    let end = false;
    let target = event.target;
    while (!end) {
      if (target.nodeName === "svg" || target.tagName === "svg") {
        end = true;
        continue;
      }
      path.push(target);
      target = target.parentNode;
    }

    return path;
  }
};

/**
 * Filtra gli venti di doppio click per d3: ritorna il path degli elementi fino al tag svg più alto
 * @param {*} event evento d3
 */
export const doubleClickFilter = (event: MouseEvent): Array<HTMLElement> => {
  const path = getPath(event);
  return path;
};

export const mouseDownFilter = (event: MouseEvent): Array<HTMLElement> => {
  const path = getPath(event);
  return path;
};

export const clickFilter = (event: MouseEvent): Array<HTMLElement> => {
  const path = getPath(event);
  return path;
};
