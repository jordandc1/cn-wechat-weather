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

const iconMap = {
  'sunny': '/pages/image/sunny-icon.png',
  'cloudy': '/pages/image/cloudy-icon.png',
  'overcast': '/pages/image/overcast-icon.png',
  'lightrain': '/pages/image/lightrain-icon.png',
  'heavyrain': '/pages/image/heavyrain-icon.png',
  'snow': '/pages/image/snow-bg.png'
}


Page({
  data: {
    temp: '',
    weather: '',
    url: '',
    item: [],
    forecast_url: ''
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
        let item = result.forecast
        
        console.log(temp, weather, item)
        this.setData({
          temp: temp + '°',
          weather: weatherMap[weather],
          url: imageMap[weather],
          item: item,
          forecast_url: ['/pages/image/'+item[0].weather+'-icon.png',
            '/pages/image/' + item[1].weather+'-icon.png',
            '/pages/image/' + item[2].weather+'-icon.png',
            '/pages/image/' + item[3].weather+'-icon.png',
            '/pages/image/' + item[4].weather+'-icon.png',
            '/pages/image/' + item[5].weather+'-icon.png',
            '/pages/image/' + item[6].weather+'-icon.png',
            '/pages/image/' + item[7].weather + '-icon.png',
                         ]
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