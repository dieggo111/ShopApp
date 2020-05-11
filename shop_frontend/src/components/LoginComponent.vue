<template>
    <b-container class="login-box">
        <h2>Login</h2>
        <b-form class="form" @submit.prevent="login">
            <label for="feedback-user">Username</label>
            <b-input v-model="username" :state="validate" id="feedback-user"></b-input>
                <b-form-invalid-feedback :state="validate">
                </b-form-invalid-feedback>
            <label for="feedback-user">Password</label>
            <b-input v-model="password" :state="validate" id="feedback-user"></b-input>
                <b-form-invalid-feedback :state="validate">
                    Username and/or password are not correct.
                </b-form-invalid-feedback>
            <b-button type="submit" class="login-button" variant="primary" block>Login</b-button>
        </b-form>
    </b-container>
</template>


<script>
export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            checkInput: false,
        }
    },
    computed: {
        validate() {
            if (this.username != "" || this.password != "") {
                return null
            }
            return this.checkInput
        }
    },
    methods: {
        login() {
            this.$store.dispatch("retrieveToken", {
                    name: this.username,
                    pwd: this.password}
            )
            .then(
                this.$router.push("/shop")
            )
        }

    }
};
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>