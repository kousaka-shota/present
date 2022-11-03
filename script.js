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
	}
});

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
