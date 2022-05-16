let path = window.location.pathname.split('/');
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

$(document).ready(function () {
    $(".delete-post").click(function () {
        delete_post()
    });
});

function delete_post() {
    let id = null;
    if (path.length >= 3) {
        id = path[path.length - 1]
    }
    if (!id) {
        alert('هناك خطأ ما يرجى المحاولة لاحقا');
        return
    }
    $.ajax({
        url: `/api/v1/posts/${id ?? ''}/`,
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