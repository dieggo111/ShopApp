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
                <tr></tr>
            </tbody>
            <thead>
                <tr><th>Discounts</th><th></th><th></th><th></th></tr>
            </thead>
            <tbody>
                <tr :key="discount.type" v-for="discount in getDiscountList">
                    <td>{{ discount.type }}</td>
                    <td>{{ discount.quantity }}</td>
                    <td>{{ discount.price | euros }}</td>
                    <td>{{ discount.discount | euros }}</td>
                </tr>
                <tr :key="coupon.type" v-for="coupon in getCouponList">
                    <td>{{ coupon.type }}</td>
                    <td>{{ coupon.quantity }}</td>
                    <td>{{ coupon.price | euros }}</td>
                    <td>{{ coupon.discount | euros }}</td>
                </tr>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                <tr class="tr-bordered"></tr>
                    <th>Total</th>
                    <th></th>
                    <th></th>
                    <th> {{ this.getTotalAmount() | euros }}</th>
            </tbody>
        </table>

        <template>
            <b-button class="coupon-button" variant="primary"
            @click="$bvModal.show('coupon-modal');getCoupon()">Redeem coupon</b-button>
            <b-button class="purchase-button" variant="primary"
            @click="$bvModal.show('purchase-modal');checkPayment()">Purchase items</b-button>
        </template>

        <b-modal id="purchase-modal" :title="forPurchaseModal">
            <template v-if="getPaymentStatus">
                <p>Transaction completed. Thank you for shopping.</p>
                <p><b>Total price: {{ this.getTotalAmount() | euros }}</b></p>
                <p><b>Total savings: {{ this.getTotalSavings() | euros }}</b></p>
                <template v-if="isExpired()">
                    <p>(Your coupon has expired)</p>
                </template>
            </template>
            <template v-else>
                Transaction failed.
            </template>

            <template v-slot:modal-footer>
                <b-button @click="resetCart" variant="primary"
                    href="/shop">Back to shop</b-button>
            </template>
            <!-- <b-button @click="resetCart" variant="danger"
                href="/shop">Cancel purchase</b-button>
            </template> -->
        </b-modal>

        <b-modal id="coupon-modal" title="Coupon redeemed">
            <!-- <template v-slot:default> -->
            <template v-if="!this.isExpired()">
                Reviece a bonus discount for a limited amount of time.
            </template>
            <template v-else>
                You already redeemed your coupon.
            </template>
            <template v-slot:modal-footer>
                <b-button @click="$bvModal.hide('coupon-modal')">OK</b-button>
            </template>
        </b-modal>
        <!-- <b-modal id="expired-modal" title="Coupon expired">
            <template v-slot:default>
                Unfortunately, your coupon has expired.
            </template>
            <b-button @click="$bvModal.hide('cart-modal')">OK</b-button>
        </b-modal> -->
    </b-container>
</template>


<script>
import Discounts from "../discounts"
import utils from "../utils"
import { euros } from "../filters"
import jwt from "jsonwebtoken"

export default {
    name: "Checkout",
    data() {
        return {
            discounts : new Discounts(),
            discountList: [],
            couponList: [],
            payment: false,
        }
    },
    filters: {
        euros
    },
    created() {
        this.$store.commit("setShoppingList", this.discounts.calcItemTotal(
                this.$store.getters.getShoppingList))
    },
    mounted() {
        this.applyDiscounts()
    },
    computed: {
        forPurchaseModal () {
            if (this.payment) {return "Purchase successful"}
            else {return "Purchase not successful"}
        },
        getShoppingList() {
            return this.$store.getters.getShoppingList
        },
        getDiscountList() {
            return this.discountList.filter(item => item.discount != 0)
        },
        getCouponList() {
            return this.couponList.filter(item => item.discount != 0)
        },
        getPaymentStatus() {
            return this.payment
        },
    },
    methods: {
        getTotalAmount() {
            var sum = 0
            this.$store.getters.getShoppingList.forEach( item => {
                sum += item.total
            })
            return utils.roundToTwo(sum)
        },
        getTotalSavings() {
            var sum = 0
            this.discountList.forEach( item => {
                sum += item.discount
            })
            if (!this.isExpired()) {
                this.couponList.forEach( item => {
                    sum += item.discount
                })
            }
            return utils.roundToTwo(sum)

        },
        applyDiscounts() {
            this.discountList.push(
                this.discounts.extractSets(this.$store.getters.getShoppingList))
            this.discountList.push(
                this.discounts.volumeDiscount(this.$store.getters.getShoppingList))
        },
        applyCoupon() {
            this.couponList.push(
                    this.discounts.volumeDiscount(
                        this.$store.getters.getShoppingList, "Orange", 1, 0.7))
        },
        resetCart() {
            // console.log("reset")
            this.$store.dispatch("resetShop")
        },
        checkPayment() {
            this.$store.dispatch("checkPayment")
                .then(res => {
                    this.payment = true
                    return res
                })
                .catch(error => {
                    console.log("Response: ", error)
                    this.payment = false
                })
        },
        getCoupon() {
            if (this.isExpired() === false) {
                this.$store.dispatch(
                    "getCoupon",
                    jwt.decode(this.$store.getters.getAccessToken).username
                )
                .then(res => {
                    this.payment = res
                    this.applyCoupon()
                    return res
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        isExpired() {
            try {
            var expirationDate = new Date(
                jwt.decode(this.$store.getters.getCouponToken).exp * 1000)
            if (expirationDate < Date.now()) {
                return true
            }
            return false
            } catch {
                return false
            }
        },

    }
}
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>