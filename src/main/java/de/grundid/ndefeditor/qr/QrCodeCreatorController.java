/**
 * This file is part of NDEF Editor.
 * Copyright (c) 2012 by Adrian Stabiszewski, as@grundid.de
 *
 * Relation Analyzer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Relation Analyzer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Relation Analyzer.  If not, see <http://www.gnu.org/licenses/>.
 */
package de.grundid.ndefeditor.qr;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;
import org.nfctools.applet.ndef.BuilderConfig;
import org.nfctools.applet.ndef.NdefBuilderService;
import org.nfctools.ndef.NdefContext;
import org.nfctools.ndef.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/qrCodeCreator")
public class QrCodeCreatorController {

	private NdefBuilderService ndefBuilderService = BuilderConfig.getBuilderServiceInstance();
	@Autowired
	private QrCodeCreator qrCodeCreator;

	private ObjectMapper objectMapper = new ObjectMapper();

	@SuppressWarnings("unchecked")
	private List<Record> buildNdefRecords(String json) {
		try {
			List<Map<String, String>> list = objectMapper.readValue(json, ArrayList.class);
			return ndefBuilderService.convert(list);
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody
	Map<String, String> post(String ndefEntries, HttpSession session) {
		List<Record> records = buildNdefRecords(ndefEntries);
		byte[] encode = NdefContext.getNdefMessageEncoder().encode(records);
		BufferedImage bufferedImage = qrCodeCreator.createQrImage(encode);
		ByteArrayOutputStream image = qrCodeCreator.encodeBufferedImage(bufferedImage);

		String key = "qr-" + System.identityHashCode(image);
		session.setAttribute(key, image);

		Map<String, String> map = new HashMap<String, String>();
		map.put("key", key);
		return map;
	}
}
