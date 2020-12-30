// 모듈 가져오기
// npm install axios cheerio
const axios = require('axios');
const cheerio = require('cheerio');

function crawler(){
	
	// 데이터를 갖고 올 url 정의
	const url = `https://news.daum.net/ranking/popular`;
	// axios로 GET 요청 보내기 - HTML 갖고오기
	axios.get(url)
	  .then(res => {
		// console.log(res);	
		if (res.status === 200) {
			// console.log(res.status);		// res의 status
			// console.log(res.data);			// res의 data
			let crawledNews = [];
			
			// tag 검색
			const $ = cheerio.load(res.data);
			const $newsList = $('#mArticle > div.rank_news > ul.list_news2 > li');

			$newsList.each(function (i) {
				crawledNews[i] = {
					title: $(this).find('li > div.cont_thumb > strong > a').text(),
					summary: $(this).find('li > div.cont_thumb > div.desc_thumb > span').text(),
					img:  $(this).find('li > a > img').attr('src'),
				};
			});
			console.log(crawledNews);
		}
	});
}

crawler();