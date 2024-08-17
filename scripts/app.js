const app = Vue.createApp({
    data() {
        return {
            studentName: 'Mehardeep Singh',
            randomFact: '',
            weather: { 
                temperature: "23 °C",
                wind_speed: "17 km/h",
                description: "Overcast",
                location: {
                    city: "Toronto",
                    region: "Ontario",
                    country: "Canada",
                    latitude: "43.667",
                    longitude: "-79.417",
                    population: "4612191"
                }
            },
            city: 'London, Ontario',
            dictionary: {},
            searchWord: 'bottle'
        };
    },
    computed: {
        fullLocation() {
            return`${this.weather.location.city}, ${this.weather.location.region}, ${this.weather.location.country}`;
        }
    },
    created() {
        this.asyncgetWeather();
        this.asyncgetRandomFact();
        this.asyncgetDefinition();
    },
    methods: {
        async asyncgetWeather() {
            const weatherUrl = 'https://goweather.herokuapp.com/weather/London%20Ontario';
            try {
                if (this.city.toLowerCase() === 'toronto') {
                    this.weather = {
                        temperature: "23 °C",
                        wind_speed: "17 km/h",
                        description: "Overcast",
                        location: {
                            city: "Toronto",
                            region: "Ontario",
                            country: "Canada",
                            latitude: "43.667",
                            longitude: "-79.417",
                            population: "4612191"
                        }
                    };
                } else {
                    const response = awaitfetch(weatherUrl);
                    if (!response.ok) {
                        thrownewError('Failed to retrieve weather data');
                    }
                    const data = await response.json();
                    this.weather = {
                        temperature: `${data.current.temp_c} °C`,
                        wind_speed: `${data.current.wind_kph} km/h`,
                        description: data.current.condition.text,
                        location: {
                            city: data.location.name,
                            region: data.location.region,
                            country: data.location.country,
                            latitude: data.location.lat,
                            longitude: data.location.lon,
                            population: 'N/A'
                        }
                    };
                }
            } catch (error) {
                console.error('Weather data retrieval failed:', error);
            }
        },
        async asyncgetRandomFact() {
            try {
                const response = awaitfetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
                if (!response.ok) {
                    thrownewError('Failed to retrieve random fact');
                }
                const data = await response.json();
                this.randomFact = data.text;
            } catch (error) {
                console.error('Random fact retrieval failed:', error);
            }
        },
        async asyncgetDefinition() {
            try {
                const response = awaitfetch('https://api.dictionaryapi.dev/api/v2/entries/en/Bottle');
                if (!response.ok) {
                    thrownewError('Failed to retrieve word definition');
                }
                const data = await response.json();
                const entry = data[0];
                this.dictionary.word = entry.word;
                this.dictionary.phonetic = entry.phonetic || 'N/A';
                this.dictionary.partOfSpeech = entry.meanings[0].partOfSpeech;
                this.dictionary.definition = entry.meanings[0].definitions[0].definition;
            } catch (error) {
                console.error('Word definition retrieval failed:', error);
            }
        }
    }
});

app.mount('#app');
