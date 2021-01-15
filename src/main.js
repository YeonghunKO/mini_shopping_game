function loadJson() {
  return fetch('./data/data.json')
    .then(response => response.json())
    .then(json => json.items);
}

// node_js로 local서버를 켜서 작동해야 json파일을 받아올 수 있다. 왜냐하면 local서버를 켜야 http로 실행이 되기 때문에.
// 따라서, 그냥 index.html을 클릭하면 실행되지 않는다.
// 참고로 data 랑 buisiness code랑 같이 보관하는것을 추천하지 않음. 그래서 data는 따로 보관해야한다.

function displayHtml(item) {
  return `
  <li class="item ${item.type} ${item.color}">
    <img src="${item.image}" alt="${item.type}" class="thumnail" />
    <span class="description">${item.gender}, ${item.size}</span>
  </li>`;
}

// createElement/ append 를 통해서 태그를 만들어도 되지만 이렇게 직관적으로 string template를 통해 return 해줘도 상관없다. 오히려 이게 더 보기 쉬울 수 있다

function displayList(items) {
  const list = document.querySelector('.list');
  list.innerHTML = items.map(item => displayHtml(item)).join('');
  // list태그안에 있는 내용을 innerHTML을 통해서 업데이트 가능
}
// map은 key-value가 있는 object를 loop할때 사용할 수 있구나.
// join함수가 없으면 li 뒤에 , 가 따라 붙어서 쓸데없는 공백이 생겨버린다.

function onButton(event, items) {
  const data = event.target.dataset;
  const key = data.key;
  const value = data.value;
  if (key == null || value == null) {
    return;
  }
  console.log(key, value);
  const list = document.querySelectorAll('.item');

  // <refactoring 1>
  // 아래 코드처럼 filter를 써도 되지만 이렇게 하면 매번 클릭할때마다 list가 업데이트된다.
  // 시간도 에너지도 많이 든다. 따라서 기존에 있는 list에서 클릭한 값에 해당되는 list에다가 display = none 해주는게 더 바람직하다.
  // displayList(
  //   items.filter(item => {
  //     return item[key] === value;
  //   })
  // );

  list.forEach(item => {
    if (item.classList[1] === value || item.classList[2] === value) {
      item.classList.remove('non-visible');
    } else {
      item.classList.add('non-visible');
    }
  });
}

function setClickEvent(items) {
  const buttons = document.querySelector('.button');
  const logo = document.querySelector('.logo');
  buttons.addEventListener('click', event => onButton(event, items));
  logo.addEventListener('click', () => displayList(items));
  // logo를 눌렀을떄 displayList에 items object를 pass하고 싶다고 할때 콜백함수는?
  // function (items) {
  //   displayList(items)
  // }
  // 라고 하면 안된다. 왜냐면 여기서 (items)은 event를 의미하기 때문. setClickevent(itmes)에 pass된 items가 아니라
  // 또한 button을 하나하나 가져와서 event를 추가하는 것 보다 button을 감싸는 태그에다 event를 추가하는게 가독성도 올라가고 유지보수가 쉽다.
  // 이러한 것을 이벤트 위임이라고 한다
}

loadJson()
  .then(items => {
    displayList(items);
    setClickEvent(items);
    console.log(typeof items);
  })
  .catch(err => console.log(err));

// 로직순서

// 1. json을 fetch한다
// 2. 불러온 json을 display 함수에 넣고 알아서 가공한다음 browser에 전달
// 3. setclick 함수에 json을 pass 하고 조건에 따라 filter 되도록 한다

// 팁
// 1. 필요할것 같은 함수의 이름을 일단 적고나서 함수의 기능을 구현해라
//  만들고 나서 적용하지 말고. 우선 가이드라인이 있어야하기 때문. 큰그림을 먼저그려놓고 세부적으로 안에 작은 그림을 채워넣는거다

// 2. 일단 html을 정적으로 만드는것 부터 시작하라. 가이드라인이 되는것도 있지만 일이 탄력받는데 도화선이 되는 목적이 가장 크다.
// 우선 뭔가 진전이 있어야 할 마음이 생기기 때문. 그리고 코드 작성하면서 머리도 빨리빨리 돌아가고

// 3. 도저히 풀리지 않으면 끙끙 앓지말고 질문해라. 힌트를 봐라! 안그럼 엄청난 고통이 느껴지면서 포기하게 될 수 도 있다.

// 새로알게 된 문법
// 1....(spread syntax)
// 예를 들어, 가져온 json 데이터를 여러개의 list로 변환한 뒤에 container에 append 해주려고 한다.
// 이때 forEach를 사용해서 하나하나 append 해줘도 되지만, iterable elements 이므로 ... 를 사용해도 된다. 아래처럼 말이다

// loadItems().then(items => {
//   const elements = items.map(createElement);
//   const container = document.querySelector('.items');
//   console.log(elements.length);
// 아래 코드를
// elements.forEach(item => {
//   container.append(item);
// });
// 요렇게 깔끔하게 바꿀수 있다
//   container.append(...elements);
