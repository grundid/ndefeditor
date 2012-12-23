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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/qrCodeDownload")
public class QrCodeDownloadController {

	@RequestMapping(method = RequestMethod.GET)
	public void get(String key, HttpSession session, HttpServletResponse response) throws IOException {
		response.setContentType("image/png");
		ByteArrayOutputStream baos = (ByteArrayOutputStream)session.getAttribute(key);
		session.removeAttribute(key);
		OutputStream out = response.getOutputStream();
		out.write(baos.toByteArray());
		out.flush();
	}
}