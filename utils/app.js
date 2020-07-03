
export default {
  flat (arr) {
    let result = []
    arr.forEach(item => {
      if (item.children) {
        result.push(...this.flat(item.children))
      } else {
        result.push(item)
      }
    })
    return result
  }
}