function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        color: document.querySelector("#color").value,
        color1: document.querySelector("#color1").value,
        color2: document.querySelector("#color2").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#color").value = result.color || "Choose a City";
    }

    function setCurrentChoice1(result) {
        document.querySelector("#color1").value = result.color1 || "Choose a City";
    }

    function setCurrentChoice2(result) {
        document.querySelector("#color2").value = result.color2 || "Choose a City";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("color");
    var getting1 = browser.storage.local.get("color1");
    var getting2 = browser.storage.local.get("color2");
    getting.then(setCurrentChoice, onError);
    getting1.then(setCurrentChoice1, onError);
    getting2.then(setCurrentChoice2, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);