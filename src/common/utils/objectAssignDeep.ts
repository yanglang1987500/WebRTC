const getTypeOf = (input: any) => {
  if (input === null) {
    return 'null';
  }
  if (typeof input === 'undefined') {
    return 'undefined';
  }
  if (typeof input === 'object') {
    return (Array.isArray(input) ? 'array' : 'object');
  }
  return typeof input;
};

const cloneValue = (value: any) => {
  if (getTypeOf(value) === 'object') {
    return quickCloneObject(value);
  }
  if (getTypeOf(value) === 'array') {
    return quickCloneArray(value);
  }
  return value;
};

const quickCloneArray = (input: any) => {
  return input.map(cloneValue);
};

const quickCloneObject = (input: any) => {
  const output: any = {};
  for (const key in input) {
    if (!input.hasOwnProperty(key)) { continue; }
    output[key] = cloneValue(input[key]);
  }
  return output;
};

const executeDeepMerge = (target: any, pObjects: any[] = [], pOptions = {}) => {

  const options = {
    arrayBehaviour: (pOptions as any).arrayBehaviour || 'replace',  // Can be "merge" or "replace".
  };

  const objects = pObjects.map(object => object || {});
  const output = target || {};

  for (let oindex = 0; oindex < objects.length; oindex+=1) {
    const object = objects[oindex];
    const keys = Object.keys(object);

    for (let kindex = 0; kindex < keys.length; kindex+=1) {
      const key = keys[kindex];
      const value = object[key];
      const type = getTypeOf(value);
      const existingValueType = getTypeOf(output[key]);

      if (type === 'object') {
        if (existingValueType !== 'undefined') {
          const existingValue = (existingValueType === 'object' ? output[key] : {});
          output[key] = executeDeepMerge({}, [existingValue, quickCloneObject(value)], options);
        } else {
          output[key] = quickCloneObject(value);
        }
      } else if (type === 'array') {
        if (existingValueType === 'array') {
          const newValue = quickCloneArray(value);
          output[key] = (options.arrayBehaviour === 'merge' ? output[key].concat(newValue) : newValue);
        } else {
          output[key] = quickCloneArray(value);
        }
      } else {
        output[key] = value;
      }

    }
  }

  return output;

};

const objectAssignDeep = (target: any, ...objects: any[]) => {
  return executeDeepMerge(target, objects);
};

export default objectAssignDeep;

export const noMutate = (...objects: any[]) => {
  return executeDeepMerge({}, objects);
};

export const withOptions = (target: any, objects: any, options: any) => {
  return executeDeepMerge(target, objects, options);
};
