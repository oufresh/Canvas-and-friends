import './index.css'; 
import svg from './svg';

document.getElementById("app").innerHTML = `
  <button id="reset">Reset</button>
  <svg id="svg" width="960" height="500" />
`;

svg();