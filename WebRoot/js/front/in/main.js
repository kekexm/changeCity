$(function(){
	var conversionCode; //兑换码
	
	var basePath = 'http://toyota2016.adtmr.com/jsp/front/before/mobile/index.html';//官网地址
	
	var getCode = getQueryString("code");

	//初始化页面
	function init(){

		//根据二维码获取信息
		getQrcodeTxt(getCode);

		//注册
		$('.submitBtn a').click(function(){
			submitMessage();
		});

	}
	/**
	* 注册
	 */
	 function submitMessage(){

	 	var name = $.trim($('#name').val());
	 	var phone = $.trim($('#phone').val());
	 	var sex = $.trim($('#sex').val());
	 	//var time = $.trim($('#time').val());

	 	if(!name){
			alert('姓名不能为空');
			return false;
		}

		if(!checkPhone(phone)){
			alert('请输入正确的手机号！');
			return false;
		}
		
		if(sex === '性别'){
			alert('请选择性别！');
			return false;
		}


		/*if(!time){
			alert('请填写预约时间！')
			return false;
		}*/
		
		localStorage.setItem("localStorageName", name);//为分享页面做存储
		
		$.ajax({
			url:'/testdrive/register',
			type:'post',
			dataType:'json',
			data:{
				'name' : name,
				'phone' : phone,
				'sex' : sex,
				//'ordertime' : time, 
				'ordertime' : ''
			},
			success:function(data){
				
				if(data.state != '0'){
					alert(data.message);
					return false;
				}
				
				_hmt.push(['_trackEvent', "试驾会集章_注册成功", 'click', '丰田双擎STATION&试驾会']);

				getQrcodeTxt(getCode);
				
			},
			error:function(){
				alert('系统繁忙，请稍后再试！');
			}
		});
	 }


	/**
	* 二维码内容code
	* code url-code
	 */
	function getQrcodeTxt(code){

		if(!code){
			//没有code值的情况下跳转到手机网站
			window.location.href = basePath;
			return false;
		}

		$.ajax({
			url:'/testdrive/collect',
			type:'post',
			dataType:'json',
			data:{'code' : code},
			success:function(data){
				
				if(data.state == '0' || data.state == '10001'){
					
					$('div[register]').hide();
					$('div[getchaper]').show();
					$('h3.chapTitle').css('visibility','inherit');
					
					var _data = data.data;
					var medals = _data.medals;
					
					//console.log(_data);
					
					//错误code值
					if(medals.length == 0){
						alert(data.message);
						window.location.href = basePath;
						return false;
					}
					
					
					for(var i=0; i<medals.length; i++){
						var sort = parseInt(medals[i].sort);
						var _index = sort -1;
						$('.chaperList li').eq(_index).find('img').attr('src','/images/front/in/a_' + sort + '.png');
					}
					
					_hmt.push(['_trackEvent', "试驾会集章_集章数目总数", 'click', '丰田双擎STATION&试驾会']);
					
					//全部收集完毕
					conversionCode = _data.code;
					if(!!conversionCode){
						$('h3.chapTitle').addClass('active');
						
						_hmt.push(['_trackEvent', "试驾会集章_全部收集完毕", 'click', '丰田双擎STATION&试驾会']);
						
						setTimeout(function(){
							//$('.shareMask').show();
							window.location.href = 'share.html?conversionCode=' + conversionCode;
						},2000);
					}

				}
				else{
					//未登录
					$('div[register]').show();
					$('div[getchaper]').hide();
				}

				//请求code完成之后初始化分享
				//微信分享
				ajaxGetWeiXinConf();

			},
			error:function(){
				alert('系统繁忙，请稍后再试！');
			}
		});
	}




	/**
	* 获取url的字符串
	* name
	 */
	 function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]); return null;
	}

	/**
	 * 验证手机号
	 * @param  {[type]} phone [description]
	 * @return {[type]}       [description]
	 */
	function checkPhone(phone) {
	    if(isNull(phone)){
	        return false;
	    }                
	    if (!phone.match(/^0?1[3|4|5|7|8][0-9]\d{8}$/)) {
	        return false;
	    }
	    return true;
	}

	/**
	 * 验证邮箱
	 * @param  {[type]} email [description]
	 * @return {[type]}       [description]
	 */
	function checkEmail(email) {
	    if(isNull(email)){
	        return false;
	    }
	    if (!email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) {
	        return false;
	    }
	    return true;
	}

	/*
	 * 空值判断处理函数，当传入的对象为string时会做空字符校验
	 * 需要依赖jquery的trim函数
	 *
	 * @param obj : 需要判断的对象
	 * @return : 空位true，非空为false
	 */
	function isNull(obj){
	    var result = true;
	    var type = typeof(obj);
	    /*undefined or null return false*/
	    if(type == "undefined"
	        || obj == null){
	        result = true;
	    } 
	    /*type is string */
	    else if (type == "string"){
	        obj = $.trim(obj);
	        if( obj==""
	            || obj == "undefined"){
	            result = true;
	        }else {
	            result = false;
	        }
	    } 
	    /*other object */
	    else{
	        result = false;
	    }
	    return result;
	}


	/**
     * 获取微信配置
     */
    function ajaxGetWeiXinConf()
    {
        $.ajax({
            url: 'http://static.01event.com/weixin/getConfig',
            data: {
                url : location.href.split('#')[0],
                type : 'share',
                key : 'uwin'
            },
            async: false,
            type: "post",
            dataType: "jsonp",
            success:function(jsonData){

                if(jsonData.state == "0")
                {
                    initWeiXin(jsonData.data);
                }
            },
            error:function(){topTip("操作失败, 请稍候再试！");}
        });
    }

    /**
     * 初始化微信
     * @param data
     */
    function initWeiXin(data)
    {
        wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.noceStr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ]
        });


        wx.ready(function() {

            // 微信分享的数据
            var wxData = {
        		imgUrl : "http://toyota2016.adtmr.com/images/front/in/share.jpg",//换成手机图片的share
                link : basePath,
                desc : "集齐全套印章，我发现了一个了不起的秘密…… ", //描述
                title : "丰田双擎STATION&试驾会",//大标题
                trigger: function (res) {
                    //alert('用户点击发送给朋友');
                },
                complete: function (res) {
                    //alert(JSON.stringify(res));
                },
                success: function (res) {
                	
                	_hmt.push(['_trackEvent', "试驾会集章_微信分享", 'click', '丰田双擎STATION&试驾会']);

                	if(!!conversionCode){
                		window.location.href = 'share.html?conversionCode=' + conversionCode;
                	}

                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                }
            };
            
            //“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage(wxData);
            //“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline(wxData);
            //监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ(wxData);
            //“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo(wxData);
        });
    }

	//开始执行
	init();
	
})

