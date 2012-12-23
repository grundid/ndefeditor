var NdefRecords = {
	smartPosterRecord : {
		title : "Smart Poster Record",
		fields : [ {
			label : "URI",
			name : "uri",
			type : "text"
		}, {
			label : "Title",
			name : "title",
			type : "text"
		}, {
			label : "Action",
			name : "action",
			type : "select",
			options : [ {
				value : "DEFAULT_ACTION",
				label : "Default action"
			}, {
				value : "SAVE_FOR_LATER",
				label : "Save for later"
			}, {
				value : "OPEN_FOR_EDITING",
				label : "Open for editing"
			} ]
		} ],
		formatter : function(record) {
			return '<h5>Smart Poster Record</h5><p><strong>' + record.title
					+ '</strong></p><p><a href="' + record.uri + '" target="_blank">' + record.uri
					+ '</a></p>';
		}
	},
	uriRecord : {
		title : "URI Record",
		fields : [ {
			label : "URI",
			name : "uri",
			type : "text"
		} ],
		formatter : function(record) {
			return '<h5>URI Record</h5><p><a href="' + record.uri + '">' + record.uri + '</a></p>';
		}
	},
	textRecord : {
		title : "Text Record",
		fields : [ {
			label : "Text",
			name : "text",
			type : "text"
		} ],
		formatter : function(record) {
			return '<h5>Text record</h5><p>' + record.text + '</p>';
		}
	},
	mimeRecord : {
		title : "Mime Record",
		fields : [
				{
					label : "Content type",
					name : "contentType",
					type : "text",
					postProcessor : function(elem) {
						elem.typeahead({
							'source' : [ 'text/', 'text/vcard', 'text/plain', 'text/x-vCard',
									'application/' ]
						});
					}
				}, {
					label : "Content",
					name : "content",
					type : "textarea"
				} ],
		formatter : function(record) {
			return '<h5>Mime Record</h5><p>Content type: <strong>' + record.contentType
					+ '</strong><pre>' + record.content + '</pre>';
		}
	},
	androidApplicationRecord : {
		title : "Android Application Record",
		fields : [ {
			label : "Package name",
			name : "packageName",
			type : "text"
		} ],
		formatter : function(record) {
			return '<h5>Android Application Record</h5><p>Package name: <strong><a href="https://play.google.com/store/apps/details?id='
					+ record.packageName
					+ '" target="_blank">'
					+ record.packageName
					+ '</a></strong></p>';
		}
	},
	createField : function(field, fieldId, data) {
		var elem = $();
		var value = data[field.name] ? data[field.name] : "";
		if (field.type == "text") {
			elem = $('<input type="text" class="span3" value="' + value + '">');
		} else if (field.type == "textarea") {
			elem = $('<textarea style="height:200px" class="span3">' + value + '</textarea>');

		} else if (field.type == "select") {
			elem = $('<select />');
			var optionFound = false;
			for ( var x = 0; x < field.options.length; x++) {
				var optionValue = field.options[x].value;
				var optionLabel = field.options[x].label ? field.options[x].label : optionValue;
				var option = $('<option value="' + optionValue + '">' + optionLabel + '</option>');
				if (value == optionValue) {
					option.attr('selected', 'selected');
					optionFound = true;
				}
				elem.append(option);
			}
			if (!optionFound) {
				var option = $('<option value="' + value + '">' + value + '</option>');
				option.attr('selected', 'selected');
				elem.prepend(option);
			}
		}

		elem.attr("id", fieldId);
		elem.attr("name", field.name);
		if (field.postProcessor)
			field.postProcessor(elem);

		return $('<div class="controls" />').html(elem);
	},

	createFields : function(fields, data) {
		var elem = $('<fieldset />');
		for ( var x = 0; x < fields.length; x++) {
			var fieldId = "input" + x;
			var field = $('<div class="control-group" />');
			field.append('<label class="control-label" for="' + fieldId + '">' + fields[x].label
					+ ':</label>');
			field.append(this.createField(fields[x], fieldId, data));
			elem.append(field);
		}

		return $('<div class="modal-body" />').html(elem);
	},

	createDialog : function(name, data) {
		var config = NdefRecords[name];
		var elem = $('<form class="form-horizontal" style="display: inline" />');
		elem
				.append('<div class="modal-header"><button class="close" data-dismiss="modal">x</button><h3>'
						+ config.title + '</h3></div>');
		elem.append(this.createFields(config.fields, data));

		elem
				.append('<div class="modal-footer">'
						+ '<button class="btn btn-primary" type="button" onclick="Ndef.saveRecord();">Save</button>'
						+ '<button class="btn" type="button" onclick="Ndef.cancelEditRecord();">Cancel</button></div>');
		return $('<div class="modal static" />').html(elem);
	}
};

