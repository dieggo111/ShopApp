import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        shoppingList: JSON.parse(localStorage.getItem("shoppingList")) || [],
        token: localStorage.getItem("access_token") || null,
        cart: {},
        items: [],
        nameList: [],
        priceList: {},
        defaultQuantities: {},
        coupon: localStorage.getItem("coupon_token") || null,
    },
    getters: {
        loggedIn(state) {
            return state.token !== null
        },
        getItemAmount(state) {
            return state.nameList.length
        },
        getCart(state) {
            return state.cart
        },
        getItems(state) {
            return state.items
        },
        amountInCart(state) {
            var counter = 0
            try {
                Object.keys(state.cart).forEach((key) => {
                    counter += state.cart[key]["quantity"]
                })
                return counter
            } catch {
                return 0
            }
        },
        getCartContent(state) {
            var cart = []
            Object.keys(state.cart).forEach((key) => {
                if (state.cart[key]["quantity"] !== 0) {
                    cart.push(state.cart[key])
                }
            })
            return cart
        },
        getShoppingList(state) {
            return state.shoppingList
        },
        getNameList(state) {
            return state.nameList
        },
        getPriceList(state) {
            return state.priceList
        },
        getCouponToken(state) {
            return state.coupon
        },
        getAccessToken(state) {
            return state.token
        }
        // getTransactionStatus(state) {
        //     return state.transactionStatus
        // }
    },
    mutations: {
        retrieveToken(state, token) {
            state.token = token
        },
        destroyToken(state) {
            state.token = null
        },
        addToCart(state, {key, quantity}) {
            state.cart[key]["quantity"] += quantity
        },
        setShopItems(state, items) {
            state.items = items
        },
        setItemNames(state, nameList) {
            state.itemNames = nameList
        },
        setDefaultQuantities(state, cart) {
            Object.keys(cart).forEach((key) => {
                state.defaultQuantities[key] = 1
            })
        },
        setNameList(state, nameList) {
            state.nameList = nameList
        },
        setPriceList(state, priceList) {
            state.priceList = priceList
        },
        setShoppingList(state, list) {
            state.shoppingList = list
        },
        setCart(state, cart) {
            state.cart = cart
        },
        removeFromCart(state, key) {
            state.cart[key]["quantity"] = 0
        },
        resetCart(state) {
            state.cart = []
        },
        transactionStatus(state, value) {
            state.transactionStatus = value
        },
        setCouponToken(state, token) {
            state.coupon = token
        }
    },
    actions: {
        retrieveToken(context, cred) {
            return new Promise((resolve, reject) => {
                fetch('http://localhost:12345/login', {
                    method: 'post',
                    body: JSON.stringify(cred)})
                    .then(res => {
                        if (res.ok) {
                            return res.json()
                        }
                        throw new Error(res.status)
                    })
                    .then(res => {
                        console.log(res)
                        localStorage.setItem("access_token", res)
                        context.commit("retrieveToken", res)
                        resolve(res)
                        })
                    .catch(error => {
                        reject(error)
                    })
                })
        },
        destroyToken(context) {
            if (context.getters.loggedIn) {
                return new Promise((resolve, reject) => {
                    fetch('http://localhost:12345/logout', {
                        method: 'post',
                        body: this.state.token
                    })
                    .then(res => {
                        localStorage.removeItem("access_token")
                        context.commit("destroyToken")
                        resolve(res)
                        })
                    .catch(error => {
                        localStorage.removeItem("access_token")
                        context.commit("destroyToken")
                        reject(error)
                    })
                })
            }

        },
        storeCart(context) {
            var shoppingList = context.getters.getCartContent
            localStorage.setItem("cart", JSON.stringify(context.getters.getCart))
            context.commit("setShoppingList", shoppingList)
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
        },
        storeShoppingList(context) {
            var cartContent = context.getters.getCartContent
            localStorage.setItem("shoppingList", JSON.stringify(cartContent))
            context.commit("setShoppingList", cartContent)
        },
        initCart(context, cart) {
            if (localStorage.getItem("cart") === null) {
                context.commit("setCart", cart)
            } else {
                context.commit("setCart", JSON.parse(localStorage.getItem("cart")))
            }
        },
        resetShop(context) {
            localStorage.removeItem("cart")
            localStorage.removeItem("shoppingList")
            context.commit("setCart", [])
        },
        checkPayment(context) {
            return new Promise((resolve, reject) => {
                fetch('http://localhost:12345/checkTransaction', {
                    method: 'post',
                    body: 1001
                })
                .then(res => res.json())
                .then(res => {
                    if (res === true) {
                        console.log("Transaction successful")
                        context.commit("transactionStatus", true)
                        resolve(res)
                    } else {
                        throw new Error("Transaction failed")
                    }
                    })
                .catch(error => {
                    reject(error)
                })
            })
        },
        getCoupon(context, username) {
            return new Promise((resolve, reject) => {
                fetch('http://localhost:12345/getCoupon', {
                    method: 'post',
                    body: username
                })
                .then(res => res.json())
                .then(res => {
                    localStorage.setItem("coupon_token", res)
                    console.log(res)
                    context.commit("setCouponToken", res)
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                })
            })
        }
    }
});

