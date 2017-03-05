var initNum = 0;
var loadNum = 10;
var allP = people;
var allLen = people.length;
var lastInit=0;
var flag = true;
var people = allP.slice(initNum,loadNum);
function allFall(fallLen){
	var num = 0;
	$.each(people,function(index,value){
		var newBox = $('<div>').addClass('box').appendTo($('.water-full'));
		var newPic = $('<div>').addClass('sha-pic').appendTo($(newBox));
		var newText = $('<div>').addClass('sha-text').appendTo($(newBox));
		var newH = '<h2>'+value.name+'</h2>';
		var newP = '<P>'+value.description+'</p>';
		var myText = newH + newP;
		var img = document.createElement('img');
		img.src = value.photos;
		$(img).appendTo($(newPic));
		newText.html(myText);
		
		//图片预加载
		img.onload = function(){
			num++;
			if(num==fallLen){
				waterFall();
			}
		}
	});
};
allFall(10);

//加载更多

$("#fallMore").click(function(){
	var myId = $("#fallMore").attr("myId");
	if(myId == "full"){
		return false;
	}
	if(flag){
		//防止重复点击
		flag = false;
		initNum+=10;
		loadNum+=10;
		if(loadNum>allLen){
			lastInit = loadNum;
			loadNum = allLen;
			initNum = lastInit - 10;
			$("#fallMore").text("没有更多了");
			$("#fallMore").attr("myId","full");
		}
		people = allP.slice(initNum,loadNum);
		var fallLen = people.length;
		allFall(fallLen);
	}
})  

function waterFall(){
	var sBoxs = $('.box');
	var num = sBoxs.length;
	var allW = sBoxs.eq(0).outerWidth();
	var arr = [];
	sBoxs.each(function(index,value){
		var h = sBoxs.eq(index).outerHeight();
		if(index<4){
			arr[index] = h;
		}else{
			var minH = 	Math.min.apply(null,arr);
			var minHindex = $.inArray(minH,arr);
			$(value).css({
				'position': 'absolute',
				'left': allW*minHindex+'px',
				'top': (minH+26)+'px'
			});
			arr[minHindex]+=sBoxs.eq(index).outerHeight();
		};
		var waterHeight = parseInt(sBoxs.eq(num-1).css('top'));
		var selfHeight = sBoxs.eq(num-1).outerHeight();
		$(".water-full").css({"height": waterHeight+selfHeight+200+"px"});
		$(".fall-wrap").css({"height": waterHeight+selfHeight+350+"px"});
		flag = true;
	})

}