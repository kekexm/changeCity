//2016-09-23 v-1

var _uploadServerUrl = 'http://static.01event.com/fileupload';
var _uploadSaveUrl = '/';

$(function(){
	
	ajaxGetWeiXinConf();//微信分享
	
	//我同意
	$('.agreeBtn a').click(function(){

		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}
		else{
			$(this).addClass('active');
		}

	})

	//免责声明
	$('.readCopyRightBtn a').click(function(){
		_hmt.push(['_trackEvent', "试驾会上传图片_免责声明打开", 'click', '丰田双擎STATION&试驾会']);
		$('.statement').show();
	});

	//声明关闭
	$('.statementCenter a.closeBtn').click(function(){
		_hmt.push(['_trackEvent', "试驾会上传图片_免责声明关闭", 'click', '丰田双擎STATION&试驾会']);
		$('.statement').hide();
	})

	//声明我同意
	$('.statementCenter a.IamAgreeBtn').click(function(){
		_hmt.push(['_trackEvent', "试驾会上传图片_声明我同意", 'click', '丰田双擎STATION&试驾会']);
		$('.statement').hide();
		$('.agreeBtn a').addClass('active');
	})
	
	//微信分享关闭
	$('.closeBtn a').click(function(){
		_hmt.push(['_trackEvent', "试驾会上传图片_微信分享浮层关闭", 'click', '丰田双擎STATION&试驾会']);
		$('.shareMask').hide();
	})
	
	
	//发送
	var sendFlag = false;
	$('.sendMesBtn a').click(function(){
		
		var speakText = $.trim($('#speakText').val());
		var imgObj = $('.uploadify-button img');
		
		
		if(!speakText){
			alert('请填写您要分享的新鲜事！');
			return;
		}
		
		if(imgObj.length == 0){
			alert('请上传您要分享的图片！');
			return false;
		}
		
		if(!$('.agreeBtn a').hasClass('active')){
			alert('请先阅读免责声明并勾选同意');
			return false;
		}
		
		/*var localStorageName = localStorage.getItem("localStorageName");
		localStorageName = !!localStorageName ? localStorageName : '匿名';*/
		
		var uploadImgArr = [];
		for(var i=0; i<imgObj.length; i++){
			uploadImgArr.push($(imgObj[i]).attr('src'));
		}
		
		if(!!sendFlag){
			return;
		}
		
		sendFlag = true;
		
		var hasToyotaName = localStorage.getItem('TOYOTAWXNICKNAME');//防止重复认证
		var hasToyotaOpenid = localStorage.getItem('TOYOTAWXOPENID');//防止重复认证
		var hasToyotImg = localStorage.getItem('TOYOTAWXHEADIMG');//防止重复认证
		
		$.ajax({
			url:'/testdrive/share',
			type:'post',
			dataType:'json',
			async: false,
			data:{
				'nickname' : hasToyotaName,
				'description' : speakText,
				'picurls' : uploadImgArr.join(','),
				'openid' : hasToyotaOpenid,
				'avatar' : hasToyotImg
			},
			success:function(data){
				
				if(data.state != '0'){
					alert(data.message);
					return false;
				}
				
				$('.shareMask').show();
				
				$('#speakText').val('');
				$('.imgList li[sortAble]').remove();
				$('.imgList li:last').show();
				
				_hmt.push(['_trackEvent', "试驾会上传图片_发送", 'click', '丰田双擎STATION&试驾会']);
				
				sendFlag = false;
				
			},
			error:function(){
				alert('系统繁忙，请稍后再试！');
			}
		});
		
		
		
		
	});

	//图片初始化上传及可拖动排序
	var _callback = function(file,data, currentObj){
		//显示图片
		var img = currentObj.find('a.uploadify-button img');
		if(!img.attr('src')){
			cloneUploadImg(currentObj.parents(".posirela"));
		}
		
		//大于三个的时候隐藏添加按钮
		var listLen = $('.imgList li').length;
		if(listLen > 3){
			$('.imgList li:last').hide();
		}
			
		currentObj.find('a.uploadify-button').html('<img src="' + _uploadServerUrl + _uploadSaveUrl + data.savePath + '">');
		//currentObj.parent().find('a.delete').show();隐藏删除按钮
		currentObj.css("background","none");
		currentObj.parents('li').attr('sortAble','');
		currentObj.parent().find('input[type=hidden]').attr('value',_uploadServerUrl + _uploadSaveUrl + data.savePath);
		return false;
	}

	function cloneUploadImg(obj)
	{
		
		/*需增加逻辑判断的内容
		  1.替换图片回调不增加新的可上传位置
		  2.新增加的图片如果没上传上图片则不增加新的可上传位置
		  3.在删除时如果只有最后一个上传位置时点X只清空已上传内容，不删除上传位置
		*/
		var cloneBar = $("#forClone>li").clone(true);

		obj.parents('li').after(cloneBar);
		
		var currentUploadObj = obj.parent().parent().find("div.upLoadImg:last");
		
		uploadTool(currentUploadObj,{
				fileRootDomSelect:".posirela",
				callback : function(file,data){
					_callback(file,data, currentUploadObj);
				},
				deleteCallBack : function(uploadBox){
					uploadBox.parents('li').remove();
				}
			}
		);
	}

	$('.uploadImgBox').find('.uploadBox').each(function(i){
		var uploadObj = $(this).find(".upLoadImg");
		var fileRootDomSelect = $(this).attr("fileRootDomSelect");
		
		if(!!fileRootDomSelect){
			uploadTool(uploadObj,{
					fileRootDomSelect:fileRootDomSelect,
					callback : function(file,data){
						_callback(file,data, uploadObj);
					},
					deleteCallBack : function(uploadBox){
						uploadBox.parents('li').remove();
					}
				}
			);
		} 
		else 
		{
			uploadTool(uploadObj,{
				fileRootDomSelect : ".posirela",
				sourceCallback : function(){
					cloneUploadImg();
					return false;
				}
			});
		} 
	});
	
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
        		imgUrl : "http://toyota2016.adtmr.com/images/front/after/share.jpg",//图片换成桌面icon
                link : 'http://toyota2016.adtmr.com/jsp/front/before/mobile/share.html',
                desc : "驾驶双擎汽车是什么样的体验？老司机给出了自己的答案...", //描述
                title : "丰田双擎STATION&试驾会",//大标题
                trigger: function (res) {
                    //alert('用户点击发送给朋友');
                },
                complete: function (res) {
                    //alert(JSON.stringify(res));
                },
                success: function (res) {
                	_hmt.push(['_trackEvent', "试驾会上传图片_微信分享", 'click', '丰田双擎STATION&试驾会']);
                	window.location.href = 'http://toyota2016.adtmr.com/jsp/front/before/mobile/index.html';
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

})






