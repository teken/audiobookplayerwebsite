const contentDiv = $('.content');
const scrollOffset = $('nav').height();
const win = $('#win');
const linux = $('#linux');
const mac = $('#mac');
$('a[href*="#"]').on('click', event => {
	event.preventDefault();
	const link = event.target.href;
	const target = link.slice(link.lastIndexOf('#')+1);
	const tElement = $(`#${target}`);
	if (tElement)
		contentDiv[0].scroll({
		  top: (tElement.offset().top + contentDiv.scrollTop()) - scrollOffset,
		  //behavior: 'smooth'
		});
	else return;
});

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
	const link = source.find('.file');
	link.text(data.path);
	link.attr('href', url);
}

init();