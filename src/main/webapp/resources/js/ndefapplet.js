var NdefApplet = {

	onNdefStarted : function(status) {
		if (status.status == "true") {
			$('#statusmessage').html("<b>" + status.message + "</b>");
			$('#settings').show();
		} else {
			$('#statusmessage').html("<b>Failed: " + status.message + "</b>");
		}
	},
	onStatus : function(status) {
		$('#readerstatus').show().removeClass().html("<b>P2P Status:" + status.status + "</b>")
				.addClass("status-" + status.status);
	},
	showRecords : function(operations) {
		if ($('#updateCurrentMessage').get(0).checked)
			return;
		if (operations.empty)
			Ndef.updateRecords([]);
		else
			Ndef.updateRecords(operations.ndefRecords);
	},
	
	onNdefOperations : function(operations) {
		this.showRecords(operations);
		$('#ndefOperations').html(
				"Tag found<br>Formatted: " + operations.formatted + " Writeable: "
						+ operations.writeable + " Empty: " + operations.empty);
		if (operations.writeable) {
			$('#ndefOperations').append(
					'<div><button class="btn btn-primary" type="button" '
							+ 'onclick="NdefApplet.writeOnTag();">Write on Tag</button></div>');
		}
	},
	onNdefPush : function(ndefPush) {
		this.showRecords(ndefPush);
		$('#ndefOperations').html("NDEF Push received");
	},
	onNdefOperationsFinished : function(data) {
		$('#ndefOperations').html("Finished<br>Status: " + data);
	},
	writeOnTag : function() {
		var operations = {writeable:true};
		if ($('#makeReadonly').get(0).checked)
			operations.writeable = false;
		operations.ndefRecords = Ndef.ndefRecords;
		var ndefApplet = document.JavaNdefApplet;
		var json = window.JSON.stringify(operations);
		ndefApplet.sendAppletMessage(json);
	}
};

function onAppletMessage(jsonMessage) {
	var message = window.JSON.parse(jsonMessage);
	NdefApplet[message.method](message.data);
}

function activateApplet() {
	$('#statusmessage')
			.html(
					"<b>Please wait until the applet loads...</b><p>If this messages does not disappear within a few seconds please make sure you have the right Java version installed.<p>");
	var appletVersion = "20120523.133255-18";
	var appletUrl = "http://maven.grundid.de/snapshots/org/nfctools/nfctools-applet/1.0-SNAPSHOT/nfctools-applet-1.0-"
			+ appletVersion + "-small.jar";

	$('#appletContainer').html(
			'<applet id="ndef" name="JavaNdefApplet" width="0" height="0" '
					+ 'code="org.nfctools.applet.NdefApplet" ' + 'archive="' + appletUrl + '" '
					+ 'mayscript align="left"></applet>');
}

// -- old stuff

var messageId = 0;

function sendMessage(type, form) {
	var record = {};
	var myId = messageId++;
	var jsonObject = {
		"id" : myId,
		"type" : type,
		"record" : record
	};
	for ( var x = 0; x < form.length; x++) {
		if (form[x].name != "")
			record[form[x].name] = form[x].value;
	}
	var msg = formatRecord(jsonObject);
	$('#ndefoutgoing').append(
			"<div id=\"ndefmsg_" + myId
					+ "\" class=\"ndef-message\" style=\"background-color:#a7dbff\">" + msg
					+ "</div>");

	var ndefApplet = document.NdefApplet;
	var json = window.JSON.stringify(jsonObject);
	ndefApplet.sendAppletMessage(json);
}

function resendMessage(raw) {
	var myId = messageId++;
	var jsonObject = {
		"id" : myId,
		"type" : "Raw",
		"raw" : raw
	};
	$('#ndefoutgoing')
			.append(
					"<div id=\"ndefmsg_"
							+ myId
							+ "\" class=\"ndef-message\" style=\"background-color:#a7dbff\">Resending Message. Bytes: "
							+ (raw.length / 2) + "</div>");

	var ndefApplet = document.NdefApplet;
	var json = window.JSON.stringify(jsonObject);
	ndefApplet.addMessage(json);
}

function onNdefPushSuccess(statusJson) {
	var status = window.JSON.parse(statusJson);
	$("#ndefmsg_" + status.id).fadeOut(1000);
}

function onNdefPushFailed(statusJson) {
	var status = window.JSON.parse(statusJson);
	alert("Failed to send message with ID: " + status.id);
	$("#ndefmsg_" + status.id).hide();
}

function onNdefMessages(messages) {
	var msg = "";
	var msgs = window.JSON.parse(messages);
	for ( var x = 0; x < msgs.length; x++) {
		var record = msgs[x];
		msg += "<div class=\"single-record\">" + formatRecord(record) + "</div>";
	}

	var resendIcon = "<span class=\"resend\">"
			+ "<img title=\"Click to resend this message\" onclick=\"resendMessage('"
			+ msgs[0].raw
			+ "');\" src=\"resources/ico-resend.png\">"
			+ "<img title=\"Click to show raw message as HEX bytes\" onclick=\"$(this).parents('.ndef-message').find('.raw-data:first').toggle();\" src=\"resources/ico-open.png\" ></span>";
	var hiddenData = "<div class=\"raw-data\" style=\"display:none\">Raw data:<br><pre>"
			+ slicedRawData(msgs[0].raw) + "</pre></div>";
	$('#ndefmessages').prepend(
			"<div class=\"ndef-message\" style=\"background-color:#a7dbff\">" + resendIcon + msg
					+ hiddenData + "</div>");
	window.setTimeout(function() {
		$('#ndefmessages .ndef-message').css("background-color", "#ffffff");
	}, 2500);
}

function slicedRawData(rawData) {
	var raw = new String(rawData);
	var result = "";
	var index = 0;
	while (index < raw.length) {
		result += raw.substr(index, 48) + "<br>";
		index += 48;
	}
	return result;
}

function formatRecord(record) {
	if (record.type == "UriRecord") {
		return "URI: <a href=\"" + record.record.uri + "\">" + record.record.uri + "</a><br/>";
	} else if (record.type == "TextMimeRecord") {
		return "MimeType: " + record.record.contentType + "<pre>" + record.record.content
				+ "</pre>";
	} else if (record.type == "TextRecord") {
		return "TextRecord:<br/><pre>" + record.record.text + "</pre>";
	} else if (record.type == "ExternalType") {
		return "ExternalType: Namespace: [" + record.record.namespace + "], Content: ["
				+ record.record.content + "]</pre>";
	} else {
		return record.type + " = " + record.record;
	}
}
