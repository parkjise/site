/* *******************************************************
 * filename : common.js
 * description : 전체적으로 사용되는 JS
 * Update : 2022-08-04
******************************************************** */

var laptopWidth = 1366;
var tabletWidth = 1280; // 헤더가 변경되는 시점
var mobileWidth = 800;
startOffset = isMobile() ? "100%" : "70%";
gsap.registerPlugin(ScrollToPlugin);

// default
checkOsBrowser();	
mouseCheck();
translateSkipNav();
triggerScrollObject();
topFixedHeader();
setTopButton();
if ( detectBrowser() === "ie") {
	popupUpdateBrowser();
	convertToEdge();
}

// add
Splitting();
setSplitting();
// if ( !$.exists('#fullpage') ){ smoothScroll(); }
if ( $.exists(".footer-sitemap-list-con") ) { cloneFooterSitemap(); }
if ( $.exists('.footer-partner-list') ) { rollingFooterPartnerList(); }
// 스무스스크롤
SmoothScroll({ 
    animationTime    : 800, // [ms]
    stepSize         : 100, // [px]
    accelerationDelta : 50,  // 50
    accelerationMax   : 3,   // 3
    touchpadSupport   : false, 
});

$(window).on("load",function  () {
	// toAnchorParameter("anchor");	/* 주소~?anchor=content  */
});

$(window).on("resize",function  () {
	checkOsBrowser();
});

/* ************************
* Func : 브라우저 체크 및 기기체크
* isMobile() 필요
************************ */
function checkOsBrowser () {
	if ( isMobile() ) {
		$("html").removeClass("is-pc").addClass("is-mobile").addClass(detectOS()+"-os");
	}else {
		$("html").removeClass("is-mobile").addClass("is-pc").addClass(detectBrowser()+"-browser");
	}
}

/* ************************
* Func : 스킵네비게이션 영문번역
************************ */
function translateSkipNav () {
	if ( $("html").attr("lang") != "ko" ) {
		$(".cm-accessibility a").text("Skip to content");
	}
}

/* ************************
* Func : 웹접근성 키보드이용시
************************ */
function mouseCheck () {
	if ( !isMobile() ) { 
		$("body").mousemove(function(event) { 
			$(this).addClass("mouse");
		});
		$("body").on("keydown touchstart",function(event) { 
			$(this).removeClass("mouse");
		});
	}
}

/* ************************
* Func : 스크롤시 Trigger Class
* Waypoint.js, isMobile () 필요
************************ */
function triggerScrollObject () {
	$("[data-scroll]").each(function() {
		var $scrollElem = $(this);
		var scrollElemOffset = $(this).data("scroll-offset") ? $(this).data("scroll-offset") : startOffset;
		$scrollElem.waypoint(function(direction) {
			if ( direction === "down" ) {
				$scrollElem.addClass('animated');
			}else if ( direction === "up") {
				//$scrollElem.removeClass('animated');
			}
		},
		{
			triggerOnce: false,
			offset: scrollElemOffset
		});
	});
}

