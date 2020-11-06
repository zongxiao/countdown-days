// pages/addItem/addItem.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 存放当前的item_id
    itemId: null,
    // 存放今天的日期
    todayDate: '',
    // 用户输入事件的名称
    itemTitle: '',
    itemFocus: false,
    // 用户选中的日期
    chooseDate: '',
    // 用户输入的备注信息
    remarksInfo: '',
    // 用户选中的颜色色块
    itemColor: '#e75c9d',
    itemSelect: 0,
    // 自定义色块列表
    colorList: [
      '#e75c9d',
      '#ee865b',
      '#62b3ab',
      '#69d27d',
      '#e5b347',
      '#f2a93c',
      '#5089b6',
      '#458ef7'
    ]
  },

  // 函数  调用后返回： 当前日期【格式为2019-06-14】
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  // 输入事件名称时触发
  itemTitleInput: function (e) {
    this.setData({
      itemTitle: e.detail.value
    })
  },

  // 输入备注信息
  itemRemarksInput: function (e) {
    this.setData({
      remarksInfo: e.detail.value
    })
  },

  // picker选择时间按下确定后触发
  bindTimeChange: function (e) {
    this.setData({
      chooseDate: e.detail.value
    })
  },

  // 选择颜色色块
  chooseColor: function (e) {
    console.log(e.target.dataset.colorid)
    this.setData({
      itemColor: this.data.colorList[e.target.dataset.colorid],
      itemSelect: e.target.dataset.colorid
    })
  },

  // 保存倒数日
  saveItem: function (event) {
    if (this.data.itemTitle == '') {
      wx.showToast({
        title: '不完整',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        itemFocus: true
      })
      return false;
    }
    wx.showLoading({
      title: '保存中',
    })
    db.collection('todo-list').doc(this.data.itemId).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        itemTitle: this.data.itemTitle,
        chooseDate: this.data.chooseDate,
        remarksInfo: this.data.remarksInfo,
        itemColor: this.data.itemColor
      }
    })
      .then(res => {
        console.log(res);
        wx.hideLoading();
        wx.showLoading({
          title: '跳转中',
        })
        wx.reLaunch({
          url: '../index/index',
        })
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading();
      })
  },

  // 删除倒数日
  deleteItem: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定彻底删除么，一旦删除无法恢复',
      
      success(res) {
        if (res.confirm) {
          db.collection('todo-list').doc(that.data.itemId).remove()
            .then(res2 => {
              wx.showToast({
                title: '删除成功，跳转中',
              })
              wx.redirectTo({
                url: '../index/index',
              })
              console.log(res2)
            })
            .catch(err => {
              console.log(err)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options._id)
    db.collection('todo-list').doc(options._id).get().then(res => {
      console.log(res.data)
      this.setData({
        itemTitle: res.data.itemTitle,
        chooseDate: res.data.chooseDate,
        remarksInfo: res.data.remarksInfo,
        itemColor: res.data.itemColor,
        itemId: options._id
      })
    })
    // 设置允许选择的时间,以及默认设置今日作为当前时间
    this.setData({
      todayDate: this.getNowFormatDate()
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})