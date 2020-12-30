// 클릭 시 해당 url을 새 탭에서 열어주는 함수
// chrome.tabs.create : https://developer.chrome.com/docs/extensions/reference/tabs/#method-create
function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}

// Top 10 Visitied url 배열이 주어졌을 때 각각의 url들을 popup.html에 띄워주기
function buildPopupDom(divName, data) {
  var popupDiv = document.getElementById(divName);

  var ul = document.createElement('ul');
  popupDiv.appendChild(ul);

  // url 배열 (data) 만큼 순회하며
  for (var i = 0, ie = data.length; i < ie; ++i) {
    // a 태그 만들고
    var a = document.createElement('a');
    // data 배열의 i 번째 데이터를 href로 삼는다
    a.href = data[i];
    // document.createTextNode(data[i])
    // https://developer.mozilla.org/ko/docs/Web/API/Document/createTextNode
    a.appendChild(document.createTextNode(data[i]));
    // 누르면 새 탭에서 열리는 onAnchorClick 함수 EventListener 추가
    a.addEventListener('click', onAnchorClick);

    var li = document.createElement('li');
    li.appendChild(a);
    ul.appendChild(li);
  }
}

// 가장 핵심이 되는 함수. history를 검색하여 top 10 url을 찾아내어 
// 위에서 정의한 함수로 popup.html에 해당 링크들을 띄워주는 함수
function buildTypedUrlList(divName) {
  
  // chrome.history.search에 넣을 인자
  // 해당 시간동안 마지막으로 방문한 history 검색해주는 api, 즉 browsing history 가져오는 api
  // https://developer.chrome.com/docs/extensions/reference/history/#method-search
  // 일주일 전 = 현재 시간 - 1주일치 ms 빼기
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  // chrome.history.getVisits() 의 콜백 수를 0이 될 때 까지 세는 상수
  // 해당 url에 대한 방문 정보를 가져오는 api
  // https://developer.chrome.com/docs/extensions/reference/history/#method-getVisits
  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '',              // 모든 item들 가지고 오기
      'startTime': oneWeekAgo  // 일주일 전부터 시작하는 데이터들을
    },
    function(historyItems) {
      // 각 historyItems(browsing history)에 대한 세부 정보들을 얻어오기
      // historyItems (https://developer.chrome.com/docs/extensions/reference/history/#type-HistoryItem) 길이만큼 순회하면서
      for (var i = 0; i < historyItems.length; ++i) {
        // 각 url 값들을 url에 담아주고
        var url = historyItems[i].url;
        
        // 그 url에 대한 visit 정보 (visitItems https://developer.chrome.com/docs/extensions/reference/history/#type-VisitItem)를 함께 가지고 오기 위해 클로저로 처리
        var processVisitsWithUrl = function(url) {
          return function(visitItems) {
            processVisits(url, visitItems);
          };
        };
        
        // 해당 url에 대한 방문정보 가져오기
        // https://developer.chrome.com/docs/extensions/reference/history/#method-getVisits
        chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
        numRequestsOutstanding++;
      }
      // numRequestsOutstanding 이 0이 된 순간 최종 결과 보여주기
      if (!numRequestsOutstanding) {
        onAllVisitsProcessed();
      }
    });

  // 유저가 주소창에 입력한 url 과 그 횟수를 매핑
  var urlToCount = {};

  // 위에서 사용된 chrome.history.getVisits()에 대한 Callback 인자.
  // 직접 주소를 입력함으로서 방문한 url들을 세는 함수
  var processVisits = function(url, visitItems) {
    for (var i = 0, ie = visitItems.length; i < ie; ++i) {
      // Ignore items unless the user typed the URL.
      // https://developer.chrome.com/docs/extensions/reference/history/#type-TransitionType
      if (visitItems[i].transition != 'typed') {
        continue;
      }

      if (!urlToCount[url]) {
        urlToCount[url] = 0;
      }

      urlToCount[url]++;
    }

    // 만일 이게 마지막 () 이라면, 이제 popup.html에 뿌려주기
    if (!--numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  };

  // 최종 url 목록들을 받아와 top 10 list로 정렬된 url 배열 만들기
  var onAllVisitsProcessed = function() {
    // Get the top scorring urls.
    urlArray = [];
    for (var url in urlToCount) {
      urlArray.push(url);
    }

    // url 입력 횟수대로 정렬
    // sort에 인자를 넣는 것이 익숙하지 않다면 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    urlArray.sort(function(a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    // 만들어진 urlArray를 DOM에 뿌리기 
    buildPopupDom(divName, urlArray.slice(0, 10));
  };
}

// addEventListener https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener
// DOMContentLoaded: https://developer.mozilla.org/ko/docs/Web/Events/DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  buildTypedUrlList("typedUrl_div");
});