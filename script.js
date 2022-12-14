'use strict'
// 1行目に記載している 'use strict' は削除しないでください

//テストケース関数
function test(actual,expected){
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log("Test PASSED!");
      } else {
        console.error("Test FAILED. Keep trying!");
        console.group("Result:");
        console.log("  actual:", actual);
        console.log("expected:", expected);
        console.groupEnd("Result:");
      }   
}

//アコーディオンをクリックした時の動作
$('.title').on('click', function() {//タイトル要素をクリックしたら
	let findElm = $(this).next(".box");//直後のアコーディオンを行うエリアを取得し
	$(findElm).slideToggle();//アコーディオンの上下動作
    
	if($(this).hasClass('close')){//タイトル要素にクラス名closeがあれば
		$(this).removeClass('close');//クラス名を除去し
	}else{//それ以外は
		$(this).addClass('close');//クラス名closeを付与
		console.log(document.querySelector("h3"));
	}
});

//クリックでくす玉が開く
document.querySelector(".kusudama").addEventListener("click",function(){
	if(this.children[0].classList.contains("open")){
		this.children[0].classList.remove("open");
		this.children[1].classList.remove("open");
	}else{
		this.children[0].classList.add("open");
		this.children[1].classList.add("open");
		audio()
		start();
	}
	
})

function audio() {
    document.getElementById('btn_audio').currentTime = 0; //連続クリックに対応
    document.getElementById('btn_audio').play(); //クリックしたら音を再生
}

//ページが読み込まれた際にopenクラスをつけ、openがついていたら開く動作※不必要なら下記全て削除
$(window).on('load', function(){
	document.getElementById("spread").animate(
		{
		  height: 0,
		  opacity: 0.5
		},
		{
		  fill: "forwards",
		  duration: 1000,
		  easing: "ease-in"
		});
	//$('.accordion-area li:first-of-type section').addClass("open"); //accordion-areaのはじめのliにあるsectionにopenクラスを追加
	$(".open").each(function(index, element){	//openクラスを取得
		let Title =$(element).children('.title');	//openクラスの子要素のtitleクラスを取得
		$(Title).addClass('close');				//タイトルにクラス名closeを付与し
		let Box =$(element).children('.box');	//openクラスの子要素boxクラスを取得
		$(Box).slideDown(500);					//アコーディオンを開く
	});
	
	//黒幕が上がる

	  
	}
);

