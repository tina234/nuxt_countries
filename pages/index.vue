<template>
    <div>
        <Header/>
        <Loader/>
        <div class="container">
            <div class="main-box">
                <div class="search-box">
                    <div class="search-bar">
                        <input type="text" placeholder="Search for a country.." v-model="search_query" @keyup.enter="submitSearch()">
                        <span @click="submitSearch()"></span>
                    </div>
                    <div class="costum-select">
                        <p class="region-name">{{ selected_region_text }}</p>
                        <select name="regions" v-model="selected_region" @change="submitSearch()">
                            <option value="all">All</option>
                            <option value="europe">Europe</option>
                            <option value="asia">Asia</option>
                            <option value="oceania">Oceania</option>
                            <option value="africa">Africa</option>
                            <option value="americas">Americas</option>
                        </select>
                    </div>
                </div>
                <div class="countries-box">
                    <li class="country-item"
                        v-for="country in countries" 
                        :key="country.name.common">
                        <nuxt-link :to="'/country_details/' + country.name.common">
                            <img :src="country.flags.svg" alt="">
                            <div>
                                <h2>{{ country.name.common }}</h2>
                                <p>Population: <span>{{ formatNumber(country.population) }}</span></p>
                                <p>Region: <span>{{ country.region }}</span></p>
                                <p v-if="country.capital">Capital: <span>{{ country.capital[0] }}</span></p>
                            </div>            
                        </nuxt-link>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
    data (){
        return {
            search_query: '',
            selected_region: '',
            selected_region_text: 'Filter by region',
        }
    },

    computed: {
        ...mapGetters ({
            countries: 'getCountries', 
        }),
    },

     watch: {
        selected_region: function (new_region, old_region) {
             this.selected_region_text = this.selected_region.charAt(0).toUpperCase() + this.selected_region.slice(1);
        }
    },

    methods: {
        ...mapActions(['fetchAllCountries']),
        ...mapMutations(['searchForCountry']),

        submitSearch(){
            let query_obj = {};
            if(this.search_query.length > 0){
                query_obj['name'] = this.search_query;
            }

            if(this.selected_region.length > 0){
                query_obj['region'] = this.selected_region;
            }

            this.$router.push({ path:'/', query:query_obj });

            
            let search_obj = {
                'selected_region': this.selected_region,
                'search_query': this.search_query,
            }
            
            this.searchForCountry(search_obj);
        },

        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }
    },

    async mounted() {
        await this.fetchAllCountries();
    
        if('name' in this.$route.query){
            this.search_query = this.$route.query.name;
        }
       
        if('region' in this.$route.query){
            this.selected_region = this.$route.query.region;
        }

        let search_obj = {
            'selected_region': this.selected_region,
            'search_query': this.search_query,
        }
        this.searchForCountry(search_obj);
    },
};

</script>

<style lang="sass">
    @import "../assets/css/main.scss";
</style>
