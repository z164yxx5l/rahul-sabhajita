const app = getApp();
import apiResult from '../../../utils/api-result';
import {Config} from '../../../config/api.js';
Page({
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    blogTitle: ""
  },
  onLoad: function () { 
    
  },
  async onShow() {
    var that = this;
    if (typeof that.getTabBar === 'function' && that.getTabBar()) {
      that.getTabBar().setData({
        selected: 3
      })
    }
    that.setData({
      blogTitle: app.globalData.blogTitle
    });
  },

  /**
   * 获取用户信息
   * @param {*} e 
   */
  getUser(e) {
    if (!e.detail.userInfo) {
      return apiResult.error("登录失败");
    } else {
      wx.setStorageSync(Config.User, e.detail.userInfo);
      this.setData({
        modalName: null,
      })
      return apiResult.success("登录成功");
    }
  },
  /**
   * 复制
   * @param {*} e 
   */
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 跳转到标签页面
   */
  toTagPage() {
    wx.navigateTo({
      url:"/pages/tag/index"
    })
  },
  /**
   * 跳转到归档页面
   */
  toArchivesPage() {
    wx.navigateTo({
      url:"/pages/about/archives/index"
    })
  },
  /**
   * 跳转到留言页面
   */
  toGuestbookPage() {
    wx.navigateTo({
      url:"/pages/about/guestbook/index"
    })
  },
  /**
   * 跳转到日记页面
   */
  toJournalPage() {
    wx.navigateTo({
      url:"/pages/about/journal/index"
    })
  }
})