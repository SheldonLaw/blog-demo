// 预加载图片
const imgs = ['avatar.png', 'bg_screenshot.jpg', 'container.png'];
const imgEls = {};
let loadCount = 0;
const imgLoad = (callback) => {
	loadCount ++;
	if (loadCount === imgs.length) callback();
}

const preloadImg = (callback) => {
	imgs.forEach((imgUrl) => {
		let img = document.createElement('img');
		// 因为本地运行没有配置跨域，所以不能生成base64图片编码，暂时关闭跨域设置
		// img.crossOrigin = 'Anonymous'; // 【重要】设置跨域，服务器需要返回跨域支持
		img.onload = ()=>{
			imgEls[imgUrl] = img;
			imgLoad(callback);
		};
		img.src = './img/' + imgUrl;
	});
}

// 绘制
let bgCanvas = null;
let screenshotCanvas = null;
const scale = window.innerWidth / 750 * window.devicePixelRatio; // 【重要】以750px(视觉稿给的宽度往往是750px)为基准计算canvas的宽度
const ratio = 1.7; // 截图的高宽比
const width = 750 * scale;
const height = width * ratio;
const screenshotImg = document.querySelector('#screenshotImg');
const getFont = (size) => {
	return size * scale + 'px serif';
}

preloadImg(()=>{
	if (!screenshotCanvas) {
		screenshotCanvas = document.createElement('canvas');
		bgCanvas = document.createElement('canvas');
		screenshotCanvas.width = bgCanvas.width = width;
		screenshotCanvas.height = bgCanvas.height =  height;

		// 绘制不变的内容
		const bgCtx = bgCanvas.getContext('2d');
		bgCtx.drawImage(imgEls['container.png'], (750 - 643) / 2 * scale, 184 * scale, 634 * scale, 843 * scale ); //【重要】 1. 图片水平居中，top从视觉稿中量出来是184 2.  634 * 843是视觉稿中图片的尺寸
		bgCtx.save();
		const avatarR = 103 * scale / 2;
    	bgCtx.arc(540 * scale + avatarR, 244 * scale + avatarR, avatarR, 0, Math.PI * 2, false);
		bgCtx.clip();
		bgCtx.drawImage(imgEls['avatar.png'], 540 * scale, 244 * scale, 103 * scale, 103 * scale );
   	 	bgCtx.restore();
		bgCtx.textAlign = 'center';
		bgCtx.textBaseline = 'middle'; // 【重要】 文本设置垂直居中，默认为向上对齐，但是不同浏览器向上对齐的表现不一样，因此使用垂直居中，下面的591.5， 380相当于文案的中心点位置
		bgCtx.font = getFont(26); // 【重要】计算字号大小，视觉稿上字号大小为26，实际大小为26 * scale
		bgCtx.fillText('昵称', 591.5 * scale, 380 * scale );
	}
	const ctx = screenshotCanvas.getContext('2d');
	ctx.drawImage(imgEls['bg_screenshot.jpg'], 0, 0, 750 * scale, 1280 * scale );
	ctx.save();
	ctx.fillStyle = '#03437a';
	ctx.globalAlpha = 0.9;
	ctx.fillRect(0, 0, width, height);
	ctx.restore();
	ctx.drawImage(bgCanvas, 0, 0);

	// 因为本地运行没有配置跨域头返回，所以不能生成base64图片编码
	// const imgSrc = screenshotCanvas.toDataURL();
	// screenshotImg.src = imgSrc;
	document.body.append(screenshotCanvas);
});