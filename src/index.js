/**
 * Ściągnij wszystkie możliwe dane państw z pomocą API: https://restcountries.eu/. W dalszej części kursu będą one nazywane Tablicą Państw (TP).
 * Ściągnięte dane zapisz w sposób, który pozwoli na ich ponowne wykorzystanie po zamknięciu i ponownym otwarciu przeglądarki,
 * 
 * Przy starcie aplikacji sprawdź, czy dane państw istnieją w pamięci przeglądarki. Jeśli nie, ściągnij je,
 * Przy starcie aplikacji sprawdź ile czasu minęło od poprzedniego ściągnięcia danych państw. 
 * Jeśli od ostatniego razu minęło co najmniej 7 dni, ściągnij i zapisz je ponownie.
 * 
 * Stwórz metodę, która przy ponownym ściąganiu danych państw porówna populację między starym 
 * i nowym zestawem danych oraz wyświetli wszystkie nazwy państw, których populacja uległa zmianie.
 *
 * Kod powinien być w pełni otypowany.
 * Kod powinien posiadać pełen zestaw testów (Jest).
 * Kod może posiadać komentarze.
**/

window.onload = function() {
    console.log('App started!');

    tableWithStates.init();
}

class TableWithStates {
    url = "https://restcountries.eu/rest/v2/all";
    dateDownloadFromApi = '';
    tableAfterComparison = [];

    init() {
        if( this.ifDownloadFromApi( storage.getStorageDate() ) === false && storage.getStorageStates().length > 0 ) {
            console.log('Pobrałem dane zapisane w localStorage. Liczba państw w localStorage to: ' + storage.getStorageStates().length);
            console.log('Dane państw zapisane w localStorage: ', storage.getStorageStates());
            // console.log('tablica w localStorage: ', storage.getStorageStates().length);
            // this.loadFromLocalStorageStates();
        } else {
            console.log('Pobrałem dane z API');
            this.downloadFromAPI();
        }
    }

    // pobranie danych z API; zapisanie w local storage pobranych danych i timestamp pobrania
    downloadFromAPI() { 
        fetch(this.url)
            .then(response => {
                response.json().then(data => {
                    console.log('Dane państw pobrane z API:', data);

                    if(storage.getStorageStates().length > 0) {
                        this.loopForOldData(storage.getStorageStates(), data);
                    }

                    let time = new Date();
                    this.dateDownloadFromApi = time.getTime();
                    storage.saveStorageDate(this.dateDownloadFromApi);

                    storage.saveStorageStates(data);
                })
            })
        
    }

    // pobieranie z localStorage zapisanych danych państw
    // loadFromLocalStorageStates() {
    //     let listFromStorage = storage.getStorageStates();
    //     return listFromStorage;
    // }

    // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)
    ifDownloadFromApi(timeSavingInLocalStorage) {
        const MS_IN_6DAYS = 6*24*60*60*1000;
        const timeNow = (new Date).getTime();
        const differenceInMs = timeNow - timeSavingInLocalStorage;

        if(differenceInMs <= 30000) {
            console.log('Od ostatniego pobrania z API upłynęło mniej niż ' + 30000 + 'ms więc korzystam z localstorage i nie pobieram nowych danych z API.')
            return false;
        } else {
            console.log('Od ostatniego pobrania z API upłynęło więcej niż 6 dni, więc ponownie pobieram dane z API.')
            return true;
        }
    }

    // porównanie populacji z dwóch zbiorów danych
    comparePopulation(stateDataOld, stateDataNew) {
        if(stateDataOld.alpha3Code === stateDataNew.alpha3Code) {
            if(stateDataOld.population !== stateDataNew.population) {
                // console.log('liczba ludności zmieniła się w: ', stateDataOld.name);
                this.tableAfterComparison.push(stateDataOld.name);
                return ;
            } 
        } 
    }

    // pętla po starym zestawie danych
    loopForOldData(oldData, newData) {
        for(let i = 0; i< oldData.length; i++) {
            newData.find(el => this.comparePopulation(el, oldData[i]));
        }
        return (this.tableAfterComparison.length > 0) 
                ? console.log('Od ostatniego pobrania z API zmieniła się liczba ludności w krajach: ', this.tableAfterComparison) 
                : console.log('Od ostatniego pobrania z API nie zmieniła się liczba ludności w żadnym kraju.');
    }
}

const tableWithStates = new TableWithStates();

// klasa od localStorage; oddzielne metody do zapisu i odczytu danych o państwach oraz daty pobrania z API
class Storage {
    getStorageStates() {
        let states = null;
        if(localStorage.getItem('states') !== null ) {
            states = JSON.parse( localStorage.getItem('states') );
        } else {
            states = [];
        }
        // console.log('Dane państw zapisane w localStorage: ', states);
        return states;
    }

    saveStorageStates(states) {
        localStorage.setItem('states', JSON.stringify(states));
    }

    getStorageDate() {
        let date = null;
        if(localStorage.getItem('date') !== null ) {
            date = localStorage.getItem('date');
        } else {
            date = [];
        }
        // console.log('Data pobrania z API zapisana w localStorage (w ms): ', date);
        return date;
    }

    saveStorageDate(date) {
        localStorage.setItem('date', date);
    }
}

const storage = new Storage();