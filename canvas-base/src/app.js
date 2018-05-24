import './app.css';
import * as Append from './utils/append';
import * as Obs from './observables/observables';
import * as EventObservables from './observables/eventObservables';
import * as MouseDrag from './observables/mouseDrag';
import * as Loading from './observables/loading';
import * as DebounceInput from './observables/debounceInput';

console.log("Hello rxjs start!!!");

var tests = document.querySelector('div.tests');
tests.innerHTML = `
    <input type="radio" name="tests" value="event-observables">Tests event observables<br>
    <input type="radio" name="tests" value="observables">Tests observables<br>
    <input type="radio" name="tests" value="mouse-drag">Tests mouse drag<br>
    <input type="radio" name="tests" value="merge-async">Tests merge async operations<br>
    <input type="radio" name="tests" value="debounce-input">Tests debounce input text<br>
`;

export var eventButton = document.querySelector('button.event-button');
eventButton.style.display = "none";

export function showEventButton() {
    eventButton.style.display = "";
}

export function hideEventButton() {
    eventButton.style.display = "none";
}

export var inputText = document.querySelector('.rx-input.event-input');
inputText.style.display = "none";

export function showInputTex() {
    inputText.style.display = "";
}

export function hideInputTex() {
    inputText.style.display = "none";
}

Append.init(document.querySelector('.text .content'));


document.querySelector('button.test-button').addEventListener('click', function(){
    var value = tests.querySelector('input:checked').getAttribute('value');
    if (value)
    {
        switch (value)
        {
            case 'observables':
                clear();
                Obs.Test();
            break;
            case 'event-observables':
                clear();
                EventObservables.Test();
            break;
            case 'mouse-drag':
                clear();
                MouseDrag.Test();
            break;
            case 'merge-async':
                clear();
                Loading.Test();
            break;
            case 'debounce-input':
                DebounceInput.Test();
                clear();
            break;
            default:
                clear();
                break;
        }
    }
});

function clear()
{
    hideEventButton();
    MouseDrag.clear();
    Append.clear();
}




  
  