/* ************************
* Func : 드롭메뉴 공통
* getWindowWidth () 필요
************************ */
$(".cm-drop-menu-box-JS").each(function  () {
	var $dropBox = $(this);
	var $dropOpenBtn = $(this).find(".cm-drop-open-btn-JS");
	var $dropList = $(this).find(".cm-drop-list-JS");
	var eventState = $dropBox.data("drop-event");
	
	if ( eventState === "click" ) {
		$dropOpenBtn.click(function  () {
			if ($(this).hasClass('cur-location')) {
				if ($dropBox.hasClass('open')) {
					$dropList.slideUp(200);
				}else {
					setTimeout(function(){
						$dropList.slideDown(200);
					},200)
				}
				$dropBox.toggleClass("open");
			}else if($(this).hasClass('drop-custom')){
				var $dropBoxWrap = $(this).parent('.drop-custom-menu');
				var $dropBoxConWrap = $(this).parent('.drop-custom-menu:not(.large-menu)');
				var $dropBoxLargeWrap = $(this).parent('.drop-custom-menu.large-menu');

				if ( getWindowWidth () < mobileWidth ) {
					if ($dropBoxWrap.hasClass('on')) {
						$dropBoxWrap.removeClass('on');
						$dropBoxConWrap.css('height', 4 + 'rem');
						$dropBoxLargeWrap.css('height', 6 + 'rem');
						$dropList.slideUp(200);
					}else {
						$dropBoxWrap.addClass('on');
						$dropBoxConWrap.css('height', 'calc(' + $dropList.height() + 'px + ' + 4 + 'rem)');
						$dropBoxLargeWrap.css('height', 'calc(' + $dropList.height() + 'px + ' + 7 + 'rem)');
						setTimeout(function(){
							$dropList.slideDown(200);
						},200)
					}
				}else {
					if ($dropBoxWrap.hasClass('on')) {
						$dropBoxWrap.removeClass('on');
						$dropBoxConWrap.css('height', 5 + 'rem');
						$dropBoxLargeWrap.css('height', 6 + 'rem');
						$dropList.slideUp(200);
					}else {
						$dropBoxWrap.addClass('on');
						$dropBoxConWrap.css('height', 'calc(' + $dropList.height() + 'px + ' + 5 + 'rem)');
						$dropBoxLargeWrap.css('height', 'calc(' + $dropList.height() + 'px + ' + 7 + 'rem)');
						setTimeout(function(){
							$dropList.slideDown(200);
						},200)
					}
				}
			}else {
				$dropList.slideToggle(500);
				$dropBox.toggleClass("open");
			}
			$dropBox.on("mouseleave", function  () {
				dropClose ();
			});
			return false;
		});
		$("body").click(function  () {
			//dropClose();
		});
	}else if ( eventState === "hover" ) {
		$dropBox.hover(function  () {
			$dropList.slideDown(200);
			$dropBox.addClass("open");
		},function  () {
			dropClose ();
		});
	}
	function dropClose () {
		if ( $dropBox.data("drop-width") ) {
			if ( getWindowWidth () < $dropBox.data("drop-width")+1 ) {
				$dropList.slideUp(200);
				$dropBox.removeClass("open");

				$('.drop-custom-menu').removeClass('on');
				$('.drop-custom-menu:not(.large-menu)').css('height', 5 + 'rem');
				$('.drop-custom-menu.large-menu').css('height', 6 + 'rem');
			}
		}else {
			$dropList.slideUp(200);
			$dropBox.removeClass("open");

			if ( getWindowWidth () < mobileWidth ) {
				$('.drop-custom-menu').removeClass('on');
				$('.drop-custom-menu:not(.large-menu)').css('height', 4 + 'rem');
				$('.drop-custom-menu.large-menu').css('height', 6 + 'rem');
			}else {
				$('.drop-custom-menu').removeClass('on');
				$('.drop-custom-menu:not(.large-menu)').css('height', 5 + 'rem');
				$('.drop-custom-menu.large-menu').css('height', 6 + 'rem');
			}
		}
	}
	$(window).resize(function  () {
		if ( getWindowWidth () > $dropBox.data("drop-width") ) {
			$dropList.removeAttr("style");
		}else {
			$dropList.hide();
		}
	});
});

