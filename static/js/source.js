let path = getPath();
function getPath(){
    let p = window.location.pathname.trim().split('/');
    let path = [];
    for(let index in p)
        if(p[index].trim() !== '')
            path.push(p[index])
    return path;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
const user_id = JSON.parse(document.getElementById('user_id').textContent);

$(document).ready(function () {
    $(".delete-post").click(function () {
        delete_post()
    });
    $('.reply.main').click(function (e) {
        add_comment_post(e);
    });
    $('.main-comment').on('click', '.reply.child', function (e) {
        add_comment_child(e);
    });
});

function delete_post() {
    let id = null;
            let url = `/api/v1/posts/`

    if (path.length >= 3) {
        id = path[path.length - 1]
        url +=id+'/'
    }
    if (!id) {
        alert('هناك خطأ ما يرجى المحاولة لاحقا');
        return
    }
    $.ajax({
            url: url,
        type: "DELETE",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },

        success: function (data) {
            window.location.href = '/';
        },
        error: function (xhr, status, error) {
            alert('هناك خطأ ما يرجى المحاولة لاحقا');
        }
    })
}

function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (25 + element.scrollHeight) + "px";
}

function add_comment_post(event) {
    let textarea = $(event.target).closest('.comment-body').find('textarea');
    let comment_text = textarea.val();
    if (!comment_text) {
        alert('لا يوجد شي للتعليق به');
        return
    }
    let id = path[path.length - 1]


    $.ajax({
        url: `/api/v1/comment/`,
        type: "POST",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("charset", "utf-8");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        data: JSON.stringify({
            'text': decodeURIComponent(comment_text),
            'post': {'slug': decodeURIComponent(id)},
            'user':  user_id,
            'parent': null

        }),
        success: function (comment) {
            clearTextArea(textarea)
            appendComment(comment, event,'.comment-list.main-comment', true)
        },
        error: function (xhr, status, error) {
            alert('هناك خطأ ما يرجى المحاولة لاحقا');
        }
    })
}

function add_comment_child(e) {

    let child_uls = $(e.target).closest("ul");
    let child_ul = child_uls[child_uls.length - 1]
    let textarea = $(`ul#${child_ul.id} textarea`);
    let comment_text = textarea.val();
    if (!comment_text) {
        alert('لا يوجد شي للتعليق به');
        return
    }
    let id = path[path.length - 1]
    let comment_id = $(child_ul).prev('li').attr('id').split('_')[1]


    $.ajax({
        url: `/api/v1/comment/`,
        type: "POST",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("charset", "utf-8");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        data: JSON.stringify({
            'text': decodeURIComponent(comment_text),
            'post': {'slug': decodeURIComponent(id)},
            'user': user_id,
            'parent': parseInt(comment_id)

        }),
        success: function (comment) {
            appendComment(comment, e)
            removeTextArea(textarea)
        },
        error: function (xhr, status, error) {
            alert('هناك خطأ ما يرجى المحاولة لاحقا');
        }
    })
}

function removeTextArea(textarea){
    if (textarea)
        $(textarea).closest('li').remove()

}
function clearTextArea(textarea){
        if (textarea)
        textarea.val('')

}
function appendComment(comment, event, parentClass=null, main_comment = false) {
    let ul = $(parentClass?`${parentClass}`:event.target).closest("ul");

    let li = `                <li class="comment" id="comment_${comment['id']}">
                            <div class="vcard bio">`
    let user = comment['user'];
    if (user) {
        let profile = user['profile']
    if (profile['img'])
        li += ` <img src="${profile['img']}" alt="${user['first_name']} تعليق "> `
        else
            li +=`<div id="profileImage">${user['first_name']?.charAt(0)+ (user['last_name'] ?user['last_name']?.charAt(0):'')}</div>`;
    }
    else
        li += ` <img src="http://localhost:8000/Media/comment.png" alt=تعليق مستخدم مجهول  ">`
    li += `</div> <div class="comment-body child">`
    if (user)
        li += ` <h3>${user['first_name']} ${user['last_name']}</h3>`
    else
        li += `  <h4>مستخدم مجهول</h4>`
    li += `  <div class="meta">${comment['updated']}</div>
                                <p>${comment['text']}</p>`
    if(main_comment)
        li +=`      <p><a class="reply main-comment" id="replay_${comment['id']}"
                                  onclick="replay(this)">رد..</a>
                            </p>
`

      li+=`                      </div>
                        </li>
`
    $(ul).prepend(li);
}

function appendChild(comment, comment_id, main_ul) {
    let li = `<li class="comment" id="comment_${comment['id']}">
                    <div class="vcard bio">
                        <img src="${comment['img']}" alt="${comment['first_name']} تعليق ">
                    </div>
                    <div class="comment-body">
                        <h3>${comment['first_name']} ${comment['last_name']}</h3>
                        <div class="meta">${comment['updated']}</div>
                        <p>${comment['text']}</p>
                        <p><a href="#" class="reply">Reply</a></p>
                    </div>
                </li>`;
    let child_ul = $(`#child_${comment_id}`);
    if (child_ul.length) {
        $(child_ul).append(li);
    } else {
        let child_ul = `     
     <ul class="children" id="child_${comment_id}">
     ${li}
              </ul>`;
        $(main_ul).append(child_ul);
    }

}

function replay(element) {
    let a = $(element)
    let comment_id = a.attr('id').split('_')[1]
    let main_li = a.closest("li");
    let child_ul = $(`#child_${comment_id}`);
    let comment_li = `                <li class="comment">
                    <div class="vcard bio">
                        <img src="http://localhost:8000/Media/comment.png">
                    </div>
                    <div class="comment-body child">
                        <textarea onkeyup="textAreaAdjust(this)"
                                  style="overflow:hidden; border-radius: 12px; max-width: 20em; width:100%"></textarea>
                        <br/>
                        <p class="mt-2"><a class="reply child">رد..</a></p>
                    </div>
                </li>
`;
    let comment_ul = `            <ul class="children" id ="child${Math.random() * 13 | 0}">${comment_li}</ul>`;
    if (child_ul.length) {
        child_ul.append(comment_li)
    } else {
        main_li.after(comment_ul)
    }

}