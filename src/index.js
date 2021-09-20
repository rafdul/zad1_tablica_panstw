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
    tableAfterComparison =[];

    init() {
        if(this.ifDownloadFromApi(storage.getStorageDate()) == false && this.loadFromLocalStorageStates().length > 0) {
            console.log('pobranie z localstorage; lenght:' + this.loadFromLocalStorageStates().length);
            this.loadFromLocalStorageStates();
        } else {
            console.log('pobranie z serwera');
            this.downloadFromAPI();
        }
    }

    // pobranie danych z API; zapisanie w local storage pobranych danych i timestamp pobrania
    downloadFromAPI() { 
        fetch(this.url)
            .then(response => {
                response.json().then(data => {
                    console.log('data from api:', data);

                    this.loopForOldData(storage.getStorageStates(), data);

                    let time = new Date();
                    this.dateDownloadFromApi = time.getTime();
                    storage.saveStorageDate(this.dateDownloadFromApi);

                    storage.saveStorageStates(data);
                })
            })
        
    }

    // pobieranie z localStorage zapisanych danych państw
    loadFromLocalStorageStates() {
        let listFromStorage = storage.getStorageStates();
        return listFromStorage;
    }

    // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)
    ifDownloadFromApi(timeSavingInLocalStorage) {
        const MS_IN_6DAYS = 6*24*60*60*1000;
        const timeNow = (new Date).getTime();
        const difference = timeNow - timeSavingInLocalStorage;

        if(difference <= 30000) {
            console.log('od ostatniego pobrania upłynęło mało czasu i korzystam z localstorage')
            return false;
        } else {
            console.log('od ostatniego pobrania upłynęło za dużo czasu i pobieram z API')
            return true;
        }
    }

    // porównanie populacji z dwóch zbiorów danych
    comparePopulation(stateDataOld, stateDataNew) {
        if(stateDataOld.alpha3Code === stateDataNew.alpha3Code) {
            if(stateDataOld.population !== stateDataNew.population) {
                console.log('zmiana w populacji dla: ', stateDataOld.name);
                this.tableAfterComparison.push(stateDataOld.name);
                return ;
            } 
        }
    }

    // pętla po starym zestawie danych
    loopForOldData(oldData, newData) {
        for(let i = 0; i< oldData.length; i++) {
            console.log('iteracja po oldData');
            newData.find(el => this.comparePopulation(el, oldData[i]));
        }
    }
}

const tableWithStates = new TableWithStates();

// klasa od localStorage; oddzielne metody do zapisu i odczytu danych o państwach oraz daty pobrania z API
class Storage {
    getStorageStates() {
        let states = null;
        if(localStorage.getItem('states') !== null ) {
            states = JSON.parse( localStorage.getItem('states') );
            console.log('states z local 1:', states);
        } else {
            states = [];
            console.log('states z local 2:', states);
        }
        return states;
    }

    saveStorageStates(states) {
        localStorage.setItem('states', JSON.stringify(states));
        console.log('zapisanie states w storage');
    }

    getStorageDate() {
        let date = null;
        if(localStorage.getItem('date') !== null ) {
            date = localStorage.getItem('date');
            console.log('date z local 1:', date);
        } else {
            date = [];
            console.log('date z local 2:', date);
        }
        return date;
    }

    saveStorageDate(date) {
        localStorage.setItem('date', date);
        console.log('zapisanie date w storage', date);
    }
}

const storage = new Storage();