/* ************************
* Func : 탭 메뉴 공통 사용
* getWindowWidth () 필요
************************ */
$(document).ready(function  () {
	$(".cm-tab-container-JS").each(function  () {
		var $cmTabList = $(this).find(".cm-tab-list-JS");
		var $cmTabListli = $cmTabList.find("li");
		var $cmConWrapper = $(this).children(".cm-tab-content-wrapper-JS");
		var $cmContent = $cmConWrapper.children();
		
		
		// 탭 영역 숨기고 selected 클래스가 있는 영역만 보이게
		var $selectCon = $cmTabList.find("li.selected").find("a").attr("href");
		var selectTxt = $cmTabList.find("li.selected").find("em").text();
		var selectTxt02 = $(".drop-custom-menu .location-menu-con li.selected a").find("em").text();
		var selectTxt03 = $(".topMenu02-inner .location-menu-con li.on a").find("span").text();
		$cmContent.hide();
		$($selectCon).show();

		$cmTabListli.children("a").click(function  () {
			if ( !$(this).parent().hasClass("selected")) {
				var visibleCon = $(this).attr("href");
				$cmTabListli.removeClass("selected");
				$(this).parent("li").addClass("selected");
				$cmContent.hide();
				$(visibleCon).fadeIn();
			}
			return false;
		});

		// 모바일 버튼이 있을때 추가
		var $cmTabMobileBtn = $(this).find(".cm-tab-select-btn-JS");
		if ($.exists($cmTabMobileBtn)) {
			
			if ($cmTabMobileBtn.hasClass('prd-tab-style')) {
				$cmTabMobileBtn.find("span").text(selectTxt);
			}else {
				$cmTabMobileBtn.find("span").text(selectTxt03);
			}
			// Mobile Btn Click
			$cmTabMobileBtn.click(function  () {
				$(this).toggleClass("open").siblings().slideToggle();
				return false;
			});

			// Mobile List Click
			$cmTabListli.children("a").click(function  () {
				$cmTabMobileBtn.find("span").text($(this).find("em").text());
				tabListClose();
			});
			$("body").click(function  () {
				tabListClose();
			});
			function tabListClose () {
				if ( getWindowWidth () < 801 ) {
					$cmTabMobileBtn.removeClass("open").siblings().slideUp();
					$cmTabMobileBtn.removeClass("open").css("height", "6rem");
					$cmTabMobileBtn.removeClass("open").removeClass("on");
				}
			}
			$(window).resize(function  () {
				if ( getWindowWidth () > 800 ) {
					$cmTabMobileBtn.siblings().removeAttr("style");
				}else {
					$cmTabMobileBtn.siblings().hide()//.css("display","none");
				}
			});
		}
	});
});

/* ************************
* Func : 단어 Splitting Plugin 
* Splitting.js 필요
************************ */	
function setSplitting () {
	// Splitting Char Set Delay
	var $splittingTxt = $(".cm-word-split-JS");
	$($splittingTxt).each(function  () {
		splittingTextDelay($(this),$(this).data("speed"),$(this).data("speed-delay"));
	});

	// Splitting word 번역기능 비활성화
	$(".splitting .char").attr("translate","no");
}

/* ************************
* Func : 상단 :: 모바일버전에서 헤더 FIXED
* getWindowWidth (), objectFixed() 필요
************************ */	
function topFixedHeader () {
	checkWidth = getWindowWidth();
	$(window).on("scroll", function  () {
		toggleFixedClass();
	});
	$(window).on("resize", function  () {
		checkWidth = getWindowWidth();
		toggleFixedClass();
	});
}
function toggleFixedClass () {
	/*if ( checkWidth < (tabletWidth-1) ) {
	}else {
		$("#header").removeClass("top-fixed");
	}*/
		objectFixed($("#header"), 0, "top-fixed");
		objectFixed($("#header"), 0, "black");
		objectFixed($("#mainQuickBtn"), 0, "top-fixed");
}

/* ************************
* Func : 상단 :: 검색 toggle
************************ */	
$(".header-search-box").each(function  () {
	var $searchBox = $(this);
	var $openBtn = $(this).find(".header-search-open-btn");
	var $closeBtn = $(this).find(".header-search-close-btn");
	
	$openBtn.click(function  () {
		$searchBox.addClass("open");
	});
	$closeBtn.click(function  () {
		$searchBox.removeClass("open");
	});
});


/* ************************
* Func : 상단 :: 사이트맵 toggle
************************ */
/* -------- 대메뉴복사 후 사이트맵 삽입 -------- */
$(".sitemap-wrapper-style").append("<ul></ul>");

