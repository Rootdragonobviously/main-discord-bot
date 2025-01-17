import nodeHtmlToImage from 'node-html-to-image';
import { css, html } from '#lib/util/html';
import { Readable } from 'stream';

export default class HTMLToImage {
	style: any;
	page: any;

	public constructor(page: string, style: Array<string>) {
		this.style = [
			css('body', {
				position: 'absolute',
				margin: '0',
				font_family: 'Gotham',
				font_style: 'normal',
				text_rendering: 'optimizeLegibility'
			}),
			...style
		];

		this.page = html('html', {}, [
			html('head', {}, [
				html('script', {
					src: 'https://twemoji.maxcdn.com/v/latest/twemoji.min.js',
					crossorigin: 'anonymous'
				}),
				html('style', {}, this.style)
			]),
			html('body', {}, [page]),
			html('script', {}, [`twemoji.parse(document.body)`])
		]);
	}

	public async draw() {
		return await nodeHtmlToImage({
			puppeteerArgs: {
				executablePath: 'google-chrome-stable',
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
				ignoreDefaultArgs: ['--disable-extensions']
			},
			// output: 'image.png',
			transparent: true,
			html: this.page
		})
			.then((image) => {
				return Readable.from(image);
			})
			.catch(() => {
				return null;
			});
	}
}
