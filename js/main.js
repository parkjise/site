/* *******************************************************
 * filename : main.js
 * description : 메인에만 사용되는 JS
 * date : 2022-08-08
******************************************************** */

$(document).ready(function  () {
	/* ************************
	* Func : 메인페이지 접속 시
	************************ */
	// fadeIn
	$(".ms-preloader").animate({"opacity":"0"},600,"easeInOutCubic",function  () {
		$(".ms-preloader").css("visibility", "hidden");
	});
	setTimeout(function  () {
		addClassName($(".main-page"), "main-active");
		addClassName($("#header"), "header-top");
	},200);
	setTimeout(function  () {
		addClassName($(".main-page"), "main-intro");
	},800);
	setTimeout(function  () {
		addClassName($(".main-page"), "main-active02");
	},1000);

	/* ************************
	* Func : fullpage 레이아웃 사용시
	* fullpage.js , detectBrowser() 필요
	************************ */
	if ($.exists('#fullpage')) {
		var $fullPage = $("#fullpage");
		var $fullPageSection = $fullPage.children(".section");
		$fullPage.fullpage({
			css3: true,
			fitToSection: false,
			navigation: true,
			scrollBar:false,
			scrollingSpeed:1000,
			responsiveWidth: tabletWidth + 1,
			responsiveHeight : 750,
			onLeave : function(origin, destination, direction){
				setTimeout(function  () {
					$(".section").eq(destination-1).addClass("animated");
				},200);
				// 사이드바 색상변경
				if ( destination > 1) {
					$("#header").removeClass("header-top");
					$('#mainQuickBtn').addClass('top-fixed');
				}else {
					$("#header").addClass("header-top");
					$('#mainQuickBtn').removeClass('top-fixed');
				}

				if ( destination == 1) {
					//$('#mainContent1').addClass('down');
					$("#header").removeClass("black");
				}else if ( destination == 2) {
					$("#header").addClass("black");

					$('#mainContent1').removeClass('up down');

				}else if ( destination == 3) {
					//$('#mainContent1').addClass('up');
					if (!$('#mainContent2').hasClass('animated')) {
						countUpAnimation();
					}

					$("#header").removeClass("black");
					$fullPage.fullpage.setAllowScrolling(false);
					if ( getWindowWidth () > tabletWidth + 1 ) {
						fullpageScroll();
						$('.fullpage-inner-scroll').on('scroll', { passive: true }, fullpageScroll);
					}
				}else if ( destination == 4) {
					$fullPage.fullpage.setAllowScrolling(false);
					if ( getWindowWidth () > tabletWidth + 1 ) {					
						fullpageScrollBottom();
						$('.fullpage-inner-scroll-bottom').on('scroll', { passive: true }, fullpageScrollBottom);
					}
					if (!$('#mainContentBottom').hasClass('animated')) {
						countUpAnimation2();
					}
					$('#mainContent4').addClass('pre-animated');
					$("#header").addClass("black");
				}

				/*if ( destination > 5 )  {
					$("body:not('.fp-responsive')").find("#header").addClass('main-bottom');	// ie responsive모드에서 상단으로 이동시 destination 오류로 추가
					$('#mainQuickBtn').css('bottom', 'calc(10rem + '+ $('#footer').height() +'px)')
					$('#mainQuickBtn').addClass('bottom-fixed');
				}else {
					$("body:not('.fp-responsive')").find("#header").removeClass('main-bottom');
					$('#mainQuickBtn').css('bottom', '10rem')
					$('#mainQuickBtn').removeClass('bottom-fixed');
				}*/
			}
		});
	}

	/* ************************
	* Func : 메인 비주얼 높이 설정 및 slick 슬라이드
	* slick.js , getWindowWidth(), getWindowHeight() 필요
	************************ */
	// 메인 비주얼 높이값 설정
	if ($.exists('#mainVisual.full-height')) {
		mainVisualHeight();
		$(window).on('resize', mainVisualHeight);

		function mainVisualHeight () {
			var visual_height = getWindowHeight()	- $("#header").height();	// header가 fixed or absolute일경우 - $("#header").height() 삭제
			$("#mainVisual").height(visual_height);
		}
	}

	// 메인 비주얼 고정 텍스트 Active
	if ($.exists('.main-visual-fixed-txt-con')) {
		addClassName($(".main-visual-fixed-txt-con"), "active-item");
	}

	// 메인 비주얼 슬라이드
	var $mainVisualItem = $(".main-visual-con");

	function playPauseVideo(slick, control){
	  var currentSlide, video;

	  currentSlide = slick.find(".slick-current");
	  if (currentSlide.hasClass('video')) {
		$mainVisualItem.slick("slickPause");
		video = currentSlide.children("video").get(0);
		if (video != null) {
		  if (control === "play"){
			video.play();
		  } else {
			video.pause();
		  }
		}
	  }
	  else if (currentSlide.hasClass('image')) {
		$mainVisualItem.slick("slickPlay");
	  }
	}

	$mainVisualItem.on('init', function(event, slick, currentSlide) {
		$(".main-visual-item").eq(0).addClass("active-item");
		slick = $(slick.currentTarget);
		playPauseVideo(slick,"play");
	});
	$mainVisualItem.on('beforeChange', function(event, slick, currentSlide, nextSlide) {	
		$(this).find(".main-visual-item").eq(nextSlide).addClass("active-item");
		$(this).addClass('change');
		if ($(this).find(".main-visual-item").eq(nextSlide).hasClass('video')) {
			$(this).find('.video video').get(0).play();
		}else {
			slick = $(slick.$slider);
			playPauseVideo(slick,"pause");
		}
	});
	$mainVisualItem.on("afterChange", function(event, slick, currentSlide) {
		if (!($(this).find(".main-visual-item").eq(currentSlide).hasClass("video"))) {
			$mainVisualItem.find('.video video').get(0).currentTime = 0;
		}
		slick = $(slick.$slider);
		playPauseVideo(slick,"play");
		
	});

	$mainVisualItem.slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		appendArrows:$('.main-visual-arrows'),
		fade: true,
		dots:false,
		//autoplay: true,
		speed:1000,
		infinite:true,
		autoplaySpeed: 4000,
		easing: 'easeInOutQuint',
		pauseOnHover:false,
		zIndex:1,
		cssEase: 'cubic-bezier(0.87, 0.03, 0.41, 0.9)',
		prevArrow: '<button type="button" data-role="none" class="slick-prev cm-btn-effect" aria-label="Prev" tabindex="0" role="button"><span class="cm-fill"></span><i class="xi-angle-left-min"></i></button>',
		nextArrow: '<button type="button" data-role="none" class="slick-next cm-btn-effect" aria-label="Next" tabindex="0" role="button"><span class="cm-fill"></span><i class="xi-angle-right-min"></i></button>'
	});

	$(".main-visual-item video").on("ended", function() {
		$(".slick-next").click(); 
	});
	$mainVisualItem.find(".slick-dots").wrap("<aside class='slick-dots-wrapper'><div class='area-box'></div></aside>");

	
	/* ************************
	* Func : 해당영역갔을때 슬라이드 autoPlay
	* wayPoint.js 필요
	************************ */
	// 해당영역갔을때 슬라이드 autoPlay
	if ($.exists('.start-autoplay-scroll-object')) {
		$(".start-autoplay-scroll-object").slick("slickPause");
		$(".start-autoplay-scroll-object").waypoint(function(direction) {
			if ( direction ===  "down" ) {
				$(".start-autoplay-scroll-object").addClass("play");
				$(".start-autoplay-scroll-object").slick("slickPlay");
			}
		},
		{
			triggerOnce: true,
			offset: startOffset
		});
	}


	/* ************************
	* Func : 메인 뉴스 슬라이드
	* slick.js 필요
	************************ */
	$('.main-board-list').on('afterChange', function() {
		setTimeout(function(){
			$('.main-board-list').find('.slick-cloned').css('opacity','1');
		},800)
	});	
	$('.main-board-list').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: true,
		appendArrows:$('.main-board-arrow-wrap'),
		fade: false,
		dots:false,
		//autoplay: true,
		speed:500,
		infinite:false,
		autoplaySpeed: 3000,
		easing: 'easeInOut',
		pauseOnHover:false,
		zIndex:1,
		prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button"><span></span></button>',
		nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"><span></span></button>',
		responsive: [
					{
					  breakpoint: 801,
					  settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					  }
					},
					{
					  breakpoint: 481,
					  settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					  }
					}
				  ]
	});

});