var Ndef = {
	ndefRecords : [],
	/*
	 * [ { type : "smartPosterRecord", title : "nfctools", uri :
	 * "http://www.nfctools.org" }, { type : "smartPosterRecord", title :
	 * "nfctools", uri : "http://www.nfctools.org", action : "save for later" }, {
	 * type : "textRecord", text : "nfctools" } ],
	 */

	currentData : {},

	deleteRecord : function(idx) {
		this.ndefRecords.splice(idx, 1);
		this.updateList();
	},

	showDialog : function(record) {
		var dialog = NdefRecords.createDialog(record.type, record);
		$('body').append(dialog);
		dialog.modal({
			backdrop : false,
			show : true
		});
		dialog.on('hidden', this.cancelEditRecord);
		this.currentData["record"] = record;
		this.currentData["dialog"] = dialog;
	},

	editRecord : function(idx) {
		var record = this.ndefRecords[idx];
		this.showDialog(record);
	},

	addRecord : function(name) {
		if (this.currentData.dialog)
			return;
		var record = {
			type : name
		};
		this.showDialog(record);
		this.currentData["isNew"] = true;
	},

	saveRecord : function() {
		if (this.currentData.dialog) {
			var formData = this.currentData.dialog.find("form").serializeArray();
			for ( var x = 0; x < formData.length; x++) {
				this.currentData.record[formData[x].name] = formData[x].value;
			}
		}
		if (this.currentData.isNew) {
			this.ndefRecords.push(this.currentData.record);
		}
		this.closeDialog();
		this.updateList();
	},

	cancelEditRecord : function() {
		if (Ndef.currentData.dialog) {
			Ndef.closeDialog();
		}
	},

	closeDialog : function() {
		var currentData = Ndef.currentData;
		Ndef.currentData = {};
		currentData.dialog.modal('hide');
		currentData.dialog.remove();
	},

	clearList : function() {
		$('#ndefRecordList li').remove();
	},

	updateRecords : function(newRecords) {
		this.ndefRecords = newRecords;
		this.updateList();
	},

	updateList : function() {
		this.clearList();
		for ( var x = 0; x < this.ndefRecords.length; x++) {
			var div = $('<div class="thumbnail" />').html(
					this.createNdefRecord(x, this.ndefRecords[x]));
			var elem = $('<li class="span6" />').html(div);
			$('#ndefRecordList').append(elem);
		}
		this.refreshQrCode();
	},

	createNdefRecord : function(idx, ndefRecord) {
		var elem = $('<div class="ndef-record" />');
		elem.append(NdefRecords[ndefRecord.type].formatter(ndefRecord));

		elem
				.append('<div style="position: absolute; top: 4px; right: 4px">'
						+ '<button class="btn btn-mini btn-primary" type="button" onclick="Ndef.editRecord('
						+ idx
						+ ');">Edit</button>&nbsp;'
						+ '<button class="btn btn-mini btn-inverse" type="button" onclick="Ndef.deleteRecord('
						+ idx + ');">Delete</button></div>');
		return elem;
	},
	refreshQrCode : function() {
		if ($('#updateQrCode').get(0).checked)
			this.createQrCode();
		else
			$('#qrCode').html('');
	},
	createQrCode : function() {
		if (Ndef.ndefRecords.length > 0) {
			var json = JSON.stringify(Ndef.ndefRecords);
			$.post("qrCodeCreator", {
				ndefEntries : json
			}, function(data, textStatus) {
				$('#qrCode').html('<img src="qrCodeDownload?key=' + data.key + '" />');
			});
		} else {
			if (!$('#updateQrCode').get(0).checked)
				alert("No records in list. Please add some records first.");
			$('#qrCode').html('');
		}
	}

};

Ndef.updateList();
$('.modal').modal({
	backdrop : false,
	show : false
});