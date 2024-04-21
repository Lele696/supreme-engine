Page({
  data: {

  },
  toMapPage(e) {
    var registryInfo = e.detail.value;
    if (registryInfo.password !== registryInfo.requirPassword) {
      wx.showToast({
        title: '确认密码错误',
      });
      return;
    }
    wx.request({
      method: 'POST',
      url: 'http://localhost:8080/wxRegistry',
      data: {
        'email': registryInfo.email,
        'nickName': registryInfo.nickName,
        'phonenumber': registryInfo.phonenumber,
        'password': registryInfo.password,
        'userName': registryInfo.username,
        'sex': '1',
        'status': '0',
        'roleIds': [101],
        'postIds': [5],
      },
      success: function (result) {
        if (result.data.code == 200) {
          wx.showModal({
            title: '友好提示',
            content: result.data.msg,
            success: function () {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          });
        } else {
          wx.showModal({
            title: '错误提示',
            content: result.data.msg,
          })
          return;
        }
      }
    })
  }
})