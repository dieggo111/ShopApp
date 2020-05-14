<template>
    <div class="items-table">
        <h2>Shop</h2>
        <hr>
        <b-container class="offers-box">
            <discount-component></discount-component>
        </b-container>

        <b-container class="cart-box">
            <shopping-cart-component></shopping-cart-component>
        </b-container>

        <b-container class="table-box">
            <b-table id="table" striped hover :items="getItems">
                <template v-slot:cell(image)="{value}">
                    <img :src="`${value}`" width="100px">
                </template>
                <template v-slot:cell(add)="{item}">
                    <b-button v-on:click="add($event, item.name)">+</b-button>
                </template>
                <template v-slot:cell(quantity)="{item}">
                    <b-form-input v-model.number="quantities[item.name]"
                    class="counter" type="number" value="setDefaultValues()"
                    min="0" max="999"></b-form-input>
                </template>
            </b-table>
            <b-pagination v-model="currentPage" :total-rows="rows"
                        :per-page="perPage" aria-controls="table">
            </b-pagination>
        </b-container>
    </div>
</template>

<script>
import ShoppingCartComponent from './ShoppingCartComponent.vue';
import DiscountComponent from './DiscountComponent.vue';

export default {
    name: "Shop",
    components: {
        "shopping-cart-component": ShoppingCartComponent,
        "discount-component": DiscountComponent

    },
    data(){
        return{
            columns: ["Name", "Price", "Image", "Description", "Buy"],
            currentPage: 1,
            perPage: 10,
            rows: 5,
            quantities: {},
        };
    },
    mounted() {
        this.setQuantities()
    },
    computed: {
        getItems() {
            return this.$store.getters.getItems
        },
        getImage() {
            return this.offersApples
        }
    },
    methods: {
        addToCart(key){
            var quantity = this.quantities[key]
            this.$store.commit("addToCart", {key, quantity})
        },
        setQuantities() {
            this.quantities = this.$store.state.defaultQuantities
        },
        adjust() {
            return "../images/apple.jpg"
        },
        storeCart() {
            this.$store.dispatch("storeCart")
        },
        add(event, key) {
            this.addToCart(key)
            this.storeCart()
        }
    }
};

</script>

<style lang="sass" scoped>
@import '../_styles.sass'
h2
    text-align: center
</style>
