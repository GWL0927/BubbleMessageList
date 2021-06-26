// index.js
Page({
  data: {
    initialized: false,
    wall: { width: 0, height: 0 },
    tags: [],
    message: '',
    user: { name: '', avatarUrl: ''}
  },
  init: function() {
    const that = this
    const obj = wx.createSelectorQuery()
    obj.select('#app').boundingClientRect()
    obj.exec(function (rect) {
      const result = {
        width: rect[0].width,
        height: rect[0].height
      }
      that.setData({ wall: result })
    })
  },
  appendTag: function() {
    const that = this
    wx.request({
      url: 'http://localhost:3000',
      // url: 'http://127.20.10.2:3000',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        const result = []
        for (let i = 0; i < res.data.length; i++) {
          const color = Math.floor(Math.random() * 0xFFFFFF)
          const tag = {
            name: res.data[i].name,
            id: `t-${res.data[i].id}`,
            num: res.data[i].id,
            message: res.data[i].message,
            likes: res.data[i].likes,
            dislikes: res.data[i].dislikes,
            x: 0, y: 0, 
            dx: Math.random() * 0.5, 
            dy: Math.random() * 0.5, 
            zIndex: 0,
            color: `#${color.toString(16)}`, 
            bgColor: `#${(0xFFFFFF - color).toString(16)}`,
            opacity: .6,
            size: 0.8+0.1*res.data[i].likes-0.1*res.data[i].dislikes
          }
          result.push(tag)
        }       
        that.setData({ tags: result })

        setInterval(function () {
          that.autoDel()

          for (let j = 0; j < that.data.tags.length; j++) {
            const obj = wx.createSelectorQuery()
            obj.selectAll('.tag').boundingClientRect()
            obj.exec(function (rect) {
              const height = rect[0][j].height
              const width = rect[0][j].width
              Object.assign(that.data.tags[j], { width, height })
            })
          }
        }, 3000)
      }
    })
  },
  messageInput: function(e) {
    this.setData({
      message: e.detail.value
    })
    console.log(this.data.message);
  },
  sendClick: function() {
    const that = this
    let idd
    if (this.data.tags.length === 0) {idd = 1}
    else {idd = this.data.tags[this.data.tags.length-1].num + 1}
    const color = Math.floor(Math.random() * 0xFFFFFF)
    if (this.data.message) {
      const tag = {
        name: this.data.user.name,
        id: `t-${idd}`,
        num: idd,
        message: this.data.message,
        likes: 0,
        dislikes: 0,
        x: 0, y: 0, 
        dx: Math.random() * 1, 
        dy: Math.random() * 1,
        zIndex: 0,
        color: `#${color.toString(16)}`, 
        bgColor: `#${(0xFFFFFF - color).toString(16)}`,
        opacity: .7,
        size: 0.8
      }
      this.data.tags.push(tag)

      wx.request({
        url: 'http://localhost:3000/add',
        // url: 'http://127.20.10.2:3000/add',
        data: { 
          tid: that.data.tags[that.data.tags.length-1].num,
          tmessage: that.data.message,
          tname: that.data.user.name
        },
        method: 'POST',
        success: function (res) {
        }
      })
    } else {
      wx.showToast({
        title: '请输入留言！',
        icon: 'none',
        duration: 1000
      })
    }
    this.setData({
      message: ''
    })
  },
  likes: function (event) {
    const that = this
    // 由于在删除中间任一数据后，tags数组长度-1，这时再通过tags[tapTag.num-1]取值，将取到的不是想要的
    // 所以,用点击tag所在当前tags数组中的index取值
    // 而要传给后端的id都是唯一的,不管中间有没有删除数据,id一直都是顺着+1,所以要用tapTag.num作为id传给后端
    let index = event.currentTarget.dataset.index;
    let tapTag = event.currentTarget.dataset.tag;
    this.data.tags[index].likes += 1;
    wx.request({
      url: 'http://localhost:3000/likes',
      // url: 'http://127.20.10.2:3000/likes',
      data: { 
        tid: tapTag.num,
        tlikes: that.data.tags[index].likes
      },
      method: 'POST',
      success: function (res) {
      }
    })
    this.data.tags[index].size += 0.1
  },
  dislikes: function (event) {
    const that = this
    let index = event.currentTarget.dataset.index;
    let tapTag = event.currentTarget.dataset.tag;
    this.data.tags[index].dislikes += 1
    wx.request({
      url: 'http://localhost:3000/dislikes',
      // url: 'http://127.20.10.2:3000/dislikes',
      data: { 
        tid: tapTag.num,
        tdislikes: that.data.tags[index].dislikes
      },
      method: 'POST',
      success: function (res) {
      }
    })
    this.data.tags[index].size -= 0.1
  },
  delete: function (event) {
    let index = event.currentTarget.dataset.index;
    let tapTag = event.currentTarget.dataset.tag;
    const tags = this.data.tags
    tags.splice(index, 1)
    this.setData({
      tags: tags
    })
    wx.request({
      url: 'http://localhost:3000/delete',
      // url: 'http://127.20.10.2:3000/delete',
      data: { 
        tid: tapTag.num
      },
      method: 'POST',
      success: function (res) {
      }
    })
  },
  fly: function() {
    this.data.tags.forEach( (t, i) => {
      if (t.x < 0 || t.x >= this.data.wall.width - t.width - 1) t.dx *= -1 
      if (t.y < 0 || t.y >= this.data.wall.height - t.height) t.dy *= -1 
      t.x += t.dx
      t.y += t.dy

      this.setData({
        [`tags[${i}]`]: t
      })
    })
  },
  getUserInfo() {
    const that = this
    const result = {}
    wx.getUserProfile({
      desc: '留言',
      success(res) {
        const name = res.userInfo.nickName
        const avatarUrl = res.userInfo.avatarUrl
        result.name = name
        result.avatarUrl = avatarUrl
        that.setData({
          user: result
        })

        that.init()
        that.appendTag()
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  autoDel() {
    if (this.data.tags.length > 10) {
      const minNum = Math.min.apply(Math, this.data.tags.map(function(o) {return o.size}))
      const arr = new Array() // 存储最小的值的index的数组
      const _tags = this.data.tags
      _tags.forEach((t, i) => {
        if(t.size === minNum) {
          arr.push(i)
        }
      })
      const num = _tags[arr[0]].num // 如果最小值有多个，则删除最先发的
      _tags.splice(arr[0], 1)
      this.setData({
        tags: _tags
      })
      wx.request({
        url: 'http://localhost:3000/delete',
        // url: 'http://127.20.10.2:3000/delete',
        data: { 
          tid: num
        },
        method: 'POST',
        success: function (res) {
        }
      })
    }
  },
  onLoad: function() {

    setInterval(() => {
      this.fly()
    }, 30);
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
