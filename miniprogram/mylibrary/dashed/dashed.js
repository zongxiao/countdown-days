Component({
  // options 选项配置
  options: {
    multipleSlots: true
  },
  // 引用组件需要传的属性
  properties: {
    innerText: {
      type: String,
      value: '默认值，需要在标签传属性innerText的值'
    },
    color: {
      type: String,
      value: "#dddddd"
    },
    borderColor: {
      type: String,
      value: '#dddddd'
    }
  },
  data: {
    // 组件内部数据
    someData: {
    }
  },
  methods: {
    // 自定义方法
    customMethid: function () {}
  }
})