for(var i=0; i < gnbLength; i++){
	var gnbText = $gnbItem.eq(i).children("a").text();
	var gnb2depList = $gnbItem.eq(i).find(".gnb-2dep > ul").html() ? $gnbItem.eq(i).find(".gnb-2dep > ul").html() :	'';
	$(".sitemap-wrapper-style > ul").append('<li><span class="num">0'+(i+1)+'</span><h2>'+gnbText+'</h2><ul class="sitemap-2dep">'+gnb2depList+'</ul></li>');
}

/* -------- 사이트맵 스타일 03, 04, 05 -------- */
var $openSitemapBtn = $(".cm-sitemap-open-btn");
var $closeSitemapBtn = $(".cm-sitemap-close-btn");
var $cmSitemapWrapper = $(".cm-sitemap-wrapper");
var sitemapOpenState = false;
// Split
if ($.exists('#siteMapCon02') || $.exists('#siteMapCon03')) {
	var sitemap_item_tit = document.querySelectorAll(".sitemap-wrapper-style > ul > li > h2");
	var sitemap_item = document.querySelectorAll(".sitemap-wrapper-style > ul > li span");
	Splitting({ target: sitemap_item_tit });
	Splitting({ target: sitemap_item });
}

// Sitemap OPEN
$openSitemapBtn.click(function  () {
	if ($.exists('#siteMapCon06')) {
		if ( !sitemapOpenState ) {
			htmlScrollControl (true);
			$("#header").addClass("sitemap-open");
			$openSitemapBtn.addClass("active");
			$cmSitemapWrapper.addClass("open");
			sitemapOpenState = true;
		}else {
			close_cm_sitemap();
		}
	}else {
		if ( !sitemapOpenState ) {
			htmlScrollControl (true);
			$("#header").addClass("sitemap-open");
			$openSitemapBtn.addClass("active");
			$cmSitemapWrapper.addClass("open");
			sitemapOpenState = true;
		}
	}
	return false;
});
// Sitemap CLOSE
if (!$.exists('#siteMapCon06')) {
	$closeSitemapBtn.click(function  () {
		close_cm_sitemap();
	});
}
$(document).keydown(function(event) {
	if ( event.keyCode == 27 || event.which == 27 ) {
		close_cm_sitemap();
	}
});

function close_cm_sitemap () {
	if ( sitemapOpenState ) {
		$("#header").removeClass("sitemap-open");
		$openSitemapBtn.removeClass("active");
		if ( $cmSitemapWrapper.is("#siteMapCon02") ) { // Sitemap 02 Close
			$cmSitemapWrapper.removeClass("open");
			setTimeout(function  () {
				htmlScrollControl (false);
				sitemapOpenState = false;
			},1000);
		}else {
			gsap.to($cmSitemapWrapper, 0.3, {opacity:0, ease: Sine.easeOut, onComplete : function  () {
				$cmSitemapWrapper.removeClass("open");
				$cmSitemapWrapper.removeAttr("style");
				htmlScrollControl (false);
				sitemapOpenState = false;
			}})
		}
	}
}

/* ************************
* Func : 하단 :: top버튼
* moveScrollTop (), objectFixed() 필요
************************ */
function setTopButton () {
	$(".to-top-btn").each(function  () {
		// top버튼 나오게 (필요한 경우에만 넣으세요)
		if ( $(this).length > 0 ) {
			$(window).scroll(function  () {
				objectFixed($(".to-top-btn"), 0, "bottom-fixed");
			});
		}
		// top버튼 클릭
		$(this).on("click",function  () {
			if ($.exists('#fullpage')) {
				$.fn.fullpage.moveTo(1);
			}else {
				$("html, body").animate({scrollTop:0}, 300 ,"easeInOutExpo",function  () {
					$(".logo > a").focus();
				});
			}
			return false;
		});
	});
}

