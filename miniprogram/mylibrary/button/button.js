Component({
  // 选项
  options: {
    // 样式隔离, 默认是'isolated'  此外还有'apply-shared', 'shared'
    // 'apply-shared' 表示页面 wxss 样式将影响到自定义组件
    // 'shared' 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply - shared 或 shared 的自定义组件
    styleIsolation: 'isolated'
  },
  // 引用组件需要传的属性
  properties: {
    innerText: {
      type: String,
      value: '默认'
    },
    btWidth: {
      type: String,
      value: '120rpx'
    },
    btHeight: {
      type: String,
      value: '60rpx'
    },
    color: {
      type: String,
      value: "#ffffff"
    },
    bgColor: {
      type: String,
      value: '#333333'
    },
    fontSize: {
      type: String,
      value: "26rpx"
    },
    borderRadius: {
      type: String,
      value: "10rpx"
    }
  },
  // 外部样式类
  externalClasses: [
    'my-class'
  ],
  data: {
    // 组件内部数据
    Width: "120rpx",
  },
  created: function () {
    this.setVar()
  },
  methods: {
    // 自定义方法
    setVar: function () {
    }
  }
})