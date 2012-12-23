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

import java.awt.Color;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.MemoryCacheImageOutputStream;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.binary.BinaryQRCodeWriter;

@Service
public class QrCodeCreator {

	private int qrWidth = 250;
	private int qrHeight = 250;

	public BufferedImage createQrImage(byte[] qrContent) {
		try {
			BinaryQRCodeWriter qrCodeWriter = new BinaryQRCodeWriter();
			BitMatrix qrCode = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, qrWidth, qrHeight);
			BufferedImage image = new BufferedImage(qrWidth, qrHeight, BufferedImage.TYPE_BYTE_GRAY);
			Graphics graphics = image.getGraphics();
			graphics.setColor(Color.WHITE);
			graphics.fillRect(0, 0, qrWidth, qrHeight);

			int heightOffset = (qrHeight - qrHeight) / 2;

			for (int x = 0; x < qrWidth; x++) {
				for (int y = 0; y < qrHeight; y++) {
					image.setRGB(x, heightOffset + y, qrCode.get(x, y) ? 0x00 : 0xffffff);
				}
			}
			return image;
		}
		catch (WriterException e) {
			throw new RuntimeException(e);
		}
	}

	public ByteArrayOutputStream encodeBufferedImage(BufferedImage bufferedImage) {
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream(4096);
			ImageWriter writer = ImageIO.getImageWritersBySuffix("png").next();
			writer.setOutput(new MemoryCacheImageOutputStream(baos));
			writer.write(bufferedImage);
			writer.dispose();
			return baos;
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

}
