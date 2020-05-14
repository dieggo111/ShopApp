<template>
    <b-container class="login-box">
        <h2>Login</h2>
        <b-form class="form" @submit.prevent="login">
            <label for="feedback-user">Username</label>
            <b-form-input v-model="username" :state="validate" id="feedback-user"></b-form-input>
                <b-form-invalid-feedback :state="validate">
                </b-form-invalid-feedback>
            <label for="feedback-password">Password</label>
            <b-form-input v-model="password" :type="'password'" :state="validate" id="feedback-password"></b-form-input>
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
            authenticationStatus: null,
        }
    },
    computed: {
        validate() {
            if (this.authenticationStatus === false) {
                return false
            }
            return null
        }
    },
    methods: {
        login() {
            this.$store.dispatch("retrieveToken", {
                    name: this.username,
                    pwd: this.password
            })
            .then(response => {
                console.log("login", response)
                this.$router.push("/shop")
                return response
            })
            .catch(error => {
                this.authenticationStatus = false
                return error
            })
        },
    }
};
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>