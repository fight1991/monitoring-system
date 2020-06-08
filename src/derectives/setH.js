function setDomH (el, value, type) {
  if (type === 'max') { // 最大高度
    el.style.maxHeight = value + 'px'
  } else if (type === 'min') { // 最小高度
    el.style.minHeight = value + 'px'
  } else { // 定高
    el.style.height = value + 'px'
  }
}
export default {
  inserted: (el, binding) => {
    if (typeof binding.value === 'number') {
      setDomH(el, binding.value, binding.arg)
    }
  },
  update: (el, binding) => {
    if (binding.value !== binding.oldValue) {
      setDomH(el, binding.value, binding.arg)
    }
  }
}
