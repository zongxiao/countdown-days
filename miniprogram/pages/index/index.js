// pages/index/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [],
    // 长按定时器
    itemTimer: null,
    // 长按的item
    itemLongPress: null,
  },

  // 跳转到添加页面
  toAddItem: function () {
    wx.navigateTo({
      url: '../addItem/addItem',
    })
  },
  // 删除倒数日
  deleteItem: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定彻底删除么，一旦删除无法恢复',
      success(res) {
        that.setData({
          itemLongPress: null
        })
        if (res.confirm) {
          db.collection('countdownDay_list').doc(e.target.dataset._id).remove()
            .then(res2 => {
              wx.showToast({
                title: '删除成功',
              })
              wx.redirectTo({
                url: '../index/index',
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    })
  },

  // 长按 之后显示的按钮 取消掉
  itemCancel: function () {
    this.setData({
      itemLongPress: null
    })
  },

  // bindtouchstart,bindtouchend,bindtap,bindlongpress事件测试
  // 跳转到编辑页面，需要传入_id
  itemEdit: function (e) {
    console.log(e)
    this.setData({
      itemLongPress: null
    })
    wx.navigateTo({
      url: `../editItem/editItem?_id=${e.target.dataset._id}`,
    })
  },
  handleTouchStart: function (e) {
  },
  handleTouchEnd: function (e) {
  },
  handleLongPress: function (e) {
    let that = this;
    this.data.itemTimer = setTimeout(function () {
      that.setData({
        itemLongPress: e.currentTarget.dataset.index
      })
    }, 300)
  },
  // 函数调用后返回： 当前日期【格式为20190614】
  getNowFormatDate: function (mydate) {
    var date = mydate || new Date();
    var seperator1 = "";
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '更新中',
    })
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      db.collection('countdownDay_list').where({
        _openid: res.result.openid // 填入当前用户 openid
      }).get().then(res => {
        console.log(res.data)
        let rawData = res.data;
        let dateNumArr = [];
        let ifPast = [];
        for (let i = 0; i < rawData.length; i++) {
          let dateNum = Math.ceil(new Date(new Date(rawData[i].chooseDate) - new Date()) / (1*24*60*60*1000));
          if (dateNum >= 0) {
            // 如果 目标日减去今日 得出的结果大于0  证明目标日还没过去
            ifPast.push(false)
          } else {
            ifPast.push(true)
          }
          dateNumArr.push(dateNum)
          rawData[i].dateNum = dateNumArr[i]
          rawData[i].isPast = ifPast[i]
        }
        // 二维数组排序，按照二维数组的某一个字段排序
        rawData.sort(function (a, b) {
          return a.dateNum - b.dateNum
        })
        this.setData({
          itemList: rawData
        })
        wx.hideLoading();
      }).catch(err => {
        console.log(err)
        wx.hideLoading();
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
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