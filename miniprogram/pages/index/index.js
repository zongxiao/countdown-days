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

  // 跳转到编辑页面，需要传入_id
  itemEdit: function (e) {
    console.log(e.target.dataset._id)
    this.setData({
      itemLongPress: null
    })
    wx.navigateTo({
      url: `../editItem/editItem?_id=${e.target.dataset._id}`,
    })
  },

  // 长按 之后显示的按钮 取消掉
  itemCancel: function () {
    this.setData({
      itemLongPress: null
    })
  },

  // bindtouchstart,bindtouchend,bindtap,bindlongpress事件测试
  handleClick: function (e) {
  },
  handleTouchStart: function (e) {
  },
  handleTouchEnd: function (e) {
  },
  handleLongPress: function (e) {
    let that = this;
    this.data.itemTimer = setTimeout(function () {
      console.log()
      that.setData({
        itemLongPress: e.currentTarget.dataset.index
      })
    }, 300)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据获取中',
    })
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      db.collection('todo-list').where({
        _openid: res.result.openid // 填入当前用户 openid
      }).get().then(res => {
        let rawData = res.data;
        let dateNumArr = [];
        let ifPast = [];
        for (let i = 0; i < rawData.length; i++) {
          let dateToday = new Date();
          let dateAim = new Date(rawData[i].chooseDate)
          let dateNum = (dateAim.getTime() - dateToday.getTime()) / (24 * 60 * 60 * 1000)
          if (dateNum > 0) {
            // 如果 目标日减去今日 得出的结果大于0  证明目标日还没过去
            ifPast.push(false)
            dateNum = Math.ceil(dateNum)
          } else {
            ifPast.push(true)
            dateNum = Math.floor(Math.abs(dateNum))
          }
          dateNumArr.push(dateNum)
          rawData[i].dateNum = dateNumArr[i]
          rawData[i].isPast = ifPast[i]
        }
        // 二维数组排序，按照二维数组的某一个字段排序
        rawData.sort(function (a, b) {
          return a.dateNum - b.dateNum
        })
        // 先声明 原始数组中dateNum的重复次数
        let repeatNum = 0;
        // 定义一个未知长度的数组，后续会根据repeatNum 定义二维数组
        let finallyArr = new Array();
        let finallyArrLen = 0
        let copyRawData = new Array();
        for (let i = 0; i < rawData.length; i++) {
          copyRawData[i] = rawData[i]
        }

        // 数组去重
        // function unique(arr1) {
        //   const res = new Map();
        //   return arr1.filter(function (currentValue, index, arr) {
        //     return !res.has(currentValue.dateNum) && res.set(currentValue.dateNum)
        //   })
        // }
        // console.log(unique(copyRawData))
        console.log(copyRawData)

        const arrMap = {}
        for (let i = 0; i < copyRawData.length; i++) {
          const c = copyRawData[i].chooseDate
          const t = copyRawData[i].itemTitle
          if (arrMap[c]) {
            arrMap[c].push(t)
          } else {
            arrMap[c] = [t]
          }
          console.log("==============================="+i)
        }

        const newArr = []

        for (let k in arrMap) {
          newArr.push({
            itemTitle: arrMap[k].join(','),
            dateNum: k
          })
        }

        console.log(arrMap)
        














        finallyArrLen = rawData.length - repeatNum;
        for (let i = 0; i < finallyArrLen; i++) {
          finallyArr[i] = new Array;
        }
        for (let i = 0; i < rawData.length - 1; i++) {
          // 求出重复项的个数
          if (rawData[i].dateNum == rawData[i + 1].dateNum) {
            finallyArr[i] = rawData[i]
          }
        }
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