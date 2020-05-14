import utils from "./utils"

export default class Discounts {
    constructor() {
        this.volumeDiscountApplied = false
        this.setDiscountApplied = false
    }

    volumeDiscount(shoppingList, fruit="Apple", volume=7, discount=0.9) {
        var sum = 0
        shoppingList.forEach(item => {
            if (item.name == fruit) {
                sum = item.quantity*item.price
                if (item.quantity >= volume) {
                    sum *= discount
                }
                item.total = utils.roundToTwo(sum)
                sum = 0
            }
        })
        if (sum != 0) {
            this.volumeDiscountApplied = true
        }
        return shoppingList
    }

    extractSets(shoppingList, fruitA="Pear", fruitB="Banana", groupA=4, groupB=2, discount=0.7) {
        var quantityA = 0
        var quantityB = 0
        var priceA = 0
        var priceB = 0
        var sets = 0
        console.log(shoppingList)
        if (shoppingList.length == 0) {
            return shoppingList
        }
        shoppingList.forEach(item => {
            if (item.name == "Set (" + fruitA + "&" + fruitB + ")") {
                return shoppingList
            }
        })
        shoppingList.forEach(item => {
            if (item.name == fruitA) {
                quantityA = item.quantity
                priceA = item.price
            }
            if (item.name == fruitB) {
                quantityB = item.quantity
                priceB = item.price
            }
        })
        if (parseInt(quantityA/groupA) <= parseInt(quantityB/groupB)) {
            sets = parseInt(quantityA/groupA)
        } else {
            sets = parseInt(quantityB/groupB)
        }
        shoppingList.push({
            "name": "".concat("Set (", groupA, fruitA, "&", groupB, fruitB, ")"),
            "price": utils.roundToTwo((groupA*priceA + groupB*priceB)*discount),
            "quantity": sets
        })
        shoppingList.forEach(item => {
            if (item.name == fruitA) {
                item.quantity -= sets*groupA
            }
            if (item.name == fruitB) {
                item.quantity -= sets*groupB
            }
        })
        if (sets != 0) {
            this.setDiscountApplied = true
        }
        return shoppingList
    }

    calcItemTotal(shoppingList) {
        shoppingList.forEach( item => {
            item["total"] = item.quantity*item.price
        })
        return shoppingList
    }
}


