$(document).ready(
    function() {$(window).scroll(function () {
        if ($(window).scrollTop() >= 1) {
            $('header').addClass('scroll');
            $('main').addClass('scroll');
        } else {
            $('header').removeClass('scroll');
            $('main').removeClass('scroll');
        }
    });
        $('.img_item:first-child').addClass('show');
        $(".header_nav li").hover(function(){
            var str = $(this).index();
            $('.img_item').removeClass('show');
            $('.img_item_'+str+'').addClass('show')
        });
        $('#hamburger').click(function (e) {
            e.preventDefault();
            $(this).toggleClass('mm-wrapper_opened');
            $('.btn_menu').toggleClass('active');
            $('#hd_menu').toggleClass('show');
            $('#choose').removeClass('show');
            $('#call_again').removeClass('show');
            if ($("#hd_menu").hasClass("show") || $("#choose").hasClass("show") || $("#call_again").hasClass("show") ) {
                $('body').addClass('hidden')
            }else {
                $('body').removeClass('hidden')
            }
        });
        $('.choose').click(function (e) {
            e.preventDefault();
            $('#choose').toggleClass('show');
            $('#hamburger').removeClass('mm-wrapper_opened');
            $('.btn_menu').removeClass('active');
            $('#hd_menu').removeClass('show');
            $('#call_again').removeClass('show');
            if ($("#hd_menu").hasClass("show") || $("#choose").hasClass("show") || $("#call_again").hasClass("show") ) {
                $('body').addClass('hidden')
            }else {
                $('body').removeClass('hidden')
            }
        });
        $('.call_agains').click(function (e) {
            e.preventDefault();
            $('#call_again').toggleClass('show');
            $('#hamburger').removeClass('mm-wrapper_opened');
            $('.btn_menu').removeClass('active');
            $('#hd_menu').removeClass('show');
            $('#choose').removeClass('show');
            if ($("#hd_menu").hasClass("show") || $("#choose").hasClass("show") || $("#call_again").hasClass("show") ) {
                $('body').addClass('hidden')
            }else {
                $('body').removeClass('hidden')
            }
        });
        $('.btn_note').hover(function () {
            $('.note_item').removeClass('active');
            $(this).closest('.note_item').addClass('active');
            $('.btn_note').removeClass('click');
            $('.nt_cache').removeClass('show');
            $(this).toggleClass('click');
            $(this).closest('.note_item').find('.nt_cache').toggleClass('show');
        })
    $('.close_header').click(function () {
        $('#call_again').removeClass('show');
        $('body').removeClass('hidden')
    })
    $(document).mouseout(function(e) {
        var container = $(".note_item");
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
            $('.note_item').removeClass('active');
            $('.btn_note').removeClass('click');
            $('.nt_cache').removeClass('show');
        }
    });
    $(".accordion-item").click(function () {
        var id = $(this).data('id');
        $(".position").css('display','none');
        $(".position-"+id).css('display','block');
    })
    for (i=1; i<= 10; i++) {
        var swiper4 = new Swiper('.slider_tab_'+i+' .swiper', {
            autoplay: false,
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            speed: 1000,
            navigation: {
                nextEl: '.next-'+i+'',
                prevEl: '.prev-'+i+'',
            },
        });
    }
    for (i=1; i<= 10; i++) {
        var swiper5 = new Swiper('.slider_tab_b'+i+' .swiper', {
            autoplay: false,
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            speed: 1000,
            navigation: {
                nextEl: '.next-b'+i+'',
                prevEl: '.prev-b'+i+'',
            },
        });
    }

    var swiper6 = new Swiper(".live_2_slider .swiper", {
        autoplay: true,
        slidesPerView: 1.3,
        spaceBetween: 23,
        loop: true,
        speed: 1500,
        pagination: {
            el: ".swiper-pagination-1",
            clickable: true,
        },
        navigation: {
            nextEl: '.next-1',
            prevEl: '.prev-1',
        },
    });

    var swiper7 = new Swiper(".inspiration_slider .swiper", {
        autoplay: true,
        slidesPerView: 1,
        roundLengths: true,
        spaceBetween: 10,
        loop: true,
        speed: 1500,
        pagination: {
            el: ".swiper-pagination-2",
            clickable: true,
        },
    });

    var swiper8 = new Swiper(".pos_slider .swiper", {
        autoplay: true,
        effect: 'fade',
        slidesPerView: 1,
        roundLengths: true,
        spaceBetween: 10,
        loop: true,
        speed: 1500,
        pagination: {
            el: ".swiper-pagination-1",
            clickable: true,
        },
        navigation: {
            nextEl: '.next-12',
        },
    });
        var swiper9 = new Swiper(".live_3_slider .swiper", {
            autoplay: true,
            slidesPerView: 1.2,
            roundLengths: true,
            reverseDirection: true,
            spaceBetween: 30,
            loop: true,
            speed: 1500,
            pagination: {
                el: ".swiper-pagination-2",
                clickable: true,
            },
            navigation: {
                nextEl: '.next-2',
                prevEl: '.prev-2',
            },
        });
        var swiper10 = new Swiper(".ds_3_slider .swiper", {
            autoplay: true,
            slidesPerView: 1,
            roundLengths: true,
            spaceBetween: 10,
            loop: true,
            speed: 1500,
            pagination: {
                el: ".swiper-pagination-3",
                clickable: true,
            },
            navigation: {
                nextEl: '.next-3',
                prevEl: '.prev-3',
            },
        });
        var swiper11 = new Swiper(".mb_2_slider .swiper", {
            autoplay: {
                delay:2000
            },
            slidesPerView: 1,
            roundLengths: true,
            reverseDirection: true,
            spaceBetween: 30,
            loop: true,
            speed: 2000,
            pagination: {
                el: ".swiper-pagination-1",
                clickable: true,
            },
            navigation: {
                nextEl: '.next-1',
                prevEl: '.prev-1',
            },
        });
        var swiper12 = new Swiper(".news_hot .swiper", {
            autoplay: true,
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            speed: 1500,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    AOS.init({
        disable: function () {
            var maxWidth = 767;
            return window.innerWidth < maxWidth;
        }
    });
    $("#menu").mmenu({
        "extensions": [
            "fx-menu-zoom"
        ],
        "counters": true
    });
    $('.btn-search, .btn-s-mb').click(function () {
        $('.search-hd').slideToggle(200)
    });
})
