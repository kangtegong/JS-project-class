// 모듈 가져오기
const axios = require('axios');
const cheerio = require('cheerio');

// 데이터를 갖고 올 url
const url = `https://www.melon.com/chart/`;

// axios로 GET 요청 보내기 - HTML 갖고오기
axios.get(url)
	.then(res => {
		// console.log(res);
		if (res.status === 200) {
			// console.log(res.status);
			let crawledMovie = [];
			
			// tag 검색
			const $ = cheerio.load(res.data);
			const $movieList = $('table > tbody > tr');
			// console.log($movieList);
			$movieList.each(function (i) {
				crawledMovie[i] = {
					title: $(this).find('div > div > div.ellipsis.rank01 > span > a').text(),
					artist: $(this).find('div > div > div.ellipsis.rank02 > a').text(),
					img:  $(this).find('a.image_typeAll img').attr('src'),
				};
			});
			// console.log(crawledMovie);
		//const data = crawledMovie.filter(m => m.title);
    	console.log(crawledMovie);
		}
	}, (error) => console.log(error));
