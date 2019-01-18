const contentDiv = $('.content');
const scrollOffset = $('nav').height();
const win = $('#win');
const linux = $('#linux');
const mac = $('#mac');
const dlframe = $('#dlframe');
const downloads = {};

$('a[href*="#"]').on('click', event => {
	event.preventDefault();
	const link = event.target.href;
	const target = link.slice(link.lastIndexOf('#')+1);
	scrollTo(target)
});

function downloadPlatform(platform) {
	dlframe.attr('src', downloads[platform]);
}

function scrollTo(name) {
	const element = $(`#${name}`);
	if (element)
		contentDiv[0].scroll({
		  top: (element.offset().top + contentDiv.scrollTop()) - scrollOffset,
		  //behavior: 'smooth'
		});
	else return;
}

function getYML(url) {
	return fetch(url).then(x => x.text()).then(jsyaml.load)
}

function init() {
	getYML('https://s3.eu-west-1.amazonaws.com/audiobookplayer/builds/win/latest.yml')
	.then(data => populateDownloadSection(data, win, 'win'));

	getYML('https://s3.eu-west-1.amazonaws.com/audiobookplayer/builds/linux/latest-linux.yml')
	.then(data => populateDownloadSection(data, linux, 'linux'));
	
	getYML('https://s3.eu-west-1.amazonaws.com/audiobookplayer/builds/mac/latest-mac.yml')
	.then(data => populateDownloadSection(data, mac, 'mac'));
}

function populateDownloadSection(data, source, platform) {
	source.find('.version').text(data.version)
	source.find('.date').text(new Date(data.releaseDate).toDateString());
	source.find('.sha512').val(data.sha512);
	const url = encodeURI(`https://s3.eu-west-1.amazonaws.com/audiobookplayer/builds/${platform}/${data.path}`);
	downloads[platform] = url;
	const link = source.find('.file');
	link.text(data.path);
	link.attr('href', url);
}

$('.downloadButton a').on('click', () => {
	let platform = '';

	if (navigator.platform.startsWith('Win'))platform = 'win';
	if (navigator.platform.startsWith('Linux'))platform = 'linux';
	if (navigator.platform.startsWith('Mac'))platform = 'mac';

	if (platform) downloadPlatform(platform);
	else scrollTo('downloads');
});

init();