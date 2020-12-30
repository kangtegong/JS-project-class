var crudApp = new function () {

    // 수강 데이터에 담을 json 배열 선언
    this.myClass = [
        { ID: '1', Class_Name: '운영체제', Category: '전공필수', Credit: 3 },
        { ID: '2', Class_Name: '컴퓨터구조 및 설계', Category: '전공선택', Credit: 4 },
        { ID: '3', Class_Name: '심리학의 이해', Category: '교양선택', Credit: 3, }
    ]

    // 선택할 수 있는 항목
    this.category = ['전공필수', '전공선택', '교양필수', '교양선택',];

    // -- table header 데이터 만들기 -- 
    // table의 최상단 열 데이터를 담을 배열, header. 확장성을 위해 문자열 하드코딩하지 않기
    this.col = [];
    this.createTable = () => {
        // json 데이터 배열 순회
        for (var i = 0; i < this.myClass.length; i++) {
            // json 데이터의 key값 순회
            for (var key in this.myClass[i]) {
                // indexOf : 문자열 내 문자열 검색. 문자열 내에서 특정한 문자열의 index 값을 리턴. 없으면 -1
                if (this.col.indexOf(key) === -1) {
                    // 없으면 key값 col에 push. col에는 table header (열)이 담김
                    this.col.push(key); 
                }
            }
        }
    
        // -- table 만들기. 만들어둔 col 데이터를 실제로 HTML에 찍기  -- 
        var table = document.createElement('table');
        table.setAttribute('id', 'classTable');

        // table에 맨 마지막에 새 행 만들어주고 (insertRow Empty <tr> element). 참고로 deleteRow는 행 제거
        var tr = table.insertRow(-1);

        for (var h = 0; h < this.col.length; h++) {
            var th = document.createElement('th');
            th.innerHTML = this.col[h];
            //th.innerHTML = this.col[h].replace('_', ' ');
            tr.appendChild(th);
        }

        // -- table 에 데이터 넣어주기 --
        for (var i = 0; i < this.myClass.length; i++) {
            
            // table에 새 행을 일단 추가해주고
            tr = table.insertRow(-1);
            // table header 길이만큼 순회하면서 거기에 매칭되는 데이터 갖고오기
            for (var j = 0; j < this.col.length; j++) {
                // insertCell() - 비어있는 empty table data <td> 만들기
                var tabCell = tr.insertCell(-1);
                // 그리고 그 td 안에는 myClass의 i번째 json의 [this.col[j] 에 매칭되는 데이터 넣기 
                tabCell.innerHTML = this.myClass[i][this.col[j]];
            }

            // update 버튼 만들기
            this.td = document.createElement('td'); // update 버튼은 td에 명시적으로 있어야 한다
            tr.appendChild(this.td);
            var btUpdate = document.createElement('input');

            btUpdate.setAttribute('type', 'button');
            btUpdate.setAttribute('value', 'Update');
            btUpdate.setAttribute('id', 'Edit' + i);
            btUpdate.setAttribute('style', 'background-color:#44CCEB;');
            btUpdate.setAttribute('onclick', 'crudApp.Update(this)');
            this.td.appendChild(btUpdate);

            // save 버튼 만들기
            // 위에서 만든 tr에 td 추가
            tr.appendChild(this.td);    // ??
            var btSave = document.createElement('input');
            btSave.setAttribute('type', 'button');
            btSave.setAttribute('value', 'Save');
            btSave.setAttribute('id', 'Save' + i);
            btSave.setAttribute('style', 'display:none;');          // 일단 안보이게 표시
            btSave.setAttribute('onclick', 'crudApp.Save(this)');   // 이 버튼을 눌렀을 때 Save 실행
            this.td.appendChild(btSave);

            // delete 버튼 만들기
            this.td = document.createElement('td'); // delete 버튼은 td에 명시적으로 있어야 한다
            tr.appendChild(this.td);
            var btDelete = document.createElement('input');
            btDelete.setAttribute('type', 'button');
            btDelete.setAttribute('value', 'Delete');
            btDelete.setAttribute('style', 'background-color:#ED5650;');
            btDelete.setAttribute('onclick', 'crudApp.Delete(this)');
            this.td.appendChild(btDelete);

        }

        // -- 입력 행 추가 -- 
        tr = table.insertRow(-1);

        for (var j = 0; j < this.col.length; j++) {
            var newCell = tr.insertCell(-1);
            if (j >= 1) {
                // 두번째 항목은 dropdown 메뉴
                if (j == 2) {   
                    // 두번째 인덱스는 dropdown메뉴. 카테고리에서 골라야 함
                    var select = document.createElement('select');
                    select.innerHTML = '<option value=""></option>';
                    for (k = 0; k < this.category.length; k++) {
                        // 위에서 넣어준 select.HTML 값에 더해서 아래 값(카테고리의 값) 추가
                        select.innerHTML = select.innerHTML +
                            '<option value="' + this.category[k] + '">' + this.category[k] + '</option>';
                            `<option value="${this.category[k]}">${this.category[k]}</option>`;                    
                    }
                    newCell.appendChild(select);
                }
                // 다른 일반적인 입력값에 대해서
                else {
                    var tBox = document.createElement('input');
                    tBox.setAttribute('type', 'text');
                    tBox.setAttribute('value', '');
                    newCell.appendChild(tBox);
                }
            }
        }

        // create 버튼 만들기
        this.td = document.createElement('td');
        tr.appendChild(this.td);

        var btNew = document.createElement('input');

        btNew.setAttribute('type', 'button');       // SET ATTRIBUTES.
        btNew.setAttribute('value', 'Create');
        btNew.setAttribute('id', 'New' + i);
        btNew.setAttribute('style', 'background-color:#207DD1;');
        btNew.setAttribute('onclick', 'crudApp.CreateNew(this)');       // ADD THE BUTTON's 'onclick' EVENT.
        this.td.appendChild(btNew);
        
        var div = document.getElementById('container');
        div.innerHTML = '수강관리 app';
        div.appendChild(table);    // ADD THE TABLE TO THE WEB PAGE.
    };
    
    // -- 새 데이터 추가 --
    // Create 버튼을 누르면 실행되는 함수
    this.CreateNew = (oButton) => {
        // 몇 번째 행에서 입력되었는지. tr 인덱스 갖고오기
        // .parentNode  // console.log(oButton.parentNode.parentNode);
        // .rowIndex    
        
        var writtenIdx = oButton.parentNode.parentNode.rowIndex;
        var trData = document.getElementById('classTable').rows[writtenIdx];
        // 새 데이터가 담길 비어있는 json 데이터
        var obj = {};

        // tr 데이터에서 key: value만 쏙쏙 뽑아 json (obj)안에 저장하자
        for (i = 1; i < this.col.length; i++) {
            // trData 속 i 번째 td 데이터를 td에 담기 
            var td = trData.getElementsByTagName("td")[i];
            // console.log(td);
            // console.log(td.childNodes[0].value);
            if (td.childNodes[0].getAttribute('type') == 'text' || td.childNodes[0].tagName == 'SELECT') {
                var txtVal = td.childNodes[0].value;
                // txtVal이 비어있지 않다면
                if (txtVal != '') {
                    // obj의 ths.col 의 i번째 데이터에 매칭되는 데이터로 txtVal로 삼는다
                    // obj에서 key는 this.col 배열의 i번째, value는 txtVal
                    obj[this.col[i]] = txtVal.trim();
                }
                // txtVal이 비어있다면
                else {
                    obj = '';
                    alert('all fields are compulsory');
                    break;
                }
            }
        }
        obj[this.col[0]] = this.myClass.length + 1;     // 새 아이디값 부여

        // obj가 비어있지 않다면
        if (Object.keys(obj).length > 0) {
            // json 배열에 추가
            this.myClass.push(obj);
            // table 다시 그리기
            this.createTable();
        }
    }

    // 데이터 삭제
    this.Delete = (oButton) => {
        var writtenIdx = oButton.parentNode.parentNode.rowIndex;
        // .splice : 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        this.myClass.splice((writtenIdx - 1), 1); 
        this.createTable();                         // REFRESH THE TABLE.
    };
    
    // 데이터 수정
    this.Update = (oButton) => {
        // 몇 번째 행에서 입력되었는지. tr 인덱스 갖고오기
        var writtenIdx = oButton.parentNode.parentNode.rowIndex;
        // writtenIdx에서 갖고온 인덱스 기준으로 trData 갖고오기
        var trData = document.getElementById('classTable').rows[writtenIdx];

        // 이미 입력된 데이터 쭉 가지고 오기
        for (i = 1; i < this.col.length; i++) {
            // 2번 인덱스, 즉 dropdown 메뉴에서는 그 인덱스(Update를 누른 인덱스)에서 dropdown메뉴 나오게 하고
            // 그 안에는 기존에 선택한 내용 나오게 하기
            if (i == 2) {
                var td = trData.getElementsByTagName("td")[i];
                // update를 누른 인덱스에 dropdown 메뉴 만들기
                var ele = document.createElement('select');
                // updtae 값을 선택하기 전에 이미 입력한 값이 디폴트로 있게 하기
                ele.innerHTML = `<option value="${td.innerText}">${td.innerText}</option>`;
                for (k = 0; k < this.category.length; k++) {
                    ele.innerHTML = ele.innerHTML +
                        `<option value="${this.category[k]}">${this.category[k]}</option>`;
                }
                // td에는 dropdown 메뉴 이외에는 다른 문자열(html text)은 없음
                td.innerText = '';
                td.appendChild(ele);
            }
            // 다른 textBox의 경웽는 input값 새로 생성
            // 다만 update 버튼을 누르고 input 값이 생겼을 때 input값(input value)에는 이전에 입력한 값이 있게 하기
            else {
                var td = trData.getElementsByTagName("td")[i];
                var ele = document.createElement('input');      // TEXTBOX.
                ele.setAttribute('type', 'text');
                // input값(input value)에는 이전에 입력한 값이 있게 하기
                ele.setAttribute('value', td.innerText);
                // input 태그 이외에 다른 문자열은 없음
                td.innerText = '';
                td.appendChild(ele);
            }
        }

        // update 버튼을 눌렀을 때 등장해야할 Save 버튼 나오게 하기
        var btSave = document.getElementById('Save' + (writtenIdx - 1));
        btSave.setAttribute('style', 'display:block; margin-left:30px; float:left; background-color:#2DBF64;');

        // update 버튼은 숨기기
        oButton.setAttribute('style', 'display:none;');
    };


    // 변경된 값 저장
    this.Save = (oButton) => {
        // 입력이 일어난 인덱스값 얻기
        var writtenIdx = oButton.parentNode.parentNode.rowIndex;
        // 얻어낸 인덱스값을 통해 tr 데이터 얻기
        var trData = document.getElementById('classTable').rows[writtenIdx];

        // 새롭게 입력된 값으로 myClass 배열 갱신
        for (i = 1; i < this.col.length; i++) {
            // 위에서 얻어낸 tr 값 안에 있는 td 데이터 얻어내기
            var td = trData.getElementsByTagName("td")[i];
            // 얻고자 하는 데이터는 td.childNodes
            if (td.childNodes[0].getAttribute('type') == 'text' || td.childNodes[0].tagName == 'SELECT') {  
                // wtittenIdx는 table header도 포함된 값이니 myClass 배열에서는 1 빼줘야 함
                this.myClass[(writtenIdx - 1)][this.col[i]] = td.childNodes[0].value;
            }
        }
        this.createTable();     // 표 초기화
    }

}

crudApp.createTable();