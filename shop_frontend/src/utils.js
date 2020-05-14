var utils = {
    roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2")
    },
    extractTotal(list) {
        var sum = 0
        list.forEach(item => {
            sum += item.price*item.quantity
        })
        return sum
    }
}

export default utils
