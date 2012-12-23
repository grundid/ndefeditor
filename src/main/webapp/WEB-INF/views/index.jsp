<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html >
<html lang="en">
<head>
<meta charset="utf-8">
<title>NDEF Editor | GrundID GmbH</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description"
	content="Editor for NDEF Tags. Create and modify NFC tags in your browser. Use your Android Phone or NFC Desktop Reader to write the NDEF records on NFC tags.">
<meta name="author" content="Adrian Stabiszewski, GrundID GmbH">

<!-- Le styles -->
<link href="rs/css/bootstrap.css" rel="stylesheet">
<style>
body {
	padding-top: 60px;
	/* 60px to make the container go all the way to the bottom of the topbar */
}
</style>
<link href="rs/css/bootstrap-responsive.css" rel="stylesheet">
<link href="rs/css/ndefeditor.css" rel="stylesheet">

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed" href="ico/apple-touch-icon-57-precomposed.png">
</head>

<body>

	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span
					class="icon-bar"></span> <span class="icon-bar"></span>
				</a> <a class="brand" href="#"><spring:message code="index.header.title" /></a>
				<div class="nav-collapse">
					<ul class="nav">
						<li class="active"><a href="">Home</a></li>
					</ul>
				</div>
				<!--/.nav-collapse -->
			</div>
		</div>
	</div>

	<div class="container-fluid">
		<header class="hero-unit" style="padding: 10px">
			<p>
				<spring:message code="index.intro" htmlEscape="false" />
			</p>
			<p>
				<a class="btn btn-primary btn-large" data-toggle="modal" href="#helpModal">Learn more</a>
			</p>
		</header>

		<div class="row" style="margin: 10px 0px">
			<div class="menu-button">
				<a class="btn" onclick="Ndef.addRecord('smartPosterRecord');">+Smart Poster Record</a>
			</div>
			<div class="menu-button">
				<a class="btn" onclick="Ndef.addRecord('uriRecord');">+URI Record</a>
			</div>
			<div class="menu-button">
				<a class="btn" onclick="Ndef.addRecord('textRecord');">+Text Record</a>
			</div>
			<div class="menu-button">
				<a class="btn" onclick="Ndef.addRecord('mimeRecord');">+Mime Record</a>
			</div>
			<div class="menu-button">
				<a class="btn" onclick="Ndef.addRecord('androidApplicationRecord');">+Android Application Record</a>
			</div>
		</div>

		<div class="row" style="margin-top: 20px; min-height: 320px">
			<div class="span6">
				<h3>NDEF records queue</h3>
				<ul class="thumbnails" id="ndefRecordList">
				</ul>
			</div>
			<div class="span6">
				<h3>Functions and settings</h3>
				<div style="overflow: hidden">
					<div class="menu-button">
						<a class="btn btn-primary" href="#" onclick="Ndef.createQrCode();">Create QR Code</a> <label class="checkbox"><input
							type="checkbox" id="updateQrCode">&nbsp;Update QR Code automatically</label>
					</div>
					<div class="menu-button">
						<a class="btn btn-primary" href="#" onclick="activateApplet();">Load Java Applet</a>
					</div>
				</div>
				<div id="statusmessage"></div>
				<div id="settings" style="display: none">
					<label class="checkbox" title="Enable this if you want to write the same NDEF message on many tags"><input
						type="checkbox" id="updateCurrentMessage">&nbsp;Disable reading of NDEF message from NFC tag</label> <label
						class="checkbox"
						title="Enable this if you want to make sure the contents of the tag won't get overwritten. Recommended for tags that will be placed in public places."><input
						type="checkbox" id="makeReadonly">&nbsp;Make tag read-only if possible (<strong>cannot be undone</strong>).
					</label>
				</div>
				<div id="readerstatus"></div>
				<div id="ndefOperations"></div>
				<div id="qrCode"></div>

			</div>
		</div>
		<footer class="footer">
			<p>
				Developed by <a href="http://www.grundid.de">GrundID GmbH</a>, Author: <a
					href="https://plus.google.com/104853427339662862228" rel="author">Adrian Stabiszewski</a>, E-Mail: as (at) nfctools
				(dot) org, Build using <a href="https://github.com/grundid/nfctools">nfctools for java</a>
			</p>
		</footer>
	</div>
	<!-- /container -->

	<div class="modal" id="helpModal" style="display: none">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">×</button>
			<h3>NDEF Editor</h3>
		</div>
		<div class="modal-body">
			<spring:message code="index.help" htmlEscape="false" />
			<spring:message code="index.help.java" htmlEscape="false" />
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" onclick="$('#helpModal').modal('hide');">Close</a>
		</div>
	</div>
	<div id="appletContainer"></div>

	<!-- Le javascript
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="rs/js/jquery-1.7.2.min.js"></script>
	<script src="rs/js/bootstrap.min.js"></script>
	<script src="rs/js/ndefeditor.js"></script>
	<script src="rs/js/ndefapplet.js"></script>
</body>
</html>
