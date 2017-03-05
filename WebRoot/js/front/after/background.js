
/**
 * 阻止事件冒泡
 * @param event
 */
function stopEventBubble(event){
    var e=event || window.event;

    if (e && e.stopPropagation){
        e.stopPropagation();    
    }
    else{
        e.cancelBubble=true;
    }
}


/**
 * 文件上传公用方法
 * select为选择器
 * conf为参数
 * select : select,//选择器字符串
	url : '',//上传路径
	filePath : "",//文件路径
	fileName : "",//文件名称
	fileType : "image",//文件类型(image\file\excel)支持多类型，使用","号分割
	fileSuffix : "",//文件后缀
	fileSizeLimit : 10240,//文件最大上限
	buttonText : '<img src="/images/1_6/common/defaultupLoadImg.jpg" />',//上传按钮内容
	callback : null //文件上传成功回调函数
 */
function uploadTool(select,conf)
{
	
	var suffix = null;
	
	if(!select)
	{
		alert("参数错误！");
		return false;
	}
	var uploadTool = new Object();
	
	// 获取js的路径
	var jsPath = "";
	
	//默认配置
	uploadTool.config = {
		select : select,//选择器字符串
		url : 'http://static.01event.com/file/upload',
		filePath : "",//文件路径
		fileName : "",//文件名称
		fileType : "image",//文件类型(image\file\excel\mp3)支持多类型，使用","号分割
		fileSuffix : "",//文件后缀
		fileSizeLimit : 1024,//文件最大上限，单位KB
		buttonText : '',//上传按钮内容
		callback : null ,//文件上传成功后执行的函数，与sourceCallback的区别在于上传后是否执行默认函数
		sourceCallback : null,//文件上传成功的回调函数(肯定执行)
		deleteCallBack : null,  //删除文件回调函数
		onUploadStart : null, //上传开始时的函数
		fileRootDomSelect : "li", //上传文件根Dom选择器
		autoFileType : true,   //是否自动设置FileType
		parameter : null //用户自定义回调参数，可以传给其他回调函数
	};
	//最终配置
	var settings = $.extend({},uploadTool.config,conf);
	//根据文件类型获取可上传文件类型字符串
	uploadTool.fileTypeExts = function(conf){
		var fileTypeExts = "";
		
		var fileTypeArr = conf.fileType.split(",");
		for(var i = 0;i < fileTypeArr.length;i++)
		{
			if(fileTypeArr[i] == "image")
			{
				//fileTypeExts += '*.jpg;*.jpeg;*.JPG;*.JPEG;*.png;*.PNG;*.gif;*.GIF;*.BMP;*.bmp;';
				fileTypeExts += 'image/*;*.jpg;*.jpeg;*.JPG;*.JPEG;*.png;*.PNG;*.gif;*.GIF;*.BMP;*.bmp;';//针对移动端
			}
			else if(fileTypeArr[i] == "file")
			{
				fileTypeExts += '*.pdf;*.PDF;*.doc;*.DOC;*.docx;*.DOCX;*.xls;*.XLS;*.xlsx;*.XLSX;*.txt;*.TXT;*.ppt;*.PPT;*.pptx;*.PPTX';
			}
			else if(fileTypeArr[i] == "excel")
			{
				fileTypeExts += '*.xls;*.XLS;*.xlsx;*.XLSX;';
			}
			else if(fileTypeArr[i] == "mp3")
			{
				fileTypeExts += '*.mp3;*.MP3;';
			}
			else if(fileTypeArr[i] == "reader")
			{
				fileTypeExts += '*.xls;*.XLS;*.xlsx;*.XLSX;';
				settings.url = "/common/upload/upload";
				jsPath = "http://" + location.host + "/";
			}
		}
		
		return fileTypeExts;
	};
	//获取文件类型，如位置类型则返回null
	uploadTool.getFileType = function(filePath){
		if(!filePath)
		{
			return null;
		}
		var filePathArr = filePath.split(".");
		if(!filePathArr || filePathArr.length < 1)
		{
			return null;
		}
		var fileType = null;
		
		suffix = filePathArr[filePathArr.length - 1].toLowerCase();
		switch(suffix)
		{
			case "jpg" : 
			case "jpeg" :
			case "png" :
			case "gif" :
			case "bmp" :
			fileType = "image";
			break;
			case "doc" : 
			case "docx" :
			case "xls" : 
			case "xlsx" : 
			case "ppt" : 
			case "pptx" : 
			case "pdf" : 
			case "txt" : 
			case "rar" : 
			case "zip" : 
			fileType = "file";
			break;
			case "mp3" : 
			fileType = "file";
			break;
		}
		return fileType;
	};
	
	//获取文件类型图片路径
	uploadTool.getFileImagePath = function(filePath){
		
		var imgPath = settings.fileType == "file" ? "/images/1_7/common/Other.png" : "/images/base/defaultupLoadImg.jpg";
		
		if(!filePath)
		{
			return imgPath;
		}
	
		var filePathArr = filePath.split(".");
		if(!filePathArr || filePathArr.length < 1)
		{
			return imgPath;
		}
		suffix = filePathArr[filePathArr.length - 1].toLowerCase();
		switch(suffix)
		{
			case "jpg" : 
			case "jpeg" :
			case "png" :
			case "gif" :
			case "bmp" :
				imgPath = filePath;
			break;
			
			case "doc" : 
			case "docx" :
				imgPath = "/images/1_7/common/Word.png";
			break;
			
			case "xls" : 
			case "xlsx" : 
				imgPath = "/images/1_7/common/Excel.png";
			break;
			
			case "pdf" : 
				imgPath = "/images/1_7/common/PDF.png";
			break;
			
			
			case "ppt" : 
			case "pptx" : 
				imgPath = "/images/1_7/common/PPT.png";
			break;
			
			case "txt" : 
				imgPath = "/images/1_7/common/TXT.png";
			break;
			
			case "mp3" : 
				imgPath = "/images/1_7/common/MP3.png";
			break;
			/**
			case "rar" : 
			case "zip" : 
			imgPath = "";
			break;
			*/
		}
		
		if(imgPath.indexOf("http://") != 0 && imgPath.substring(0, 1) != "/")
		{
			imgPath = jsPath + imgPath;
		}
		
		return imgPath;
	};
	
	//设置文件名称
	uploadTool.setFileName = function(fileName,filePath){
		if(!fileName)
		{
			return false;
		}
		fileName = decodeURI(decodeURI(fileName));
		if(!!filePath)
		{
			if(filePath.indexOf("http://") != 0 && filePath.substring(0, 1) != "/")
			{
				filePath = jsPath + filePath;
			}
			fileRootDom.find(".docName p").html('<a href="' + filePath + '" target="_blank" >' + fileName + '</a>');
		}
		else
		{
			fileRootDom.find(".docName p").text(data.fileName);
		}
	};
	
	//上传dom	
	var uploadObj = select instanceof jQuery ? select : $(select);
	if(!uploadObj || uploadObj.size() < 1)
	{
		return false;
	}
	
	//上传文件顶级Dom
	var fileRootDom = uploadObj.parents(settings.fileRootDomSelect);
	//判断是否初始化过上传组件，如已初始化则删除原来的重新初始化
	if(fileRootDom.find("input[type='file']").size() > 0)
	{
		fileRootDom.find(".upLoadImg").html("");
	}
	
	//增加删除文件
	fileRootDom.find(".delete").bind("click",function(){
		fileRootDom.find(".uploadify-button").html("");
		fileRootDom.find("input[type='hidden']").val("");
		fileRootDom.find(".docName p").html("");
		fileRootDom.find(".uploadBox .upLoadImg").css("background","url(/images/base/defaultupLoadImg.jpg) 0 0 no-repeat");
		$(this).hide();
		if(!!settings.deleteCallBack && typeof(settings.deleteCallBack) == "function")
		{
			settings.deleteCallBack(fileRootDom);
		}
	});
	
	//解决删除按钮与默认显示图片问题
	var filePathInput = fileRootDom.find("input[type='hidden']");
	if(!!filePathInput.val() && !settings.filePath)
	{
		settings.filePath = filePathInput.val();
		
		if(!!filePathInput.attr("filename"))
		{
			settings.fileName = filePathInput.attr("filename");
		}
		
		fileRootDom.find(".delete").css("display","block");
		fileRootDom.find(".uploadBox .upLoadImg").css("background","none");
	}
	//自动修改fileType
	if(settings.autoFileType && !!settings.filePath && !settings.fileType)
	{
		settings.fileType = uploadTool.getFileType(settings.filePath);
	}
	
	
	//当filePath不为空时，重新设定buttonText内容
	if(!!settings.filePath)
	{
		settings.buttonText = "<img src='" + uploadTool.getFileImagePath(settings.filePath) + "' />";
	}
	//文件名
	if(!!settings.fileName && settings.fileType == "file")
	{
		uploadTool.setFileName(settings.fileName,settings.filePath);
	}
	//设置默认上传大小，图片默认2MB、文件最大20MB
	if(settings.fileType == "image"){
		
		settings.fileSizeLimit = 5 * 1024;
	} else if(settings.fileType == "mp3" ){
		
		settings.fileSizeLimit = 5 * 1024;
	} else {
		
		settings.fileSizeLimit = 200 * 1024;
	}
	
	uploadObj.uploadAdapter({
		auto : true,
		buttonText : settings.buttonText,
		fileObjName : 'file',
		fileTypeExts : uploadTool.fileTypeExts(settings),
		multi : false,
		fileSizeLimit : settings.fileSizeLimit,
		showUploadedPercent : true,//是否实时显示上传的百分比，如20%
		showUploadedSize : true,
		removeTimeout : 500,
		uploader : settings.url,
		onUploadStart : function() {
			uploadObj.find(".uploadify-button").after($("<div id='onbindclick' style='top:0px;width:100px;height:100px;z-index:1000;position:absolute;'></div>"));
			
			if(typeof settings.onUploadStart == "function") {
				settings.onUploadStart();
			}
		},//上传开始时执行的函数
		onUploadComplete : function(file,data)
		{
			data = JSON.parse(data);
			if(!!settings.callback)
			{
				settings.callback(file,data, select);
			}
			else
			{
				var imgUrl = "";
				fileRootDom.find("input[type='hidden']").val(jsPath + data.savePath);
				
				
				//资料文件上传成功后增加
				if(settings.fileType.indexOf("file") >= 0)
				{
					uploadTool.setFileName(data.fileName,data.savePath);
				}
				imgUrl = uploadTool.getFileImagePath(jsPath + data.savePath);
				uploadObj.find(".uploadify-button").html("<img src='" + imgUrl + "' />");
				if(suffix != null
						&&(suffix == 'jpg'
							|| suffix == 'jpeg'
								|| suffix == 'png'
									|| suffix == 'gif'
										|| suffix == 'bmp')){
					uploadObj.css('background','none');
				}
				fileRootDom.find(".delete").show();
			}
			!!settings.sourceCallback && typeof(settings.sourceCallback) == "function" ? settings.sourceCallback(file,data,settings.parameter) : null;
			$("#onbindclick").remove();
		}
	});
	
	if(suffix != null
			&&(suffix == 'jpg'
				|| suffix == 'jpeg'
					|| suffix == 'png'
						|| suffix == 'gif'
							|| suffix == 'bmp')){
		uploadObj.css('background','none');
	}
}
