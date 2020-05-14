<template>
    <b-container class="login-box">
        <h2>Check Out</h2>
        <hr>
            <table class="table">
                <thead>
                    <tr><th>Item</th><th>Quantity</th><th>Price per Item</th><th>Total</th></tr>
                </thead>
                <tbody>
                    <tr :key="item.name" v-for="item in getShoppingList">
                        <td>{{ item.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.price | euros }}</td>
                        <td>{{ item.total | euros }}</td>
                    </tr>
                    <tr></tr>
                    <!-- <tr :key="item.name" v-for="item in getShoppingList"> -->
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    <!-- </tr> -->
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>{{ totalAmount | euros }}</th>
                    </tr>
                </tbody>
            </table>
    </b-container>
</template>


<script>
import Discounts from "../discounts"
import utils from "../utils"
import { euros } from "../filters"

export default {
    name: "Checkout",
    data() {
        return {
            discounts : new Discounts()
        }
    },
    filters: {
        euros
    },
    mounted() {
        this.applyDiscounts()
    },
    computed: {
        totalAmount() {
            return utils.roundToTwo(
                utils.extractTotal(this.$store.getters.getCartContent))
        },
        getShoppingList() {
            return this.$store.getters.getShoppingList
        }
    },
    methods: {
        totalRowAmount(price, quantity) {
            return utils.roundToTwo(price*quantity)
        },
        // getShoppingList() {
        //     var shoppingList =
        //         this.discounts.extractSets(this.$store.getters.getShoppingList)
        //     console.log(this.discounts.volumeDiscountApplied)
        //     console.log(this.discounts.setDiscountApplied)
        //     return shoppingList
            // return this.$store.getters.getShoppingList
        // }
        applyDiscounts() {
            console.log(this.discounts.volumeDiscountApplied)
            this.$store.commit("setShoppingList", this.discounts.extractSets(
                this.$store.getters.getShoppingList)
            )
            this.$store.commit("setShoppingList", this.discounts.volumeDiscount(
                this.discounts.calcItemTotal(this.$store.getters.getShoppingList))
            )
        }
    }
}
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>