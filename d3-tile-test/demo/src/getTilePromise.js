//@flow
const getStTilePromise: Promise = (url: string): Promise<any> => {
  const p = new Promise((resolve, reject) => {
    return fetch(url)
      .then(r => {
        if (r.ok === true) return r.json();
        else return new Error("Error fetch: " + r.status + ", " + r.statusText);
      })
      .then((json: any) => {
        resolve(json.schemaSvg);
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });

  return p;
};

export { getStTilePromise };
