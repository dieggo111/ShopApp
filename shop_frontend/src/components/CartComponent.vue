<template>
    <div class="cart">
        <b-button v-b-toggle.sidebar-right>Show Shopping Cart</b-button>
            <b-sidebar id="sidebar-right" title="Shopping Cart" right shadow>
                <div class="cart-content">
                    My Shopping Cart
                </div>
            </b-sidebar>
    </div>
</template>

<script>
export default {
    name: "Cart",
    props: ["cart"],
    data(){
        return{
        };
    },
    methods:{
    }
};
</script>

<style lang="sass" scoped>

</style>