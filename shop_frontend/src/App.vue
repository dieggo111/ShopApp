<template>
    <div class="app">
        <b-navbar class="navbar" fixed="top" variant="info" type="dark">
            <b-navbar-brand  tag="h1" class="mb-0" href="/shop">The Fruit Shop</b-navbar-brand>
            <b-navbar-nav class="nav">
                <b-nav-item class="nav-item" href="/signup">Sign Up</b-nav-item>
                <b-nav-item v-if="loggedIn" class="nav-item" href="/logout">Logout</b-nav-item>
                <b-nav-item v-if="!loggedIn" class="nav-item" href="/login">Login</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: 'App',
    data(){
        return{
            auth: false,
        };
    },
    created(){
        this.fetchItems()
    },
    computed: {
        loggedIn() {
            return this.$store.getters.loggedIn
        }
    },
    methods:{
        fetchItems(){
            fetch('http://localhost:12345/items')
                .then(res => res.json())
                .then(res => {
                    this.$store.commit(
                        "setShopItems", this.addUtilityItems(res))
                    this.prepareCart(res)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        addUtilityItems(items){
            for (let i in items) {
                items[i]["add"] = ""
                items[i]["quantity"] = 0
            }
            return items
        },
        getNameList(items){
            var nameList = []
            for (let i in items) {
                nameList.push(items[i].name)
            }
            this.$store.commit("setNameList", nameList)
            return nameList
        },
        getPriceList(items) {
            var priceList = {}
            for (let i in items) {
                priceList[items[i].name] = items[i].price
            }
            this.$store.commit("setPriceList", priceList)
            return priceList
        },
        prepareCart(items){
            this.getNameList(items)
            this.getPriceList(items)
            var cart = {}
            for (let i in items) {
                cart[items[i].name] = {
                    "name": items[i].name,
                    "price": items[i].price,
                    "quantity": 0,
                }
            }
            this.$store.dispatch("initCart", cart)
            this.$store.commit("setDefaultQuantities", cart)
        }
    }
}
</script>

<style lang="sass" scoped>
@import './_styles.sass'
</style>
