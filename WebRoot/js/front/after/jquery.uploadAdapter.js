// JavaScript Document
//用于判断客户端浏览器类型，以确定采用何种上传组件
(function($){
$.fn.uploadAdapter = function(opts){
	var defaults = {
		baseUrl: '/js/tools/upload',
		pluginType:null //自己配置使用的插件类型，取值html5或flash
	};
	defaults.swf = defaults.baseUrl+'/uploadify/uploadify.swf';
	var option = $.extend(defaults,opts);
	var _this = this;
	
	//获取HTML5特性支持情况
	var checkSupport = function(){
		var input = document.createElement('input');
		var fileSupport = !!(window.File && window.FileList);
		var xhr = new XMLHttpRequest();
		var fd = !!window.FormData;
		return 'multiple' in input && fileSupport && 'onprogress' in xhr && 'upload' in xhr && fd ? 'html5' : 'flash';
	};

	//调用传进来的上传插件
	var callUploader = function(pluginName,jsUrl,cssUrl){
		_this.each(function(i){
			
			var athis = $(this);
			$.loadScript(jsUrl,'js',function(){
				$.loadScript(cssUrl,'css',function(){
					//该处需要延迟执行一下
					setTimeout(function(){
						athis[pluginName](option);
					},500);
				});
			});
		});
	};

	var pluginName,jsUrl,cssUrl;
	var setLoaderValue = function(type){
		if(type=='html5'){
			pluginName = 'Huploadify';
			jsUrl = option.baseUrl+'/Huploadify/jquery.Huploadify.js';
			cssUrl = option.baseUrl+'/Huploadify/Huploadify.css';
		}
		else{
			pluginName = 'uploadify';
			jsUrl = option.baseUrl+'/uploadify/jquery.uploadify.min.js';
			cssUrl = option.baseUrl+'/uploadify/uploadify.css';
		}
	};

	//如果有配置使用的插件类型，则按照配置的，否则进行客户端支持性判断
	if(option.pluginType){
		setLoaderValue(option.pluginType);
	}
	else{
		setLoaderValue(checkSupport());
	}

	callUploader(pluginName,jsUrl,cssUrl);
};
	
})(jQuery);