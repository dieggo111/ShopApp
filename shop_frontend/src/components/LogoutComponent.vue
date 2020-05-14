<template>
<div></div>
</template>


<script>
export default {
    created() {
        this.$store.dispatch("resetShop")
        this.$store.dispatch("destroyToken")
        .then(this.$router.push("/login"))
    }
}
</script>