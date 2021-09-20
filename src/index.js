/**
 * Ściągnij wszystkie możliwe dane państw z pomocą API: https://restcountries.eu/. W dalszej części kursu będą one nazywane Tablicą Państw (TP).
 * Ściągnięte dane zapisz w sposób, który pozwoli na ich ponowne wykorzystanie po zamknięciu i ponownym otwarciu przeglądarki,
 * 
 * Przy starcie aplikacji sprawdź, czy dane państw istnieją w pamięci przeglądarki. Jeśli nie, ściągnij je,
 * Przy starcie aplikacji sprawdź ile czasu minęło od poprzedniego ściągnięcia danych państw. 
 * Jeśli od ostatniego razu minęło co najmniej 7 dni, ściągnij i zapisz je ponownie.
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

    init() {
        // const MS_IN_6DAYS = 6*24*60*60*1000;
        // const timeSavingInLocalStorage = storage.getStorageDate()
        // const timeNow = (new Date).getTime();
        // const timeFromLastDownloadFromApi = timeNow - timeSavingInLocalStorage;

        // if(this.loadFromLocalStorageStates().length > 0 && timeFromLastDownloadFromApi < MS_IN_6DAYS) {
        //     console.log('pobranie z localstorage; lenght:' + this.loadFromLocalStorageStates().length);
        //     // console.log('testowe pobranie: ' + this.loadFromLocalStorageStates()[5].name);
        //     console.log('czas od załądowania z api (w ms): ' + timeFromLastDownloadFromApi);
        //     this.loadFromLocalStorageStates();
        // } else {
        //     console.log('pobranie z serwera');
        //     this.downloadFromAPI();
        // }


        if(this.ifDownloadFromApi(storage.getStorageDate()) == false && this.loadFromLocalStorageStates().length > 0) {
            console.log('pobranie z localstorage; lenght:' + this.loadFromLocalStorageStates().length);
            // console.log('testowe pobranie: ' + this.loadFromLocalStorageStates()[5].name);
            console.log('czas od załądowania z api < 7 dni ');
            this.loadFromLocalStorageStates();
        } else {
            console.log('pobranie z serwera');
            this.downloadFromAPI();
        }

        // this.downloadFromAPI();
    }

    downloadFromAPI() { 
        fetch(this.url)
            .then(response => {
                response.json().then(data => {
                    console.log('data from api:', data);
                    let time = new Date();
                    this.dateDownloadFromApi = time.getTime();

                    storage.saveStorageStates(data);
                    storage.saveStorageDate(this.dateDownloadFromApi);
                })
            })
        
    }

    loadFromLocalStorageStates() {
        let listFromStorage = storage.getStorageStates();
        return listFromStorage;
    }

    ifDownloadFromApi(timeSavingInLocalStorage) {
        const MS_IN_6DAYS = 6*24*60*60*1000;
        const timeNow = (new Date).getTime();
        const difference = timeNow - timeSavingInLocalStorage;

        if(difference <= MS_IN_6DAYS) {
            return false;
        } else {
            return true;
        }
    }
}

const tableWithStates = new TableWithStates();

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