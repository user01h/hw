/* Fixer Plugin
 * @author: Pablo Cazorla
 * @e-mail: pablo.cazorla@huddle.com.ar
 * @date: 22/08/2012
 */
(function($){
	$.fn.fixer = function(options){
		var setting = $.extend({
			top : 0
		}, options),
			$window = $(window);
			
		return this.each(function(){
			var $this = $(this),
				initialTop = $this.offset().top - setting.top,
				fix = function(){
					if($window.scrollTop() > initialTop){
					$this.css({
							'position' : 'fixed',
							'top' : setting.top + 'px'
						});
					}else{
						$this.css({'position' : ''});
					};
				};
			fix();
			$window.scroll(function(){
				fix();
			});
		});
	};
})(jQuery);
/* Slider Plugin
 * @author: Pablo Cazorla
 * @e-mail: pablo.cazorla@huddle.com.ar
 * @date: 22/08/2012
 */
(function($){
	$.fn.slider = function(options){
		
		//Settings
		var setting = $.extend({
			top : 0,
			slideStep : 1,
			initial : 0,
			duration : 400,
			autoplay : true,
			autoplayTime : 8000,
			resizeContent : true,
			widthContent : 200
		}, options);
			
		return this.each(function(){
			
			//Set variables
			var width,widthLi,current,length,
				$this = $(this),
				$ul = $this.find('> ul'),
				$li = $ul.find('li'),
				moving = false,
				prevA = document.createElement('a'),
				$prevBtn = $(prevA).attr('href','#').addClass('slider-btn'),
				nextA = document.createElement('a'),
				$nextBtn = $(nextA).attr('href','#').addClass('slider-btn').attr('id','slider-btn-next'),
				setPosition = function(){
					width = $this.width();
					if(!setting.resizeContent){
						widthLi = setting.widthContent;
						setting.slideStep = Math.round(width/widthLi);
					}else{
						widthLi = width/setting.slideStep;
					};
					
					
					current = setting.initial;
					length = Math.ceil($li.length/setting.slideStep);
					$ul.css({
						'width' : width*length+2+'px',
						'left': -1*current*width/setting.slideStep+'px'
					});
					
					$li.width(widthLi);
					$this.css({'height':$li.height()+'px'});
				},
				changeSlide = function(dir){
					if(!moving){
						current += dir;
						if(current >= length){current = 0;}
						if(current < 0){current = length - 1;}
						
						moving = true;
						$ul.animate({'left': -1*current*width+'px'},setting.duration,function(){
							moving = false;
						});
					};
				},
				stopAutoplay = function(){
					if(intervalAutoPlay){clearInterval(intervalAutoPlay);}
				};
				
				//Init
				setPosition();
				$this.append($prevBtn).append($nextBtn);
				if(setting.autoplay){
					var intervalAutoPlay = setInterval(function(){
						changeSlide(1);
					},setting.autoplayTime);
				};
				
				//Events
				$prevBtn.click(function(ev){
					ev.preventDefault();
					changeSlide(-1);
					stopAutoplay();
				});
				$nextBtn.click(function(ev){
					ev.preventDefault();
					changeSlide(1);
					stopAutoplay();
				});
				$(window).resize(function() {
				  setPosition();
				});
				
				
				//Touch				
				var xTouch,leftInit,left,difLeft,
					touching = false,	
					touchStart = function(event){
						if(!touching){
							event.preventDefault();
							touching = true;
							if(event.touches){//For IOS devices
								xTouch = event.touches[0].pageX;
							}else{
								xTouch = event.pageX;
							};
							
							leftInit = parseInt($ul.css('left'));
							difLeft = xTouch;
							stopAutoplay();
							return false;
						}
					},
					touchMove = function(event){
						
						if(touching){
							event.preventDefault();
							if(event.touches){//For IOS devices
								xTouch = event.touches[0].pageX;
							}else{
								xTouch = event.pageX;
							};
							
							left = leftInit + Math.round(xTouch - difLeft);
							$ul.css('left',left+'px');
							return false;
						}
					},
					touchEnd = function(event){
						if(touching){
							event.preventDefault();
							touching = false;
							var dir = (leftInit - left)/Math.abs(leftInit - left);
							changeSlide(dir);
							return false;
						}
					};
				
				//For IOS devices
				$ul[0].addEventListener("touchstart", touchStart, false);
				$ul[0].addEventListener("touchmove", touchMove, false);
				document.body.addEventListener("touchend", touchEnd, false);
				
				//For all others devices (included Android)
				$ul[0].addEventListener("mousedown", touchStart, false);
				$ul[0].addEventListener("mousemove", touchMove, false);
				document.body.addEventListener("mouseup", touchEnd, false);
		});
	};
})(jQuery);

/* Retina Display Plugin
 * @author: Pablo Cazorla
 * @e-mail: pablo.cazorla@huddle.com.ar
 * @date: 22/08/2012
 */
(function($){
	$.fn.retina = function(options){
		//Settings
		var setting = $.extend({
			prefix : '-2x'
		}, options);
		
		var retinaDisplay = window.devicePixelRatio > 1 ? true : false;
			
		return this.each(function(){
			if(retinaDisplay){
				var $this = $(this),
					src  = $this.attr('src').split('.'),
					src2x = src[0] + setting.prefix+ '.'+src[1],
					newImage = new Image();
				newImage.src = src2x;
				newImage.onload = function(){
					$this.attr('src',src2x);
				};
			}
		});
	};
})(jQuery);

$('document').ready(function(){
	$('.fixer').fixer({'top' : 34});
	$('#summary-slider').slider();
	$('#clients-slider').slider({
							resizeContent : false,
							widthContent : 161
						});
						
	$('img').retina();
		
	//Add this plugin
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//s7.addthis.com/js/250/addthis_widget.js#pubid=xa-503baed52ef46b3f";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'addthis-plugin'));
	
	
});
