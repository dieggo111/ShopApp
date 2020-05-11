<template>
    <div class="app">
        <b-navbar variant="info" type="dark">
            <b-navbar-brand tag="h1" class="mb-0">The Fruit Shop</b-navbar-brand>
            <b-navbar-nav class="nav">
                <b-nav-item v-if="!loggedIn" class="nav-item" href="/login">Shop</b-nav-item>
                <b-nav-item v-if="loggedIn" class="nav-item" href="/shop">Shop</b-nav-item>
                <b-nav-item class="nav-item" href="#">Shopping Cart</b-nav-item>
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
    mounted(){
        this.fetchItems()
        // this.$eventBus.$on("addItem", (idx) => this.updateCart(idx))
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
                    console.log(this.addUtilityItems(res));
                    this.$store.commit(
                        "setShopItems", this.addUtilityItems(res));
                    this.prepareCart(res);
                })
                .catch(error => {
                    console.log(error)
                })
        },
        addUtilityItems(items){
            for (let i in items) {
                items[i]["add"] = ""
                items[i]["quantity"] = 1
            }
            return items
        },
        getItemNames(items){
            var itemNames = []
            for (let i in items) {
                itemNames.push(items[i].name)
            }
            // console.log("getItemNames")
            // console.log(itemNames)
            this.$store.commit("setItemNames", itemNames)
            return itemNames
        },
        prepareCart(items){
            var itemNames = this.getItemNames(items);
            var cart = {};
            for (let i in itemNames) {
                cart[itemNames[i]] = 0
            }
            // console.log("prepareCart");
            // console.log(cart);
            this.$store.commit("initCart", cart);
        }
    }
}
</script>

<style lang="sass" scoped>
@import './_styles.sass'
</style>
