// project util.js
$(function(){
    // 登录注册切换
    $('.j_userTab span').on('click',function(){
        var _index = $(this).index();
        $(this).addClass('user_cur').siblings().removeClass('user_cur');
        $('.user_login,.user_register').hide();
        if( _index==0 ){
            $('.user_login').css('display','inline-block');
            $('.user_register').hide();
        }else{
            $('.user_login').hide();
            $('.user_register').css('display','inline-block');
        }
    });

    // 登录校验
    var reg = /^[^<>"'$\|?~*&@(){}]*$/;
    var $login = $('#login');
    var $register = $('#register');
    var $userForm = $('.user_form');
    var $userLogined = $('.user_logined');
    $('.user_login_btn').on('click',function(){
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $login.find('.user_input').eq(0).find('input').val().trim(),
                password: $login.find('.user_input').eq(1).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if(data.code != 0){
                    $login.find('.user_err span').text( data.message ).show();
                    return false;
                }else{
                    // alert('登陆成功！')
                    window.location.reload()
                }
            }
        })
    });

    /**
     *  注册校验
     *  通过ajax向后端传输注册信息
     */
    $('.user_register_btn').on('click',function(){
       
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $register.find('.user_input').eq(0).find('input').val().trim(),
                password: $register.find('.user_input').eq(1).find('input').val().trim(),
                repassword: $register.find('.user_input').eq(2).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if(data.code != 0){
                    $register.find('.user_err span').text( data.message ).show();
                    return false;
                }else{
                    //成功后跳转到登录模块
                    window.location.reload();
                }
            }
        })
    });

    // 退出
    $('#loginOut').on('click',function(){
        $.ajax({
            type: 'get',
            url: '/api/user/loginOut',
            success: function(data){
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    });

    // 提交评论
    $('.discuss_submit').on('click',function(){
        $.ajax({
            type: 'post',
            // url: '/api/comment',
            data: {
                commentId: $('.discuss_id').val(),
                commentContent: $('.discuss_input').val()
            },
            dataType: 'json',
            success: function(data){
                if(!data.code){
                    $('.discuss_input').val('');
                    renderComments( data.commentList );
                }
            }
        })
    });

    $.ajax({
        type: 'get',
        url: '/api/comment',
        data: {
            commentId: $('.discuss_id').val()
        },
        dataType: 'json',
        success: function(data){
            if(!data.code){
                renderComments( data.commentList );
            }
        }
    })

    function renderComments(list){
        var commentsStr = "";
        for(var i=0;i<list.length;i++){
            list[i].postTime = formatDate( list[i].postTime );
            commentsStr += `<li>
                    <p class="discuss_user"><span>${list[i].userName}</span><i>发表于 ${list[i].postTime}</i></p>
                    <div class="discuss_userMain">
                        ${list[i].comment}
                    </div>
                </li>`
        };
        $('.discuss_list').html( commentsStr );
    };

    function formatDate( date ){
        var curDate = new Date( date );
        return curDate.getFullYear()+'年'+(curDate.getMonth()+1)+'月'+curDate.getDay()+'日';
    };

    // 打字效果
    var str = 'hello world';
    var i = 0;
    function typing(){
        var divTyping = $('.banner h2');
        if (i <= str.length) {
            divTyping.text( str.slice(0, i++) + '_' );
            setTimeout(function(){typing()}, 200);
        }else{
            divTyping.text( str );
        }
    }
    typing();
});