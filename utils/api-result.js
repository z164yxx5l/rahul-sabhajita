function requestError(data) {
  wx.showToast({
    title: data.message,
    duration:1500,
    mask:true,
    image:'/images/prompt/fail.png'  
  });
  console.log(data)
  if (data.status == 401) {
    let pages = getCurrentPages();
    let current_page = pages[pages.length - 1].route
    if (current_page !== '/pages/admin/login/index') {
      wx.navigateTo({
        url: "/pages/admin/login/index"
      })
    }
  }
}

function error(msg) {
  wx.showToast({
    title: msg,
    duration:1500,
    mask:true,
    image:'/images/prompt/fail.png'  
  });
}
function warn(msg) {
  wx.showToast({
    title: msg,
    duration:1500,
    mask:true,
    image:'/images/prompt/warn.png', 
  });
}
function success(msg) {
  wx.showToast({
    title: msg,
    duration:2000,
    mask:true,
    image:'/images/prompt/success.png' 
  });
}

const StateCode = {
  success: 200,
  error: 500,
}

module.exports = {
  requestError,
  error,
  warn,
  success,
  StateCode,
}