function fullpageScroll () {
	var fullpageInnerScrollTop = $('.fullpage-inner-scroll').scrollTop();
	// tit-box 위치고정
	var fullpageTitTop = $('#mainVisual').height() + $('#mainContent1').height();
	// ir 위치찾기
	var fullpageIrHeight = $('#mainVisual').height() + $('#mainContent1').height() + $('#mainContent2').height();
	
	if (fullpageInnerScrollTop <= 0) {
		$('.fullpage-inner-scroll').bind('wheel', function(event){
			if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
				// scroll up
				if ($('mainContent2').hasClass('active')) {
					$.fn.fullpage.moveTo(2);
				}
				$.fn.fullpage.setAllowScrolling(true);
			}
		});
		// 좌측 타이틀박스 고정
		// $('.main-scroll-fixed').css('top', '30vh')
		$('.main-scroll-fixed').css({
			'position' : 'fixed',
			'top' : 'calc(' + fullpageTitTop + 'px + 30vh)',
		});
		setTimeout(function(){
			$('.main-system-list').find('.num').addClass('active');
		},600);

	}else if ((fullpageInnerScrollTop + $('.fullpage-inner-scroll').height() + 1) >= $('.fullpage-inner-scroll-con').height()) {
		$('.fullpage-inner-scroll').bind('wheel', function(event){
			if (!(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0)) {
				// scroll down
				event.preventDefault();
				$.fn.fullpage.moveTo(4);
				//clearInlineStyles(document.getElementById('fullpageInnerScroll'));
				// ir 위치찾기
				$('#fullpage').css('transform','translate3d(0px, -' + fullpageIrHeight +'px, 0px)');
			}
		});
		// 좌측 타이틀박스 고정
		// $('.main-scroll-fixed').css('top', 'calc(30vh + ' + fullpageInnerScrollTop + 'px');
		$('.main-scroll-fixed').css({
			'position' : 'fixed',
			'top' : 'calc(' + fullpageTitTop + 'px + 30vh)',
		});
	}else {
		// 좌측 타이틀박스 고정
		// $('.main-scroll-fixed').css('top', 'calc(30vh + ' + fullpageInnerScrollTop + 'px');
		$('.main-scroll-fixed').css({
			'position' : 'fixed',
			'top' : 'calc(' + fullpageTitTop + 'px + 30vh)',
		});

        $('.fullpage-inner-scroll').off('wheel');
	}
}

function fullpageScrollBottom () {
	var fullpageBottomScrollTop = $('.fullpage-inner-scroll-bottom').scrollTop();
	if (fullpageBottomScrollTop <= 0) {
		$('.fullpage-inner-scroll-bottom').bind('wheel', function(event){
			if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
				// scroll up
				if ($('#mainContentBottom').hasClass('active')) {
					event.preventDefault();
					$.fn.fullpage.moveTo(3);
					//clearInlineStyles(document.getElementById('fullpageInnerScrollBottom'));
				}
			}
		});

	}else if((fullpageBottomScrollTop + $('.fullpage-inner-scroll-bottom').height() - 50) >=  ($('.fullpage-inner-scroll-con-bottom').height() - $('#mainFooter').height())) {
		$('#mainQuickBtn').css({
			'bottom' : 'calc(' + (fullpageBottomScrollTop - $('#mainFooter').height()) + 'px - 23rem)',
			'transition' : 'none'
		});
	}else {
		$('.fullpage-inner-scroll-bottom').off('wheel');
		$('#mainQuickBtn').css({
			'bottom' : '10rem',
		});
	}
}

// 태그의 style 속성을 지우는 함수
function clearInlineStyles(element) {
    element.removeAttribute('style');
}
