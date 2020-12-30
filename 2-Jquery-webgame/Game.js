$(document).ready(function () {

    // -- 데이터 정의-- 
    var circleNumber = 0;
    // option, 공 크기에 따른 색, 지름, 반지름, 속도 정의
    var circleTypes = {
        "option": ["color", "width", "border-radius", "speed"],
        "small": ["black", 5, 2.5, 3000],
        "medium": ["blue", 15, 7.5, 4000],
        "large": ["yellow", 30, 15, 5000]
    };

    // 시간 찍어주는 변수
    var t = 0;

    // 게임 실행 여부
    var gameOn = "false";

    // 마우스 좌표
    var mouseX;
    var mouseY;

    // https://api.jquery.com/event.pagex/
    $("body").mousemove(function (event) {
        mouseX = event.pageX;	// 마우스의 X 좌표
        mouseY = event.pageY;	// 마우스의 Y 좌 (아래로 내려갈수록 커짐)
    });

    // 시작 버튼
    $(".startbutton").click(function () {
        $(".startbutton").fadeToggle(500, function () {
            gameOn = "true"; 			// gameOn = true 전환
            timer();				// timer 시작
            $(".space").mouseenter(function () {
                endgame();				// .space 영역에 마우스가 들어오면 게임 끝
            });
            createCircle();				// 최초의 공 생성
        });
    });

    function timer() {
        // gameOn = "true";
        if (gameOn == "true") {
            // 10ms마다 function() 실행
            setTimeout(function () {
                t = t + 0.01;
                // toFixed(num) : 소수 num번째 자리까지 자름
                // https://opentutorials.org/course/50/133
                $(".timer").html(`<h1><div class="center">` + t.toFixed(2) + "</div></h1>");
                timer();
            }, 10);
        };
    };

    function createCircle() {
        circleNumber++;

        // 1~3 사이의 숫자 랜덤하게 생성
        var randomOneThree = Math.floor(3 * Math.random()) + 1;

        if (randomOneThree == 1) {
            var circleChoice = "small";
        } else if (randomOneThree == 2) {
            var circleChoice = "medium";
        } else if (randomOneThree == 3) {
            var circleChoice = "large";
        };

        // id값으로 지정해줄 예정
        var circleName = "circle" + circleNumber;

        // circleChoice에 맞는 color, size, radius, speed 정의
        var circleColor = circleTypes[circleChoice][0];
        var circleSize = circleTypes[circleChoice][1];
        var circleRadius = circleTypes[circleChoice][2];
        var circleSpeed = circleTypes[circleChoice][3];

        // 이 공이 움직일 수 있는 범위 (길이) : 가로 - 지름(size)
        var moveableWidth = $("body").width() - circleSize;
        var moveableHeight = $("body").height() - circleSize;
        // Math.random() : 0~1
        // toFixed() : 정수로 값 반환
        // moveableWidth, moveableHeight 사이에 만들어내기
        var circlePositionLeft = (moveableWidth * Math.random()).toFixed();
        var circlePositionTop = (moveableHeight * Math.random()).toFixed();

        var newCircle = "<div class='circle' id=" + circleName + "></div>";

        $("body").append(newCircle);

        // 지금 생성된 Circle의 id값에 대한 CSS 지정
        // vmin vmax: https://gahyun-web-diary.tistory.com/115
        $("#" + circleName).css({
            "background-color": circleColor,
            "width": circleSize + "vmin",
            "height": circleSize + "vmin",
            "border-radius": circleRadius + "vmin",
            "top": circlePositionTop + "px",
            "left": circlePositionLeft + "px"
        });

        // 1ms 마다 반복실행하며 마우스와 "#"+circleName 와의 거리 계산, 맞닿으면 게임 오버
        // circleTrackID에 "#"+circleName 넣을 예정
        function timeCirclePosition(circleTrackID) {
            // 1ms 마다 반복실행
            setTimeout(function () {
                var currentCirclePosition = $(circleTrackID).position();
                var calculatedRadius = parseInt($(circleTrackID).css("width")) * 0.5;
                // 마우스와의 거리 계산 - 만일 거리가 반지름보다 작다면(맞닿았다면) 게임 종료
                var distanceX = mouseX - (currentCirclePosition.left + calculatedRadius);
                var distanceY = mouseY - (currentCirclePosition.top + calculatedRadius);
                if (Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <= calculatedRadius) {
                    // 부딪힌 공 빨간색으로 표시
                    $(circleTrackID).removeClass("circle").addClass("redcircle");
                    $(circleTrackID).css("background-color", "red")
                    endgame();
                };
                timeCirclePosition(circleTrackID);
            }, 1);
        };
        timeCirclePosition("#" + circleName);	// 바로 넣어 실행

        animateCircle(circleName, circleSpeed, circleSize);

        // 3초에 한 번씩 createCircle 반복실행하며 새로운 공 생성하기
        setTimeout(function () {
            if (gameOn == "true") createCircle();
        }, 3000);
    };

    // circle 움직이기
    function animateCircle(circleId, speed, circleSize) {

        var moveableWidth = $("body").width() - circleSize;
        var moveableHeight = $("body").height() - circleSize;
        var circleMoveLeft = (moveableWidth * Math.random()).toFixed();
        var circleMoveTop = (moveableHeight * Math.random()).toFixed();

        $("#" + circleId).animate({
            left: circleMoveLeft,
            top: circleMoveTop
        }, speed, function () {
            animateCircle(circleId, speed, circleSize);
        });
    };

    // 게임 오버 함수
    function endgame(){
        if(gameOn== "true"){
            gameOn= "false";
            updateScores(t);
            $(".circle").remove();  // 나머지 공들은 없애고
            $(".redcircle").stop();	// 부딪힌 공은 멈추기
        };
    };

    var resetButton = "<div class='resetbutton center'><h2>Play Again</h2></div>";

    var highScore1 = 0.00;
    var highScore2 = 0.00;
    var highScore3 = 0.00;
    var highScore4 = 0.00;
    var highScore5 = 0.00;

    // 점수 갱신 새로운 점수가 1위~5위 사이에 들 경우 기존 점수판 갱신
    function updateScores(newScore){
        // 새 점수가 highScore1 보다 높은 경우
        if(newScore > highScore1){
            var redScore="score1";  
            highScore5=highScore4;
            highScore4=highScore3;
            highScore3=highScore2;
            highScore2=highScore1;
            highScore1=newScore;
        }
        // 새 점수가 highScore2 보다 높은 경우
        else if(newScore > highScore2){
            var redScore="score2";
            highScore5=highScore4;
            highScore4=highScore3;
            highScore3=highScore2;
            highScore2=newScore;
        }
        // 새 점수가 highScore3 보다 높은 경우
        else if(newScore > highScore3){
            var redScore="score3";
            highScore5=highScore4;
            highScore4=highScore3;
            highScore3=newScore;
        }
        // 새 점수가 highScore4 보다 높은 경우
        else if(newScore > highScore4){
            var redScore="score4";
            highScore5=highScore4;
            highScore4=newScore;
        }
        // 새 점수가 highScore5 보다 높은 경우
        else if(newScore > highScore5){
            var redScore="score5";
            highScore5=newScore;
        };

        // createElemet로 해도 되지 않을까
        var highScorePlace1= "<div class='score center' id='score1'><h2>" + highScore1.toFixed(2) + "</h2></div>";
        var highScorePlace2= "<div class='score center' id='score2'><h2>" + highScore2.toFixed(2) + "</h2></div>";
        var highScorePlace3= "<div class='score center' id='score3'><h2>" + highScore3.toFixed(2) + "</h2></div>";
        var highScorePlace4= "<div class='score center' id='score4'><h2>" + highScore4.toFixed(2) + "</h2></div>";
        var highScorePlace5= "<div class='score center' id='score5'><h2>" + highScore5.toFixed(2) + "</h2></div>";

        // 만들어진 태그 append
        $("#highscores").append(highScorePlace1, highScorePlace2, highScorePlace3, highScorePlace4, highScorePlace5, resetButton);
        $("#"+redScore).css("color", "#D10808");
        $("#highscores").toggle();

        $(".resetbutton").click(function(){
            gameReset();
        });
    };

    // 게임 리셋 함수
    function gameReset(){
        $("#highscores").fadeToggle(100, function(){
            t = 0; 		// 공 개수를 나타내는 i도 초기화
            $(".timer").html("<h1 class='center'>"+ t.toFixed(2) + "</h1>"); // 지금까지의 시간 찍어주기
            $(".resetbutton").remove();	// 리셋버튼 없애기
            $(".score").remove();		// score 보드 없애기
            $(".startbutton").toggle();	// startbutton 생성
            $(".redcircle").remove();	// 부딪힌 공 없애기
        });
    };
});
