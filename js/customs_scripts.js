$(function (){
    $('.btn-loadmore').on('click', function (){
        const $this = $(this);
        $('.title', $this).addClass('d-none');
        $('.loading', $this).removeClass('d-none');

        let $page = parseInt($this.data('page'));
        let $action = $this.data('action');

        $.ajax({
            type: "GET",
            url: $action,
            data: {
                page: $page + 1,
            },
            dataType: "json",
            success: function(result){
                if(result.status){
                    $('.title', $this).removeClass('d-none');
                    $('.loading', $this).addClass('d-none');

                    $('#ajax_lst_posts').append(result.data);

                    if(result.has_more){
                        $this.data('page', $page + 1);
                    }else{
                        $this.remove();
                    }
                }
            }
        });
    });
})
