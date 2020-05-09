<template>
    <div class="auth-box">
        <b-button class="auth-button" block>Login</b-button>
        <b-button class="auth-button" block variant="primary">Sign up</b-button>
    </div>
</template>

<script>
// import LoginComponent from './components/LoginComponent.vue'
// import SignupComponent from './components/SignupComponent.vue'
        // <b-form class="form" @submit.stop.prevent>
        //     <label for="feedback-user">Username</label>
        //     <b-input v-model="userId" :state="validation" id="feedback-user"></b-input>
        //         <b-form-invalid-feedback :state="validation">
        //             Your username must be 3-12 characters long.
        //         </b-form-invalid-feedback>
        //         <b-form-valid-feedback :state="validation">
        //             Looks Good.
        //         </b-form-valid-feedback>
        // </b-form>
        // <b-form class="form" @submit.stop.prevent>
        //     <label for="feedback-user">Password</label>
        //     <b-input v-model="password" :state="validation" id="feedback-user"></b-input>
        //         <b-form-invalid-feedback :state="validation">
        //             Your password must be 3-12 characters long.
        //         </b-form-invalid-feedback>
        //         <b-form-valid-feedback :state="validation">
        //             Looks Good.
        //         </b-form-valid-feedback>
        // </b-form>


export default {
    name: "Auth",
    data() {
        return {
            login: false,
            signup: false
        }
    },
    computed: {
        validation() {
            return this.userId.length > 2 && this.userId.length < 13
        }
    },
};
</script>

<style lang="sass" scoped>
@import '../_styles.sass'
</style>