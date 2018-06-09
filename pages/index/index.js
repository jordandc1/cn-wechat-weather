const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED =2;

const UNPROMPTED_TIPS = "点击获取当前位置";
const UNAUTHORIZED_TIPS = "点击开启位置权限";
const AUTHORIZED_TIPS = "";

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
    forecast_url: '',
    forecast: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    hourlyWeather:[],
    todayTemp: "",
    todayDate: "",
    city: '广州市',
    // locationTipsText: UNAUTHORIZED_TIPS,
    locationAuthType: UNPROMPTED
  },
    
  onTapDayWeather: function (event) {
    console.log(event)
    wx.showToast({
      title: 'clicked',
      icon: 'success',
      duration: 2000
    })
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city,
    })
  },

  onTapLocation(event) {
    console.log(event)
    if (this.data.locationAuthType === UNAUTHORIZED)
      wx.openSetting({
        sucess: res => {
          if (res.authSetting['scope.userLocation']) {
            this.getCityAndWeather()
          }
        }
      })
    else
      this.getCityAndWeather()
  },

  getCityAndWeather() {
    wx.getLocation({
      type: 'wgs84',
      success: res=> {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude,longitude)
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: res => {
              let city = res.result.address_component.city
              this.setData({
                city:city,
                
              })
              console.log(city)
              this.getNow()
          }
        })
        
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
          locationTipsText: UNAUTHORIZED_TIPS
        })
      }
    })
  },


  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        console.log(auth)
        let locationAuthType = auth ? AUTHORIZED
          : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        let locationTipsText = auth ? AUTHORIZED_TIPS
          : (auth === false) ? UNAUTHORIZED_TIPS : UNPROMPTED_TIPS
        this.setData({
          locationAuthType: locationAuthType,
          locationTipsText: locationTipsText
        })

        if (auth)
          this.getCityAndWeather()
        else
          this.getNow() //使用默认城市广州
      },
      fail: () => {
        this.getNow() //使用默认城市广州
      }
    })
  },

  onShow() {
    // console.log('onShow')
    // wx.getSetting({
    //   success: res => {
    //     let auth = res.authSetting['scope.userLocation']
    //     if (auth && this.data.locationAuthType != AUTHORIZED) {
    //       //权限从无到有
    //       this.setData({
    //         locationAuthType: AUTHORIZED,
    //         locationTipsText: AUTHORIZED_TIPS
    //       })
    //       this.getLocation()
    //     }
    //     //权限从有到无未处理
    //   }
    // })

  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    console.log('onReady')
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
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
        city: 'this.data.city'
      },
      success: res => {
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        let item = result.forecast
        
        this.setToday(result)

        console.log(result.today.minTemp)
        this.setData({
          temp: temp + '°',
          weather: weatherMap[weather],
          url: imageMap[weather],
          // item: item,
          // forecast_url: ['/pages/image/'+item[0].weather+'-icon.png',
          //   '/pages/image/' + item[1].weather+'-icon.png',
          //   '/pages/image/' + item[2].weather+'-icon.png',
          //   '/pages/image/' + item[3].weather+'-icon.png',
          //   '/pages/image/' + item[4].weather+'-icon.png',
          //   '/pages/image/' + item[5].weather+'-icon.png',
          //   '/pages/image/' + item[6].weather+'-icon.png',
          //   '/pages/image/' + item[7].weather + '-icon.png',
          //                ]
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })

        //set forecast
        let forecast = result.forecast
        let hourlyWeather = []
        let nowHour = new Date().getHours()
        for(let i=0;i<24;i+=3) {
            hourlyWeather.push({
              time: (i+nowHour)%24+"时",
              iconPath: '/pages/image/' + forecast[i / 3].weather + '-icon.png',
              temp: forecast[i / 3].temp + '°'
            })
        }
        hourlyWeather[0].time = '现在'
        this.setData({
          hourlyWeather:hourlyWeather
        })
      },
      complete: () => {
        callback && callback() //If the left of the && is truth-y, then whatever is on the right side of the && is executed.
        // 如果有回调参数 则执行
      }
    })
  },

  setToday(result) {
    let date = new Date()
    console.log(result.today.minTemp)
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  }

})