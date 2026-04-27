#!/usr/bin/env node
import Fs from 'node:fs';
import Path from 'node:path';

import * as Commander from 'commander';

import { UtilsPdf } from './utils/utils_pdf.js';

class MainHelper {
	async fromPdf(inputPath: string): Promise<void> {
		const pdfBuffer = await Fs.promises.readFile(inputPath);
		const imageBuffers = await UtilsPdf.pdf2images(pdfBuffer);

		const inputDir = Path.dirname(inputPath);
		const inputBase = Path.basename(inputPath, Path.extname(inputPath));

		for (let pageIndex = 0; pageIndex < imageBuffers.length; pageIndex++) {
			const pageNumber = pageIndex + 1;
			const outputPath = Path.resolve(inputDir, `${inputBase}.page${pageNumber}.png`);
			await Fs.promises.writeFile(outputPath, imageBuffers[pageIndex]);
			console.log(`wrote ${outputPath}`);
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

async function main() {
	const program = new Commander.Command();

	program
		.name('resumejson_cli')
		.description('Command-line interface for resume JSON tooling.')
		.version('1.0.0');

	const mainHelper = new MainHelper();

	program
		.command('from_pdf')
		.description('Extract resume JSON from a PDF file')
		.argument('<inputPdfPath>', 'path to the input PDF file')
		.action(async (inputPdfPath: string) => {
			await mainHelper.fromPdf(inputPdfPath);
		});



	program.parse(process.argv);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

void main()