<template lang="pug">
    <div class="sign_up">
        <div class="subheader">Sign up</div>
        <div class
        <b-button block>Login</b-button>

        <b-button block variant="primary">Sign up</b-button>


        <b-form class="form" @submit.stop.prevent>
            <label for="feedback-user">Username</label>
            <b-input v-model="userId" :state="validation" id="feedback-user"></b-input>
                <b-form-invalid-feedback :state="validation">
                    Your username must be 3-12 characters long.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validation">
                    Looks Good.
                </b-form-valid-feedback>
        </b-form>
        <b-form class="form" @submit.stop.prevent>
            <label for="feedback-user">Password</label>
            <b-input v-model="password" :state="validation" id="feedback-user"></b-input>
                <b-form-invalid-feedback :state="validation">
                    Your password must be 3-12 characters long.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validation">
                    Looks Good.
                </b-form-valid-feedback>
        </b-form>



        <b-form-input class="form" v-model="text" placeholder="Enter your username"></b-form-input>
        <b-form-input v-model="password" placeholder="Enter your password"></b-form-input>

    </div>

    </div>


</template>

<script>
export default {
    name: "Signup",
    data() {
        return {
            text: '',
            userId: '',
            password: ''
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