//水玉が動く
document.querySelector(".square").animate(
	{
	  borderRadius: [
		"50% 50% 50% 70%/50% 50% 70% 60%",
		"80% 30% 50% 50%/50%",
		"40% 40% 50% 40%/30% 50% 40% 80%"
	  ]
	},
	{
	  iterations: Infinity,
	  direction: "alternate",
	  duration: 7000
	}
  );




  class Congratulation {
	constructor($elm) {
	  this.$area = $elm;
	  this.id = 'congratulation-style';
	  this.height;
	  this.color = [ // 12カラー
		"#3181A8",
		"#FCEE3D",
		"#D4297E",
		"#D94724",
		"#93CBCE",
		"#3D9148",
		"#E79549",
		"#E397AD",
		"#93CBCE",
		"#D2B155",
		"#AC7DB1",
		"#F5C532"
	  ];
	  this.OPTION = {
		BREAK_POINT: 768,
		ADD_HEIGHT: 70, // 紙吹雪が降る範囲はエリア高＋この高さ
		SPEED_LEVEL: 25, // 小さくするほど速くなる
		PC_QUANTITY: 100, // BREAK_POINT以上での紙吹雪の総枚数
		SP_QUANTITY: 75 // BREAK_POINT以下での紙吹雪の総枚数
	  }
	  this.isPC;
	}
	updateDevice() {
	  let width = window.innerWidth;
	  if (width >= this.OPTION.BREAK_POINT) {
		if (this.isPC) return;
		this.isPC = true;
	  } else {
		if (!this.isPC) return;
		this.isPC = false;
	  }
	}
	addStyle() {
	  // styleタグを作成
	  const css = document.createElement('style');
	  css.media = 'screen';
	  css.type = 'text/css';
	  css.id = this.id;
	  let rulesStr = '';
	  // 移動のkeyframes定義
	  for (let i = -6; i < 6; i++) {
		// moving-1 ～ moving-12 を生成
		rulesStr +=
		  '@keyframes moving-' + parseInt(i+7, 10) + ' {' +
		  '0% { opacity: 0; transform: translate(0, 0); }' +
		  '10% { opacity: 1; }' +
		  '90% { opacity: 1; }' +
		  '100% { opacity: 0; transform: translate(' + i*10 + 'px, ' + (this.height + this.OPTION.ADD_HEIGHT) + 'px); }' +
		  '}';
	  }
	  // ルールをstyleタグに追加
	  const rules = document.createTextNode(rulesStr);
	  css.appendChild(rules);
	  // head内に作成
	  document.getElementsByTagName('head')[0].appendChild(css);
	}
	restart() {
	  $(this.id).remove(); // <head>の<style>タグを削除
	  this.$area.empty(); // 紙吹雪要素を削除
	  this.create(); // <style>生成とHTMLタグ生成を再実行
	}
	create() {
	  this.height = this.$area.innerHeight();
	  // スタイルの生成
	  this.addStyle();
	  // 上から下まで落ちるミリ秒数（エリア高 * スピードレベル + ランダム<0~9> * 100<ミリ秒化>）
	  const duration = this.height * this.OPTION.SPEED_LEVEL + (Math.floor(Math.random() * 10)) * 100;
	  // durationを3分割して、アニメーション開始タイミングを3回に分ける
	  let index = 0;
	  const timer = setInterval(() => {
		let html = '';
		const QUANTITY = this.isPC ? this.OPTION.PC_QUANTITY : this.OPTION.SP_QUANTITY;
		for (let i = 0; i < Math.floor(QUANTITY / 3); i++) {
		  // 1階層目のスタイル生成
		  const keyframe = 'moving-' + (Math.floor(Math.random() * 12) + 1); // 0の生成を防ぐ
		  const delay = duration / (Math.floor(Math.random() * 10));
		  const outerStyle = [
			'top: -20px;',
			'left: ' + Math.floor(Math.random()*100) + '%;',
			'width: ' + (Math.floor(Math.random()*4) + 4) + 'px;',
			'height: ' + (Math.floor(Math.random()*4) + 4) + 'px;',
			'animation: ' + keyframe + ' ' + duration + 'ms linear infinite;',
			'animation-delay: ' + delay + 'ms;'
		  ];
		  // 2階層目・3階層目のスタイル生成
		  const color = this.color[Math.floor(Math.random() * 12)];
		  const rotateKeyframe = Math.floor(Math.random() * 2) ? 'rotateY' : 'rotate360';
		  const innerRotateStyle = rotateKeyframe === 'rotateY' ? 'transform: rotate(' + Math.floor(Math.random() * 60) + 'deg);' : '';
		  const bodyStyle = [
			'background-color: ' + color + ';',
			'animation: ' + rotateKeyframe + ' 500ms linear infinite;',
			'animation-delay: ' + delay + 'ms;'
		  ];
		  // html生成
		  html +=
			'<span style="' + outerStyle.join(' ') + '">' +
			'<span style="' + innerRotateStyle + '">' +
			'<span style="' + bodyStyle.join(' ') + '"></span>' +
			'</span>' +
			'</span>';
		}
		this.$area.append(html);
  
		index += 1;
		if (index >= 2) {
		  clearInterval(timer);
		}
	  }, duration / 3);
	}
	init() {
	  this.isPC = window.innerWidth >= this.OPTION.BREAK_POINT;
	  this.create();
  
	  $(window).on('resize', () => {
		const w = window.innerWidth;
		setTimeout(() => {
		  if (w === window.innerWidth) {
			this.updateDevice();
			this.restart(); // ウィンドウリサイズ時は紙吹雪を作り直し
		  }
		}, 200);
	  });
	}
  }
  
  /*
   * 紙吹雪を舞わせる.
   */
  const $congratulationElm = $('.confetti');
  let congratulation = [];
  for (var i = 0; i < $congratulationElm.length; i++) {
	congratulation.push(
	  new Congratulation($congratulationElm.eq(i))
	);
  }
  
  /**
   * 実行
   */
  const start = () => {
	for (let i = 0; i < congratulation.length; i++) {
	  congratulation[i].init();
	}
  };
  
//   window.addEventListener('load', () => {
// 	start();
//   });
