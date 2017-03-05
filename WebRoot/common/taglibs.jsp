<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@page import="com.uwin.sys.SystemConfig"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%
	//该文件只存放jstl等相关文件，不允许添加静态文件如script等，静态文件使用staticFiles.jsp
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName();
	if(request.getServerPort() != 80)
	{
		basePath += ":" + request.getServerPort() + path;
	}
	basePath += "/";
	String accountDomain = SystemConfig.instants().getValue("UWIN_ACCOUNT_DOMAIN");
	String accountPath = SystemConfig.instants().getValue("UWIN_ACCOUNT_PATH");
	if(accountPath == null)accountPath = basePath;
	if(accountDomain == null)accountDomain = basePath;
%>
<c:set var="path" value="<%=path%>" />
<c:set var="basePath" value="<%=basePath%>" />
<c:set var="accountDomain" value="<%=accountDomain %>" />
<c:set var="accountPath" value="<%=accountPath %>" />

<link type="text/css" rel="stylesheet" href="<%=basePath%>css/1_6/basic.css" />

<script type="text/javascript" src="<%=basePath%>js/tools/jquery/jquery-1.10.2.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery.cookie.js"></script>
<script type="text/javascript" src="<%=basePath%>js/tools/copy/jquery.zclip.js"></script>
<script type="text/javascript" src="<%=basePath%>js/tools/slide/superslide.js"></script>
<script type="text/javascript" src="<%=basePath%>js/tools/slide/slimscroll.js"></script>

<script src="<%=basePath%>js/uwinApply/placeholderfriend.js" type="text/javascript"></script>

<!-- 上传 --> 
<script type="text/javascript" src="<%=basePath%>js/upload/jquery.loadscript.js"></script>
<script type="text/javascript" src="<%=basePath%>js/upload/jquery.uploadAdapter.js"></script>
		
		
<script type="text/javascript" src="<%=basePath%>js/main.js"></script>
<script type="text/javascript" src="<%=basePath%>js/page.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jqPaginator/jqPaginator.js"></script>
<script type="text/javascript" src="<%=basePath%>js/json2.js"></script>

<!-- 日期插件 -->
<script charset="utf-8" type="text/javascript" src="<%=basePath%>js/My97DatePicker/WdatePicker.js"></script>

<!-- 层 -->
<script charset="utf-8" type="text/javascript" src="/js/tools/layer/layer.min.js"></script>

<script charset="utf-8"  type="text/javascript">
    window.basePath = "${basePath}";
    window.jsPath = "${basePath}";
    window.accountDomain = "${accountDomain}";
    window.accountPath = "${accountPath}";
</script>