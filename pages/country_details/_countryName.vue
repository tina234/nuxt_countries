<template>
    <div>
        <Header/>
        <Loader/>
        <div class="container">
            <div class="main-box">
                <div @click="$router.go(-1)" class="btn-back">
                    <p>Back</p>
                </div>
                <div class="country-container" v-if="Object.keys(country).length > 0">
                    <div class="img-box">
                        <img :src="country.flags.svg" alt="">
                    </div>
                    <div class="country-info">
                        <h1>{{ country.name.common }}</h1>
                        <div class="two-colums">
                            <div class="first-column">
                                <p v-if="country.name.nativeName">Native Name: <span>{{ Object.values(country.name.nativeName)[0].common }}</span></p>
                                <p>Population: <span>{{ formatNumber(country.population) }}</span></p>
                                <p>Region: <span>{{ country.region }}</span></p>
                                <p>Sub Region: <span>{{ country.subregion }}</span></p>
                                <p v-if="country.capital">Capital: <span>{{ country.capital[0] }}</span></p>
                            </div>
                            <div class="second-column">
                                <p>Top Level Domain: <span v-for="topLevelDomain in country.tld" :key="topLevelDomain">{{ topLevelDomain }}</span></p>
                                <p>Currencies: <span v-for="currency in country.currencies" :key="currency.name">{{ currency.name }}</span></p>
                                <p>Languages: 
                                    <span v-for="(language, index) in country.languages" :key="language">
                                        <span v-if="Object.keys(country.languages).indexOf(index) != 0">, </span>{{ language }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
    data () {
        return {
        }
    },

    computed: {
        ...mapGetters({
            country: 'getCountry',
        }),
    },

    methods: {
        ...mapMutations(['findCountryByName']),
        ...mapActions(['fetchAllCountries']),

        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }
    },

    async mounted(){
        if(this.$store.state.original_countries.length < 1){
            this.fetchAllCountries();
        }
        this.findCountryByName(this.$route.params.countryName);
        console.log(this.country);
        
    }
}
</script>

<style lang="sass">
    @import "../../assets/css/main.scss";
</style>