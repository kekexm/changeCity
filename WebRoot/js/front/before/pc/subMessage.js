
	var name;
	var maleVal;
	var phone;
	var codeVal;
	var cityVal;
	var timeVal;
	var subDec;
	var yesTimeId;
	//信息提交
	function submitMessage(){
		
		//姓名

		name = $.trim($('#name').val());

		//性别

		maleVal = $.trim($('.test-male a.active').attr('value'));

		//手机号

		phone = $.trim($('#phone').val());

		//验证码

		codeVal = $.trim($('#code').val());

		//城市验证

		cityVal = $.trim($(".sub-city a.sel").attr('value'));
		
		yesTimeId =  $.trim($(".subTime.sel a").attr('id'));

		//试驾时间验证
		
//		timeVal =$.trim($(".sub-time").attr("value"))+' '+ $.trim($(".subTime.sel a").attr('value'));
		
		//如何获得试驾信息
		//var optIndex = document.getElementById("subDes").value;
		//console.log(optIndex);
		subDes = $.trim($("#subDes").val());
		if(!name){
			alert('姓名不能为空');
			return false;
		}

		if(!checkPhone(phone)){
			alert('请输入正确的手机号！');
			return false;
		}
		
		return true;
//		if(!checkCode(codeVal)){
//			alert('请输入正确的验证码！');
//			return false;
//		}
//
//		if(!checkEmail(email)){
//			alert('请输入正确的邮箱格式！');
//			return false;
//		}
//
//		if(!company){
//			alert('公司不能为空');
//			return false;
//		}
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
	
	/**
	 * 验证验证码
	 * @param  {[type]} code [description]
	 * @return {[type]}       [description]
	 */
	function checkCode(code) {
	    if(isNull(code)){
	        return false;
	    }                
	    if (!code.match(/^\d{6}$/)){
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

