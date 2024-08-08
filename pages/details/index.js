//获取应用实例
const app = getApp();
import apiService from '../../utils/api-service'; 
Page({
  data: {
    commentMail: "",
    allowNotification: true,
    commentPrompt: "发表您的观点",
    modalShare: false,
    topImage: app.globalData.topImage,
    logo: "",
    floorstatus: false, //是否显示回到顶端图标
    activeName: [], //相关文章展开标识
    relatedActicleList: [], //相关文章
    upUrl: "",  //上一篇url
    upTitle: "已经是第一篇了",  //上一篇名字
    downUrl: "",  //下一篇url
    downTitle: "已经最后一篇了",  //下一篇名字
		star_img: '/images/star.png',
    tags: [], //文章标签
    loveCount:0,  //点赞数
    commentCount: 0,  //评论树
    userInfo: {},
    checkStatus: true, //评论开关
    comments: [],
    childrenComments: [],

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
    this.setData({
      logo: app.globalData.logo,
      loadModal:true
    })
    var that = this;
    const id = options.id;
    const articleDetails = await this.getArticleDetails(id);
    const comments = await this.getComments(id);
    // const articlePath = "/pages/details/details?id=";
    // var upUrl = that.data.upUrl;
    // var upTitle = that.data.upTitle;
    // var downUrl = that.data.downUrl;
    // var downTitle = that.data.downTitle;
    // //判断是否有上篇及名字超长处理
    // if (articleDetails.other.prev){
    //   upUrl = articlePath + articleDetails.other.prev.id;
    //   let title = articleDetails.other.prev.title;
    //   if (title.length > 19){
    //     title = title.substring(0, 16)+"···";
    //   }
    //   upTitle = title;
    // }
    // //判断是否有下篇及名字超长处理
    // if (articleDetails.other.next) {
    //   downUrl = articlePath + articleDetails.other.next.id;
    //   let title = articleDetails.other.next.title;
    //   if (title.length > 19) {
    //     title = title.substring(0, 16) + "···";
    //   }
    //   downTitle = title;
    // }
    that.setData({
      id: articleDetails.id,
      title: articleDetails.title,
      labels: articleDetails.commentCount,
      topPriority: articleDetails.topPriority,
      createTime: articleDetails.createTime,
      content: articleDetails.originalContent,
      lookCount: articleDetails.visits,
      loveCount: articleDetails.likes,
      commentCount: articleDetails.commentCount,
      tags: articleDetails.tags,
      thumbnail: articleDetails.thumbnail,
      comments: comments,
    });
    this.setData({
      loadModal:false
    })
  },
  async onShow() {
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
    var that = this;
    try {
      const param = {
      };
      const result = await apiService.getArticleDetails(id,param);
      return result;
    } catch (error) {
      return await Promise.reject(error)
    }
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
    this.setData({
      modalName: e.currentTarget.dataset.target,
      commentPrompt: e.currentTarget.dataset.prompt,
    })
    
    const parentId = e.currentTarget.dataset.pid;
    console.log(parentId)
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
   * 是否回复邮箱通知
   * @param {*} e 
   */
  isAllowNotification(e){
    this.setData({
      allowNotification: e.detail.value
    });
  },
  /**
   * 获取文章评论
   */
  async getComments(postId) {
    var that = this;
    try {
      const param = {};
      const result = await apiService.getComments(postId,param);
      for(var i = 0;i<result.content.length;i++){
        if(result.content[i].children){
          const children = that.getChildren(result.content[i].children);
          result.content[i].children = children;
        }
      }
      console.log(result)
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
   * 相关文章展开事件
   */
  onChangeRelated(event) {
    this.setData({
      activeName: event.detail
    });
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
      modalName: null
    })
  },
});