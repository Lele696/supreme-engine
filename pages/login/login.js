Page({
  data: {
    imgCode: '',
    code: '',
    uuid: '',
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/captchaImage',
      success: function (data) {
        that.setData({
          imgCode: data.data.img,
          uuid: data.data.uuid,
        })
      }
    })
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo.userToken === undefined) {
      return;
    }
    if (userInfo.userToken !== '') {
      wx.showToast({
        title: '用户已登录',
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/search/search',
        });
      }, 1000)
    }
  },
  registry: function () {
    wx.navigateTo({
      url: '/pages/registry/registry',
    })
  },
  toMapPage: function (e) {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/login',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'code': e.detail.value.code,
        'password': e.detail.value.password,
        'username': e.detail.value.username,
        'uuid': that.data.uuid,
      },
      method: 'POST',
      success: function (result) {
        var userInfo = {};
        userInfo.userToken = result.data.token;
        wx.request({
          url: 'http://127.0.0.1:8080/getInfo',
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + userInfo.userToken,
          },
          success: function (data) {
            userInfo.username = data.data.user.nickName;
            userInfo.userId = data.data.user.userId;
          }
        })
        if (result.data.code == 200) {
          wx.setStorageSync('userInfo', userInfo);
          wx.showToast({
            title: '登录成功',
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/search/search',
            });
          }, 1000)
        } else {
          wx.showToast({
            title: '验证码或密码错误',
          })
          that.reloadImg();
        }
      }
    })
    // wx.navigateTo({
    //   url: '/pages/search/search',
    // })
  },
  reloadImg: function () {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/captchaImage',
      success: function (data) {
        that.setData({
          imgCode: data.data.img,
          uuid: data.data.uuid
        })
      }
    })
  },
})