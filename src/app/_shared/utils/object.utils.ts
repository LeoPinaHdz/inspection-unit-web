export const removeEmptyAttributes = (obj: any) => {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        removeEmptyAttributes(obj[key]);
  
        if (obj[key] === "" ||
            obj[key] === undefined ||
            obj[key] === null ||
            (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0 && obj[key].constructor === Object) ||
            (Array.isArray(obj[key]) && obj[key].length === 0)) {
          delete obj[key];
        }
      });
    }
    return obj;
  }