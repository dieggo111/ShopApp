function euros(num) {
    try {
        if (typeof(num) == "string") {
            return num
        }
        var euro = `${num}`
        if (euro.split(".")[1].length == 1) {
            euro = euro.concat("0")
        } else if (euro.split(".")[1] == null) {
            euro = euro.concat(".00")
        }
        return euro.concat(" €")
    } catch {return num}
}
export { euros }

export default {
  euros,
}
