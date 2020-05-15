<template>
    <b-container class="signup-box">
        <h2>Sign Up</h2>
        <b-form class="form" @submit.prevent="signup">
            <label for="feedback-user">Username</label>
            <b-form-input v-model="username" :state="validateUser" id="feedback-user"></b-form-input>
                <b-form-invalid-feedback :state="validateUser">
                    Your username must be 3-12 characters long.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validateUser">
                    Looks Good.
                </b-form-valid-feedback>

            <label for="feedback-email">Email</label>
            <b-form-input v-model="email" :state="validateEmail" id="feedback-email"></b-form-input>
                <b-form-invalid-feedback :state="validateEmail">
                    Invalid email address.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validateEmail">
                    Looks Good.
                </b-form-valid-feedback>

            <label for="feedback-pwd">Password</label>
            <b-form-input v-model="password" :type="'password'" :state="validatePwd" id="feedback-pwd"></b-form-input>
                <b-form-invalid-feedback :state="validatePwd">
                    Your password must be 3-12 characters long.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validatePwd">
                    Looks Good.
                </b-form-valid-feedback>
            <b-button class="signup-button" type="submit" variant="primary" block>Sign Up</b-button>
        </b-form>
    </b-container>
</template>


<script>
export default {
    name: "Signup",
    data() {
        return {
            username: "",
            password: "",
            email: ""
        }
    },
    computed: {
        validateUser() {
            if (this.username == "") {
                return null
            }
            return this.username.length > 2 && this.username.length < 13
        },
        validatePwd() {
            if (this.password == "") {
                return null
            }
            return this.password.length > 2 && this.password.length < 13
        },
        validateEmail() {
            if (this.email == "") {
                return null
            }
            var re = /\S+@\S+\.\S+/;
            return re.test(this.email);
        }
    },
    methods: {
        signup() {
            this.$store.dispatch("signupUser", {
                    name: this.username,
                    email: this.email,
                    pwd: this.password
            })
            .then(response => {
                this.$router.push("/login")
                return response
            })
            .catch(error => {
                // this.authenticationStatus = false
                return error
            })
        }
    }
};
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>