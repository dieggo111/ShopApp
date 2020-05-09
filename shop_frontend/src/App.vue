<template lang="pug">
    <div class="app">
        <header>The Fruit Shop</header>
        <hr>
        <div class="main" v-if="auth == true">
            <TableComponent v-bind:items="items" @addItem="updateCart"/>
            <CartComponent v-bind:cart="cart"/>
        </div>
        <div class="auth" v-if="auth == false">
            <AuthComponent/>
        </div>
    </div>
</template>

<script>

import TableComponent from './components/TableComponent.vue'
import CartComponent from './components/CartComponent.vue'
import AuthComponent from './components/AuthComponent.vue'

export default {
    name: 'App',
    components: {
        TableComponent,
        CartComponent,
        AuthComponent,
    },
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
                    });

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
