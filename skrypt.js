const dzisiejszaData = document.getElementById("dzisiejszaData");
const poleNawyk = document.getElementById("poleNawyk");
const przyciskDodaj = document.getElementById("przyciskDodaj");
const listaNawykow = document.getElementById("listaNawykow");
const ukonczoneDzis = document.getElementById("ukonczoneDzis");
const wszystkieNawyki = document.getElementById("wszystkieNawyki");
const wypelnieniePostepu = document.getElementById("wypelnieniePostepu");

const dzisiaj = new Date().toISOString().split("T")[0];
dzisiejszaData.textContent = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });

let nawyki = JSON.parse(localStorage.getItem("nawyki")) || [];

function zapiszNawyki() {
    localStorage.setItem("nawyki", JSON.stringify(nawyki));
}

function wyrenderujNawyki() {
    listaNawykow.innerHTML = "";

    nawyki.forEach(function(nawyk) {
        const ukonczonyDzis = nawyk.ukonczoneDaty.includes(dzisiaj);

        const element = document.createElement("div");
        element.className = "nawyk";
        element.innerHTML =
            "<button class='checkbox-nawyku " + (ukonczonyDzis ? "zaznaczony" : "") + "' data-id='" + nawyk.id + "'>✓</button>" +
            "<span class='nazwa-nawyku " + (ukonczonyDzis ? "ukonczony" : "") + "'>" + nawyk.nazwa + "</span>" +
            "<button class='usun-nawyk' data-id='" + nawyk.id + "'>🗑</button>";

        listaNawykow.appendChild(element);
    });

    document.querySelectorAll(".checkbox-nawyku").forEach(function(przycisk) {
        przycisk.addEventListener("click", function() {
            przelaczNawyk(przycisk.dataset.id);
        });
    });

    document.querySelectorAll(".usun-nawyk").forEach(function(przycisk) {
        przycisk.addEventListener("click", function() {
            usunNawyk(przycisk.dataset.id);
        });
    });

    aktualizujPodsumowanie();
}

function przelaczNawyk(id) {
    const nawyk = nawyki.find(function(n) { return n.id == id; });
    const indeksDaty = nawyk.ukonczoneDaty.indexOf(dzisiaj);

    if (indeksDaty === -1) {
        nawyk.ukonczoneDaty.push(dzisiaj);
    } else {
        nawyk.ukonczoneDaty.splice(indeksDaty, 1);
    }

    zapiszNawyki();
    wyrenderujNawyki();
}

function usunNawyk(id) {
    nawyki = nawyki.filter(function(n) { return n.id != id; });
    zapiszNawyki();
    wyrenderujNawyki();
}

function aktualizujPodsumowanie() {
    const ukonczone = nawyki.filter(function(n) { return n.ukonczoneDaty.includes(dzisiaj); }).length;
    ukonczoneDzis.textContent = ukonczone;
    wszystkieNawyki.textContent = nawyki.length;

    const procent = nawyki.length === 0 ? 0 : (ukonczone / nawyki.length) * 100;
    wypelnieniePostepu.style.width = procent + "%";
}

przyciskDodaj.addEventListener("click", function() {
    const nazwa = poleNawyk.value.trim();
    if (nazwa === "") return;

    nawyki.push({ id: Date.now(), nazwa: nazwa, ukonczoneDaty: [] });
    zapiszNawyki();
    wyrenderujNawyki();
    poleNawyk.value = "";
});

poleNawyk.addEventListener("keypress", function(zdarzenie) {
    if (zdarzenie.key === "Enter") {
        przyciskDodaj.click();
    }
});

// rejestracja Service Workera - to on odpowiada za działanie offline i instalację
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

wyrenderujNawyki();