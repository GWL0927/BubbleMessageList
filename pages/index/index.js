// index.js
Page({
  data: {
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
        let result = []
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
            dx: Math.random() * 1, 
            dy: Math.random() * 1, 
            zIndex: 0,
            color: `#${color.toString(16)}`, 
            bgColor: `#${(0xFFFFFF - color).toString(16)}`,
            opacity: .7,
            size: 0.8+0.1*res.data[i].likes-0.1*res.data[i].dislikes
          }
          result.push(tag)
        }       
        that.setData({ tags: result })

        setInterval(function () {
          that.autoSize()
        }, 2000)
      }
    })
  },
  autoSize: function () {
    const that = this
    for (let j = 0; j < this.data.tags.length; j++) {
      const obj = wx.createSelectorQuery()
      obj.selectAll('.tag').boundingClientRect()
      obj.exec(function (rect) {
        const height = rect[0][j].height
        const width = rect[0][j].width
        // Object.assign(that.data.tags[j], { width, height })
        that.setData({
          ['tags['+j+'].height']: height,
          ['tags['+j+'].width']: width,
        })
      })
    }
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
      let result = this.data.tags
      result.push(tag)
      this.setData({
        tags: result
      })

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
        title: '??????????????????',
        icon: 'none',
        duration: 1000
      })
    }
    this.setData({
      message: ''
    })
    this.autoDel()
  },
  likes: function (event) {
    const that = this
    // ???????????????????????????????????????tags????????????-1??????????????????tags[tapTag.num-1]????????????????????????????????????
    // ??????,?????????tag????????????tags????????????index??????
    // ?????????????????????id???????????????,?????????????????????????????????,id??????????????????+1,????????????tapTag.num??????id????????????
    let index = event.currentTarget.dataset.index;
    let tapTag = event.currentTarget.dataset.tag;
    let _likes = this.data.tags[index].likes
    _likes += 1
    this.setData({
      ['tags['+index+'].likes']: _likes
    })
    // this.data.tags[index].likes += 1;
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
    // this.data.tags[index].size += 0.1
    let _size = this.data.tags[index].size
    _size += 0.1
    this.setData({
      ['tags['+index+'].size']: _size
    })

  },
  dislikes: function (event) {
    const that = this
    let index = event.currentTarget.dataset.index;
    let tapTag = event.currentTarget.dataset.tag;
    let _dislikes = this.data.tags[index].dislikes
    _dislikes += 1
    this.setData({
      ['tags['+index+'].dislikes']: _dislikes
    })
    // this.data.tags[index].dislikes += 1
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
    // this.data.tags[index].size -= 0.1
    let _size = this.data.tags[index].size
    _size -= 0.1
    this.setData({
      ['tags['+index+'].size']: _size
    })
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
        ['tags['+i+'].x']: t.x,
        ['tags['+i+'].y']: t.y
      })

      // this.setData({
      //   [`tags[${i}]`]: t
      // })
    })
  },
  getUserInfo() {
    const that = this
    const result = {}
    wx.getUserProfile({
      desc: '??????',
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
      const arr = new Array() // ?????????????????????index?????????
      const _tags = this.data.tags
      _tags.forEach((t, i) => {
        if(t.size === minNum) {
          arr.push(i)
        }
      })
      const num = _tags[arr[0]].num // ????????????????????????????????????????????????
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
    }, 20);
  },
  /**
   * ??????????????????--??????????????????????????????
   */
  onReady: function () {

  },

  /**
   * ??????????????????--??????????????????
   */
  onShow: function () {

  },

  /**
   * ??????????????????--??????????????????
   */
  onHide: function () {
  
  },

  /**
   * ??????????????????--??????????????????
   */
  onUnload: function () {
  
  },

  /**
   * ??????????????????????????????--????????????????????????
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * ???????????????????????????????????????
   */
  onReachBottom: function () {
  
  },

  /**
   * ???????????????????????????
   */
  onShareAppMessage: function () {
  
  }
})