/* ************************
* Func : 하단 :: 파트너사 리스트
************************ */
function rollingFooterPartnerList () {
	$('.footer-partner-list').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		arrows: true,
		fade: false,
		dots:false,
		autoplay: true,
		speed:500,
		infinite:true,
		autoplaySpeed: 3000,
		easing: 'easeInOutQuint',
		pauseOnHover:false,
		prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button"><i class="xi-angle-left-min"></i></button>',
		nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"><i class="xi-angle-right-min"></i></button>',
		responsive: [
					{
					  breakpoint: 1367,
					  settings: {
						slidesToShow: 5
					  }
					},
					{
					  breakpoint: 1025,
					  settings: {
						slidesToShow: 3
					  }
					}
				  ]
	});
}

/* ************************
* Func : 하단 :: 푸터 사이트맵 삽입(대메뉴복사)
************************ */
function cloneFooterSitemap () {
	$(".footer-sitemap-list-con").append("<ul></ul>");
	
	for(var i=0; i < gnbLength; i++){
		var $gnb1depItem = $gnbItem.eq(i).children("a");
		var $gnb2depList = $gnbItem.eq(i).find(".gnb-2dep > ul").html() ? $gnbItem.eq(i).find(".gnb-2dep > ul").html() :	'<a href="'+$gnb1depItem.attr("href")+'">'+$gnb1depItem.text()+'</a>';
		$(".footer-sitemap-list-con > ul").append('<li><h3>'+$gnb1depItem.text()+'</h3><ul class="sitemap-2dep">'+$gnb2depList+'</ul></li>');
	}
}

/* ************************
* Func : Custom Select 
************************ */
if ($.exists('.custom-select-box .custom-select')) {
	$(".custom-select-box .custom-select").each(function() {
		var classes = $(this).attr("class");
		var id = $(this).attr("id");
		var name = $(this).attr("name"); 
		var placeholder = $(this).attr("placeholder") ? $(this).attr("placeholder") : $(this).find("option:selected").text();
		var template = '<div class="' + classes + '">';
		template += '<span class="custom-select-trigger">' + placeholder + "</span>";
		template += '<ul class="custom-option-drop-list">';
		$(this).find("option").each(function() {
			var first_select = $(this).is(":selected") ? " selection" : "";
			template += '<li class="custom-option-item'+ first_select +'" data-value="' + $(this).attr("value") + '">' + $(this).html() + "</li>";
		});
		template += "</ul></div>";
		$(this).wrap('<div class="custom-select-wrapper"></div>');
		$(this).hide();
		$(this).after(template);
	});
	$(".custom-option:first-of-type").hover(function() {
		$(this).parents(".custom-option-drop-list").addClass("option-hover");
	}, function() {
		$(this).parents(".custom-option-drop-list").removeClass("option-hover");
	});
	$(".custom-select-trigger").on("click", function(event) {
		$("html").one("click", function() {
			$(".custom-select").removeClass("opened");
			$(".custom-option-drop-list").slideUp();
		});
		$(this).parents(".custom-select").toggleClass("opened");
		$(this).siblings(".custom-option-drop-list").slideToggle();
		event.stopPropagation();
	});
	$(".custom-option-item").on("click", function() {
		$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
		$(this).parents(".custom-option-drop-list").find(".custom-option-item").removeClass("selection");
		$(this).addClass("selection");
		$(this).parents(".custom-select").removeClass("opened");
		$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
		// 이메일 선택할때 넣어주세요.
		/* if ($(this).data("value") != "a" && $(this).data("value") != "b") {
			$(".email2").attr("value", $(this).text()).prop("readonly", true);
		} else {
			$(".email2").attr("value", "").prop("readonly", false).focus();
		} */
	});
}
setTimeout(function(){
	followMousePointer ();
})

