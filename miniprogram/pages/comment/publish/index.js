//获取应用实例
const app = getApp();
import { writeComment } from '../../../services/api/content/article';
import { writeSheetComment } from '../../../services/api/content/sheet';
import { STORAGE_KEY, HALO_OPTION_KEY, COMMENT_TYPE } from '../../../services/const-data/const-data';
import apiResult from '../../../utils/api-result';

Page({
  data: {
    title: "分类",
    logo: "",
    slug: "",
    name: "",
    pageNo: 0,
    selected: 0, //当前选中
    content: [],
    loading: false
  },
  
  async onLoad(options) {
    var that = this;
    var id = options.id
    var commmentPid = options.commmentPid
    var commmentPname = options.commmentPname
    var type = options.type
    var title = "评论博文"
    if (type == COMMENT_TYPE.guestbook) {
      title = "留言"
    }
    if (commmentPid != 0) {
      title = "正在回复 " + commmentPname
    }
    
    const userInfo = wx.getStorageSync(STORAGE_KEY.user);
    that.setData({
      userInfo: userInfo,
      commmentPid: commmentPid,
      title: title,
      id: id,
      commmentPname: commmentPname,
      type: type
    })
  },
  async onShow() {
  },
  onReady() {
  },
  /**
   * 评论者输入邮箱
   */
  mailInput(e){
    this.setData({
      commentMail: e.detail.value
    });
  },
  /**
   * 评论内容输入
   * @param {*} e 
   */
  commentInput(e){
    this.setData({
      commentContent: e.detail.value
    });
  },
  /**
   * 是否回复邮箱通知
   * @param {*} e 
   */
  isAllowNotification(e){
    var that = this;
    if (e.detail.value){
      that.setData({
        notifiStatus: true,
      })
    }
  },
  /**
   * 发表评论
   */
  async writeComment(){
    var that = this;
    if(!this.data.commentContent){
      apiResult.warn("内容不能为空");
      return ;
    }
    if(!this.data.commentMail){
      apiResult.warn("邮箱不能为空");
      return ;
    }
    wx.showLoading({
      title: '发布中',
      mask: true,
    })
    const param = {
      allowNotification: this.data.notifiStatus,
      author: this.data.userInfo.nickName,
      authorUrl: this.data.userInfo.avatarUrl,
      content: this.data.commentContent,
      email: this.data.commentMail,
      parentId: this.data.commmentPid,
      postId: this.data.id
    }
    if (that.data.type == COMMENT_TYPE.post) {
      await writeComment(param)
    } else {
      await writeSheetComment(param);
    }
    wx.hideLoading().then(()=>{
      that.setData({
        modalName: null
      })
      var tip = '发表成功'
      var globalOptions = wx.getStorageSync(STORAGE_KEY.options);
      if (globalOptions[HALO_OPTION_KEY.blogTitle]) {
        tip = '发表成功，等待审核'
      }
      apiResult.success(tip);
      wx.navigateBack({
        delta: 1,
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          var options = {
            id: that.data.id,
            type: that.data.type
          }
          page.onLoad(options);
        }
      })
    })
  },
  
});