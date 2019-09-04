function init() {
  
  $(document).on('click', '[data-nav] a', function (e) {
    var $this = $(this), $active, $li, $li_li;

    $li = $this.parent();
    $li_li = $li.parents('li');

    $active = $li.closest( "[data-nav]" ).find('.active');

    $li_li.addClass('active');
    ( $this.next().is('ul') && $li.toggleClass('active') ) || $li.addClass('active');
    
    $active.not($li_li).not($li).removeClass('active');

    if($this.attr('href') && $this.attr('href') !=''){
      $(document).trigger('Nav:changed');
    }
  });

  $(document).on('click', '[data-toggle-class]', function (e) {
    e.preventDefault();
    var $self = $(this);
    var attr = $self.attr('data-toggle-class');
    var target = $self.attr('data-toggle-class-target') || $self.attr('data-target');
    var classes = ( attr && attr.split(',')) || '',
      targets = (target && target.split(',')) || Array($self),
      key = 0;
    $.each(classes, function( index, value ) {
      var target = $( targets[(targets.length && key)] ),
                current = target.attr('data-class'),
                _class = classes[index];

            (current != _class) && target.removeClass( target.attr('data-class') );
      target.toggleClass(classes[index]);
      target.attr('data-class', _class);
      key ++;
    });
    $self.toggleClass('active');
  });

  $.extend( jQuery.easing,{
	    def: 'easeOutQuad',
	    easeInOutExpo: function (x, t, b, c, d) {
	        if (t==0) return b;
	        if (t==d) return b+c;
	        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	    }
    });

	$(document).on('click', '[data-scroll-to]', function (e) {
		e.preventDefault();
		var target = $($(this).attr('href')) || $('#'+$(this).attr('data-scroll-to'));
		target && $('html,body').animate({
          scrollTop: target.offset().top
        }, 600, 'easeInOutExpo');
	});

  if ( !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./) ){
    $('body').addClass('ie');
  }
  
  // iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
  var ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
  if( (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua) ){
      $('body').addClass('touch');
  }
  
  // fix z-index on ios safari
  if( (/iPhone|iPod|iPad/).test(ua) ){
    $(document, '.modal, .aside').on('shown.bs.modal', function(e) {
      var backDrop = $('.modal-backdrop');
      $(e.target).after($(backDrop));
    });
  }
  
  //resize
  $(window).on('resize', function () {
    var $w = $(window).width()
        ,$lg = 1200
        ,$md = 991
        ,$sm = 768
        ;
    if($w > $lg){
      $('.aside-lg').modal('hide');
    }
    if($w > $md){
      $('#aside').modal('hide');
      $('.aside-md, .aside-sm').modal('hide');
    }
    if($w > $sm){
      $('.aside-sm').modal('hide');
    }
  }); 

    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    // initialized form navs functions
    $('#content-main-body-form-close').on('click',close_main_form);
    $('#content-main-aside-new').on('click',open_main_form);
    $('#content-main-aside-team').find('li:not(".nav-header")').each(
      function(){
        $(this).on('click',close_main_form)
      });
}

$( document ).ready(function() {
  init();
});
