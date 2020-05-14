<template>
    <div>
        <b-button class="cart-button" variant="primary"
        @click="$bvModal.show('cart-modal')">Shopping Cart ({{amountInCart}})</b-button>
        <b-modal id="cart-modal" title="Shopping Cart">
            <template v-slot:default>
                <table class="table">
                    <thead>
                        <th>Item</th><th>Quantity</th><th>Price per Item</th><th></th>
                    </thead>
                    <tbody>
                        <tr :key="item.name" v-for="item in getCartContent">
                            <td>{{ item.name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.price | euros }}</td>
                            <td><b-button class="btn btn-sm btn-danger"
                            v-on:click="removeFromCart(item.name)">&times;</b-button></td>
                        </tr>
                        <tr></tr>
                        <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        </tr>
                    </tbody>
                </table>
                <b>Total Amount: {{ totalAmount | euros }}</b>
            </template>
            <template v-slot:modal-footer>
                <b-button v-on:click="$bvModal.hide('cart-modal')">Keep shopping</b-button>
                <b-button v-on:click="storeCart" variant="primary"
                href="/checkout">Check out &amp; Apply discounts</b-button>
            </template>
        </b-modal>

    </div>
</template>

<script>
import { euros } from "../filters"
import utils from "../utils"

export default {
    name: "ShoppingCartComponent",
    filters: {
        euros,
    },
    created() {
        this.$store.dispatch("initCart")
    },
    computed: {
        amountInCart() {
            return this.$store.getters.amountInCart
        },
        getCartContent() {
            console.log("getCartContent")
            console.log(this.$store.getters.getCartContent)
            return this.$store.getters.getCartContent
        },
        totalAmount() {
            return utils.roundToTwo(
                utils.extractTotal(this.$store.getters.getCartContent))
        },
    },
    methods: {
        storeCart() {
            this.$store.dispatch("storeCart")
        },
        removeFromCart(key) {
            this.$store.commit("removeFromCart", key)
            this.$store.dispatch("storeCart", key)
        }
    }
};
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>