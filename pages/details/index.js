//获取应用实例
const app = getApp();
import apiService from '../../utils/api-service'; 
import apiResult from '../../utils/api-result';
import { Config,ParserStyle } from './../../config/api';

Page({
  data: {
    parserStyle:ParserStyle,
    disallowComment: false,
    isLoadComment: false,
    commentPage: 0,
    commmentPid: 0,
    commentMail: "",
    allowNotification: true,
    commentPrompt: "发表您的观点",
    modalShare: false,
    topImage: app.globalData.topImage,
    logo: "",
    floorstatus: false, //是否显示回到顶端图标
		star_img: '/images/star.png',
    tags: [], //文章标签
    loveCount:0,  //点赞数
    commentCount: 0,  //评论树
    userInfo: {},
    checkStatus: true, //评论开关
    comments: [],
    childrenComments: [],

    //海报相关
    visible: false,
    imgsInfo: {},
    scene: "",
  },
  /**
   * 分享
   */
  async share(event) {
    var that = this;
    that.setData({
      modalShare: true
    })
  },
  /**
   * 取消分享
   */
  async hideModalshare(event) {
    var that = this;
    that.setData({
      modalShare: false
    })
  },
  /**
   * 分享
   * @param {*} res 
   */
  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      imageUrl: this.data.thumbnail?this.data.thumbnail:"",
      path: '/pages/details/index?id='+this.data.id
    }
  },
  async onLoad(options) {
    var id = 0;
    // 扫码打开
    if (options.scene && !options.id) {
      const scene = decodeURIComponent(options.scene);
      var param = this.parseQuery(scene);
      id = param.id;
    } else {
      id = options.id;
    }
    this.setData({
      logo: app.globalData.logo,
      loadModal: true,
      scene: "id=" + id,
    })
    var that = this;
    // const id = options.id;
    const articleDetails = await this.getArticleDetails(id);
    const comments = await this.getComments(id,0);
    if(comments.pages > comments.page+1){
      that.setData({
        isLoadComment: true
      })
    }
    const html = articleDetails.formatContent;
    that.setData({
      id: articleDetails.id,
      title: articleDetails.title,
      labels: articleDetails.commentCount,
      topPriority: articleDetails.topPriority,
      createTime: articleDetails.createTime,
      content: html,
      lookCount: articleDetails.visits,
      loveCount: articleDetails.likes,
      commentCount: articleDetails.commentCount,
      disallowComment: articleDetails.disallowComment,
      tags: articleDetails.tags,
      thumbnail: articleDetails.thumbnail,
      comments: comments.content,
    });
    this.setData({
      loadModal:false
    })
  },
  async onShow() {
    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    that.setData({
      currentPage: currentPage
    })
  },
  wxmlTagATap(e) {
  },
  /**
   * 上滑刷新
   */
  onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.onLoad();
    setTimeout(function() {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      //停止当前页面下拉刷新。
      wx.stopPullDownRefresh()
    }, 1000);
  },
  /**
   * 获取文章详情
   */
  async getArticleDetails(id){
    try {
      const param = {   
        formatDisabled: false
      };
      const result = await apiService.getArticleDetails(id,param);
      return result;
    } catch (error) {
      return await Promise.reject(error)
    }
  },

  // 海报按钮
  shareFrends() {
    var that = this;
    that.setData({
      modalShare: false
    })
    // 需要用户登陆
    var userInfo = wx.getStorageSync(Config.User);
    if (!userInfo.nickName) {
      that.setData({
        modalName: "loginModal",
      })
      return false;
    }
    // 检查必须权限，防止漏掉必要权限
    wx.getSetting({
      success(res) {
        // 保存相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              that.createPoster();
            },
            fail(err) {
              if (err.errMsg.indexOf('-12006') > -1) {
                that.setData({
                  modalName: "settingModal"
                })
              } else {
                return apiResult.error("保存相册授权失败");
              }
            }
          })
        } else {
          that.createPoster();
        }
      }
    })
  },

  // 生成海报
  createPoster() {
    const that = this;
    var userInfo = wx.getStorageSync(Config.User);
    wx.showLoading({
      title: '准备数据',
    })
    wx.cloud.callFunction({
      name: "get_qrcode",
      data: {
        scene: that.data.scene,
        path: that.data.currentPage.route
      },
      success(res) {
        let filePath = wx.env.USER_DATA_PATH + '/' + Date.parse(Date.now) + '_buffer2file.jpg';
        let fileManager = wx.getFileSystemManager();
        fileManager.writeFile({
          filePath: filePath,
          encoding: 'binary',
          data: res.result.buffer,
          success(res) {
            var imgsInfo = {
              title: that.data.title,
              thumbnail: that.data.thumbnail ? that.data.thumbnail : "",
              qrcode: filePath,
              describe: "长按识别识别二维码，坐下来，与" + app.globalData.blogTitle + "一起聊技术",
              bgWhite: "/images/background-white.jpeg",
              detail: "邀你一起来看",
            }
            that.setData({
              imgsInfo: imgsInfo,
              userInfo: userInfo,
            }, () => {
              wx.hideLoading();
              // 使用回调确保生成海报所需数据均已装载完成才开始生成海报
              that.setData({
                visible: true,
              })
            })
          },
          fail(err) {
            console.log(err);
          }
        })
      }
    })
  },

  //关闭海报展示
  close() {
    this.setData({
      visible: false,
    })
  },

  /**
   * 点赞执行
   */
  async doPraise(postId) {
    try {
      const param = {};
      const result = await apiService.doPraise(postId,param);
      return result;
    } catch (error) {
      return error.message;
    }
  },
  /**
   * 点赞结果
   */
  async addStar(event) {
    var that = this;
    var count = event.currentTarget.dataset.lovecount;
    const postId = event.currentTarget.dataset.gid;
    const result = await this.doPraise(postId);
    if (result==null){
      //点赞数加一以界面不刷新显示
      that.setData({
        loveCount: count + 1
      });
      this.setData({
        msgFlag: true,
        msgData: "点赞成功"
      })
      setTimeout(()=> {
        this.setData({
          msgFlag: false
        })
      }, 1000)
    }else{
      this.setData({
        msgFlag: true,
        msgData: result
      })
      setTimeout(()=> {
        this.setData({
          msgFlag: false
        })
      }, 1000)
    }	
  },
  /**
   * 评论
   */
  addComment(e) {
    // 判断该文章评论功能是否关闭
    if(this.data.disallowComment){
      apiResult.warn("评论已关闭");
      return ;
    }
    const userInfo = wx.getStorageSync(Config.User);
    if(!userInfo.nickName){
      this.setData({
        modalName: "loginModal",
      })
    }else{
      this.setData({
        commentContent: "",
        modalName: e.currentTarget.dataset.target,
        commentPrompt: e.currentTarget.dataset.prompt,
        commmentPid: e.currentTarget.dataset.pid,
        userInfo: userInfo,
      })
    }
  },
  /**
   * 获取用户信息
   * @param {*} e 
   */
  getUser(e){
    // wx.setStorageSync(Config.User, e.detail.userInfo);
    // this.setData({
    //   modalName: null,
    // })
    // apiResult.success("登录成功");
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
   * 查询字符串转对象
   */
  parseQuery(query) {
    var reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
    var obj = {};
    while (reg.exec(query)) {
      obj[RegExp.$1] = RegExp.$2;
    }
    return obj;
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
    this.setData({
      allowNotification: e.detail.value
    });
  },
  /**
   * 发表评论
   */
  async writeComment(){
    if(!this.data.commentContent){
      apiResult.warn("内容不能为空");
      return ;
    }
    if(!this.data.commentMail){
      apiResult.warn("邮箱不能为空");
      return ;
    }
    const param = {
      allowNotification: this.data.allowNotification,
      author: this.data.userInfo.nickName,
      content: this.data.commentContent,
      email: this.data.commentMail,
      parentId: this.data.commmentPid,
      postId: this.data.id
    }
    try {
      await apiService.writeComment(param);
      this.setData({
        modalName: null
      })
      apiResult.success("发表成功");
    } catch (error) {
      return error.message;
    }
  },
  /**
   * 获取文章评论
   */
  async getComments(postId,commentPage) {
    var that = this;
    try {
      const param = {
        page: commentPage,
        sort: 'createTime,desc'
      };
      const result = await apiService.getComments(postId,param);
      for(var i = 0;i<result.content.length;i++){
        if(result.content[i].children){
          const children = that.getChildren(result.content[i].children);
          result.content[i].children = children;
        }
      }
      return result;
    } catch (error) {
      return error.message;
    }
  },
  /**
   * 子评论处理
   * 也就是将树一级节点下的子节点归纳为同一级
   */
  getChildren(children){
    var that = this;
    //复制一下，避免队列追加后有变，c用于控制循环
    var c = children;
    for(var i = 0; i < c.length; i++){
      if(c[i].children){
        children = children.concat(that.getChildren(c[i].children));
      }
    }
    return children;
  },
  /**
   * 点击上一篇
   */
  clickUp() {
    var that = this;
    if (!this.data.upUrl) {
      that.setData({
        modalMsg:"已经是第一篇了"
      })
    }else{
      wx.redirectTo({
        url: this.data.upUrl,
      })
    }
  },
  /**
   * 点击下一篇
   */
  clickDown() {
    var that = this;
    if (!this.data.downUrl) {
      that.setData({
        modalMsg:"已经是最后一篇了"
      })
    }else{
      wx.redirectTo({
        url: this.data.downUrl,
      })
    }
  },
  /**
   * 隐藏消息提示
   */
  hideMsg(){
    this.setData({
      modalMsg:""
    })
  },

  /**
   * 滚动条位置判断，从而隐藏/显示回到顶端图标
   * @param {*} e 
   */
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  /**
   * 
   */
  returnTop(e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      commentContent: "",
      modalName: null
    })
  },
  /**
   * 加载更多评论
   */
  async loadComment(){
    var that = this;
    let currentPage = that.data.commentPage;
    const comments = await this.getComments(that.data.id,currentPage+1);
    if(comments.pages <= comments.page+1){
      that.setData({
        isLoadComment: false
      })
    }
    that.setData({
      commentPage: currentPage+1,
      comments: this.data.comments.concat(comments.content)
    })
  }
});