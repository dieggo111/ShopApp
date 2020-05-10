<template>
    <div class="app">
        <b-navbar variant="info" type="dark">
            <b-navbar-brand tag="h1" class="mb-0">The Fruit Shop</b-navbar-brand>
            <b-navbar-nav>
                <b-nav-item class="nav-item" href="/shop">Shop</b-nav-item>
                <b-nav-item class="nav-item" href="#">Shopping Cart</b-nav-item>
                <b-nav-item class="nav-item" href="/login">Log In</b-nav-item>
                <b-nav-item class="nav-item" href="/signup">Sign Up</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <router-view :items="items" @addItem="updateCart"></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data(){
        return{
            items: [],
            item_IDs: [],
            cart: {},
            auth: false
        };
    },
    created(){
        this.fetchItems()
    },
    methods:{
        fetchItems(){
            fetch('http://localhost:12345/items')
                .then(res => res.json())
                .then(res => {
                    // console.log(res);
                    this.items = res;
                    this.adjustItems();
                    this.setCart(res);
                })
                .catch(error => {
                    console.log(error)
                })
        },
        adjustItems(){
            for (let i in this.items) {
                this.items[i]["add"] = ""
            }
        },
        setItemIDs(list){
            for (let i in list) {
                this.item_IDs.push(list[i].name)
            }
        },
        setCart(list){
            this.setItemIDs(list);
            for (let i in this.item_IDs) {
                this.cart[this.item_IDs[i]] = 0
            }
            console.log(this.cart);
        },
        updateCart(idx){
            this.cart[this.item_IDs[idx]] += 1
            console.log(this.cart);
        }
    }
}
</script>

<style lang="sass" scoped>
@import './_styles.sass'
</style>
