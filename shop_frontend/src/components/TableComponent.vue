<template>
    <div class="items-table">
        <h2>Shop</h2>
        <hr>
        <b-table id="table" striped hover :items="items">
            <template v-slot:cell(image)="{value}">
                <!-- <v-img :src="value" width="100px"></v-img> -->
                {{value}}
            </template>
            <template v-slot:cell(add)="row">
                <b-button v-on:click="addItem(row.index)">+</b-button>
            </template>
        </b-table>
        <b-pagination v-model="currentPage" :total-rows="rows"
                      :per-page="perPage" aria-controls="table">
        </b-pagination>
    </div>
</template>

<script>

export default {
    name: "ItemsTable",
    props: ["items"],
    data(){
        return{
            columns: ["Name", "Price", "Image", "Description", "Buy"],
            currentPage: 1,
            perPage: 10,
            rows: 5
        };
    },
    methods:{
        addItem(idx){
            this.$emit('addItem', idx);
        }
    }
};
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
h2
    text-align: center
</style>
