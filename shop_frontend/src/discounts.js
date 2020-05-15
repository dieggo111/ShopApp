import utils from "./utils"

export default class Discounts {
    constructor() {
        this.volumeDiscountApplied = false
        this.setDiscountApplied = false
    }

    getdiscountObject() {
        return new DiscountItem
    }

    volumeDiscount(shoppingList, fruit="Apple", volume=7, discount=0.9) {
        var sum = 0
        var discountItem = new DiscountItem()
        shoppingList.forEach(item => {
            if (item.name == fruit) {
                sum = item.quantity*item.price
                if (item.quantity >= volume) {
                    this.setClassProperty(this.volumeDiscountApplied, true)
                    discountItem.type = "".concat(fruit, "-Discount")
                    discountItem.quantity = 1
                    discountItem.price = "".concat("(-", utils.roundToTwo(1-discount)*100, "%)")
                    discountItem.discount = -utils.roundToTwo(sum - sum*discount)
                }
            }
        })
        this.setClassProperty(this.volumeDiscountApplied, false)
        return discountItem
    }

    extractSets(shoppingList, fruitA="Pear", fruitB="Banana",
                groupA=4, groupB=2, discount=0.7) {
        var sets = 0
        var newName = "".concat(fruitA, "&", fruitB, "-Sets")
        if (shoppingList.length == 0) {
            return null
        }
        var props = this.getItemProperties(shoppingList, fruitA, fruitB)
        if (Object.keys(props).length < 4) {
            return null
        }
        sets = this.getNumberOfSets(props.quantityA, props.quantityB, groupA, groupB)
        this.setClassProperty(this.setDiscountApplied, sets != 0)
        var pricePerSet = (groupA*props.priceA + groupB*props.priceB)*discount
        return new DiscountItem(
            newName,
            sets,
            utils.roundToTwo(pricePerSet),
            utils.roundToTwo(-sets*(groupA*props.priceA + groupB*props.priceB - pricePerSet)))
    }

    calcItemTotal(shoppingList) {
        shoppingList.forEach( item => {
            item["total"] = utils.roundToTwo(item.quantity*item.price)
        })
        return shoppingList
    }

    getItemProperties(list, fruitA="Pear", fruitB="Banana") {
        var props = {}
        list.forEach(item => {
            if (item.name == fruitA) {
                props["quantityA"] = item.quantity
                props["priceA"] = item.price
            }
            if (item.name == fruitB) {
                props["quantityB"] = item.quantity
                props["priceB"] = item.price
            }
        })
        return props
    }

    getNumberOfSets(quantityA, quantityB, groupA=4, groupB=2) {
        var sets = 0
        if (parseInt(quantityA/groupA) <= parseInt(quantityB/groupB)) {
            sets = parseInt(quantityA/groupA)
        } else {
            sets = parseInt(quantityB/groupB)
        }
        return sets
    }

    setClassProperty (prop, condition) {
        if (condition) {
            prop = true
        } else {
            prop = false
        }
    }

}

class DiscountItem {
    constructor (type="", quantity=0, price=0, discount=0) {
        this.type = type
        this.quantity = quantity
        this.price = price
        this.discount = discount
    }
}



