import axios from 'axios'

export const state = () => ({
    original_countries: [],
    countries: [],
    country: {},
    error: '',
    loading: true,
});

export const getters = {
    getCountries(state){
        return state.countries;
    },

    getCountry(state){
        return state.country;
    },

};

export const mutations = {
    saveAllCountries(state, countries){
        state.original_countries = countries;
        state.countries = countries;
        state.loading = false;
    },
    
    saveOneCountry(state, country){
        state.country = country[0];
    },

    saveCountriesByRegion(state, region_countries){
        state.original_countries = region_countries;
    },

    findCountryByName(state, countryName){
        this.commit('changeLoadingStatus'); 
        state.original_countries.find( country => {
            if(country.name.common == countryName){
                state.country = country;
            }
        });
        setTimeout(() => {
            this.commit('changeLoadingStatus');
        }, 700);
    },

    searchForCountry(state, payload){   
        this.commit('changeLoadingStatus');       /*payload zamjenjuje ostale parametre*/
        let region = payload.selected_region;
        let countryName = payload.search_query;
        let searched_countries = [];       /* array za spremanje svih zemalja iz određene regije npr zemlje Europe*/
        let searched_countries_name = [];  

         /*ako je regija odabrana pronađi sve zemlje iz nje i spremi u searced_countries array*/
        if((region != '' && region != 'all')){
            state.original_countries.find(country => {
                if(region.toLowerCase() == country.region.toLowerCase()){
                    searched_countries.push(country);
                }
            });
        }else{
            searched_countries = state.original_countries; /*ako nije obabrana regija ili je na 'all' vrati sve zemlje*/
        }
        /*traženje određene zemlje nakon štoo smo dobili zemlje iz dabrane regije npr Europe*/
        if(countryName.length > 2){        
            searched_countries.find(country => {
                if(country.name.common.toLowerCase().includes(countryName.toLowerCase())){
                    searched_countries_name.push(country);
                }
            });
        }
        /*pretraga zemlje kada nije obabrana regija*/
        if(countryName.length > 2){
            state.countries = searched_countries_name;
        }else{
            state.countries = searched_countries;
        } 
        setTimeout(() => {
            this.commit('changeLoadingStatus');
        }, 700);
    },

    changeLoadingStatus(state){
        state.loading = !state.loading;
    }
};

export const actions = {
    async fetchAllCountries({commit}){
        try {
            //ako nemam spremljeno u localStorage onda pozivam api, a ako imam spremljeno onda uzimam sve iz localStorage-a
            //tako bi trebalo prilagoditi i ostale funkcije
            if(localStorage.getItem('original_countries') == null){
                //vracalo nam je gresku 500 jer si nakon all stavila / pa je biloa all/? a njima to ne paše nego mora biti all?
                let response = await axios.get ('https://restcountries.com/v3.1/all');
                commit('saveAllCountries', response.data);
                //json stringify nam sluzi da nam se ovi podatci spreme u string
                //nije moguce drugacije spremiti podatke u localStorage nego da bude string
                localStorage.setItem('original_countries', JSON.stringify(response.data));
            }else{
                //json parse nam sluzi da pročitamo json string koji smo spremili, da dobijemo json objekt s kojim mozemo raditi
                commit('saveAllCountries', JSON.parse(localStorage.getItem('original_countries')));
            } 
        }catch(e) {
            console.log(e);
        } 
    },
    /*
    async fetchOneCountry({commit}, countryName){
        try {
            let response = await axios.get('https://restcountries.eu/rest/v2/name/' + countryName);
            commit('saveOneCountry', response.data);
        }catch(e) {
            console.log(e);
        }    
    },

    fetchCountriesByRegion({commit}, region){
        try {
            let response = axios.get('https://restcountries.eu/rest/v2/region/' + region);
            commit('saveCountriesByRegion', response.data);
        }catch(e) {
            console.log(e);
        }      
    },*/
};







