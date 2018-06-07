const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const imageMap = {
  'sunny': '/pages/image/sunny-bg.png',
  'cloudy': '/pages/image/cloudy-bg.png',
  'overcast': '/pages/image/overcast-bg.png',
  'lightrain': '/pages/image/lightrain-bg.png',
  'heavyrain': '/pages/image/heavyrain-bg.png',
  'snow': '/pages/image/snow-bg.png'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}


Page({
  data: {
    temp: '',
    weather: '',
    url: ''
  },
  onLoad() {
    this.getNow()
  },

  onPullDownRefresh: function () {
    console.log("refresh executed!")
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市'
      },
      success: res => {
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        console.log(temp, weather)
        this.setData({
          temp: temp + '°',
          weather: weatherMap[weather],
          url: imageMap[weather]
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })

      },
      complete: () => {
        callback && callback() //If the left of the && is truth-y, then whatever is on the right side of the && is executed.
        // 如果有回调参数 则执行
      }
    })
  }

})