/* ************************
* Func : Main 포인터 모션
************************ */
function followMousePointer () {
	var $mouse_follow_btn = $(".mouse-pointer");
	$("body").on('mousemove', function (e){
		$mouse_follow_btn.addClass("active is-moving");
		var sxPos = e.pageX / $(this).width() * 100 - 50;
		var syPos = e.pageY / $(this).height() * 100 - 50;
		
		TweenMax.to($mouse_follow_btn, 2, {
			x: e.clientX,
			y: e.clientY,
			ease: Expo.easeOut,
			duration: 1
		});
	});

	$("[data-mouse-pointer='view']")
		.on('mouseenter', function (e){
			$mouse_follow_btn.addClass("view");
		})
		.on('mouseleave', function (e){
			$mouse_follow_btn.removeClass("view");
		})

	$("[data-mouse-pointer='arrow-black']")
		.on('mouseenter', function (e){
			$mouse_follow_btn.addClass("arrow black");
		})
		.on('mouseleave', function (e){
			$mouse_follow_btn.removeClass("arrow black");
		})
}
setTimeout(function(){
	$('.slick-prev').hover(function () {
		if($(this).hasClass("slick-disabled") === true) {
			$(".mouse-pointer").addClass("disabled");
		}
	},function  () {
		$(".mouse-pointer").removeClass("disabled");
	});
	$(".slick-next").hover(function () {
		if($(this).hasClass("slick-disabled") === true) {
			$(".mouse-pointer").addClass("disabled");
		}
	},function  () {
		$(".mouse-pointer").removeClass("disabled");
	});
	$(".slick-prev, .slick-next").on("mouseleave", function () {
		$(".mouse-pointer").removeClass("disabled");
	});
},500);



var count_options = {
	useEasing: true,
	useGrouping: true,
	separator: ",",
	decimal: "."
};
var options_separator = {
	useEasing: true,
	useGrouping: true,
	separator: "",
	decimal: "."
};
function countUpAnimation () {
	var countObj = $("[data-countUp]");	// count 될 object 추가
	countObj.each(function(index) {
		numValue = $(countObj[index]).text();
		numSpeed = 5;	// 각각 커스텀할 경우 data-speed 추가
		numIntType = parseInt(numValue.replace(/,/g , ''));

		// Speed Custom
		if ( $(countObj[index]).data("speed") ) {
			delay = $(countObj[index]).data("speed");
		}else {
			delay = numSpeed;
		}

		// Check Type
		if ( numValue.indexOf(",") != -1 ) {
			isSeparator = count_options;
		}else {
			isSeparator = options_separator;
		}

		var upAnimation = new CountUp(countObj[index], 0, numIntType, 0, delay, isSeparator);

		upAnimation.start();
	});
}

function countUpAnimation2 () {
	var countObj2 = $("[data-countUp2]");	// count 될 object 추가
	countObj2.each(function(index) {
		numValue = $(countObj2[index]).text();
		numSpeed = 5;	// 각각 커스텀할 경우 data-speed 추가
		numIntType = parseInt(numValue.replace(/,/g , ''));

		// Speed Custom
		if ( $(countObj2[index]).data("speed") ) {
			delay = $(countObj2[index]).data("speed");
		}else {
			delay = numSpeed;
		}

		// Check Type
		if ( numValue.indexOf(",") != -1 ) {
			isSeparator = count_options;
		}else {
			isSeparator = options_separator;
		}

		var upAnimation = new CountUp(countObj2[index], 0, numIntType, 0, delay, isSeparator);

		upAnimation.start();
	});
}


/* 버튼 오버 효과 */
setTimeout(function(){
	$('.cm-btn-effect').on('mouseenter', function(e){
		x = e.pageX - $(this).offset().left;
		y = e.pageY - $(this).offset().top;
		$(this).find('.cm-fill').css({top:y, left:x});
	});
},100);


if ($.exists('.fakeform-selectbox')) {
	$('.fakeform-selectbox select').fakeselect();
};

/* *********************** 공통 :: 첨부파일 Custom ************************ */
$(".file-custom-box").each(function  () {
	var fileTarget = $(this).find(".upload-hidden");
	
	fileTarget.on('change', function(){
		if(window.FileReader){
			var filename = $(this)[0].files[0].name;
		} else {
			var filename = $(this).val().split('/').pop().split('\\').pop();
		}
	 
		$(this).siblings('.upload-name').val(filename);
	});
});