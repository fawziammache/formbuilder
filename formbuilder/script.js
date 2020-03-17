$('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
}).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

var firebaseConfig = {
    apiKey: "AIzaSyAltMfeb-pzQUfQz-pfTnh2jfwBFVzhPq0",
    authDomain: "ohforms.firebaseapp.com",
    databaseURL: "https://ohforms.firebaseio.com",
    projectId: "ohforms",
    storageBucket: "ohforms.appspot.com",
    messagingSenderId: "1039072712651",
    appId: "1:1039072712651:web:42c05751974f27287b084e",
    measurementId: "G-5T2BPCY1LF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var formID = window.location.search.slice(3)
const targetNode = document.getElementById('form');
var globalID = 0


// firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
//     targetNode.innerHTML = snapshot.val().content
//     setbtns()
// }, function (err) {
//     targetNode.innerText = err;
//     targetNode.innerText += "\n\nPlease return Home and Login"
// });

function save() {
    firebase.database().ref('/form-list/' + formID)
        .update({
            content: targetNode.innerHTML
        });
    var currDate = new Date().toLocaleString();
    document.getElementById("lastSaved").innerText = `Last Saved at: ${currDate}`
}


function addQuestion(place, parent) {
    var question = document.createElement("div")
    question.classList.add("question")
    question.setAttribute("name", place)
    if (parent == -1) {
        question.id = ++globalID
    } else {
        question.id = `${parent}.${document.getElementById(parent).getAttribute("data-childCount")}`
    }

    question.setAttribute("data-childCount", 0)

    var question_view = document.createElement("div")
    question_view.classList.add("question-view", "hidden")
    var pencil = document.createElement("i")
    pencil.classList.add("fa", "fa-pencil")
    pencil.setAttribute("onClick", "toggleEdit(this)")

    var child_condition = document.createElement("p")
    child_condition.classList.add("child-condition")
    if (parent == -1) {
        child_condition.classList.add("hidden")
    }

    var p = document.createElement("p")
    p.setAttribute("name", "question")

    var answers = document.createElement("div")
    answers.setAttribute("name", "answers")

    if (place == "text") {
        var input = document.createElement("input")
        input.classList.add("text-answer")
        input.type = place
        input.disabled = true
        input.placeholder = "Written Answer..."
        answers.append(input)
    }

    question.append(question_view)
    question_view.append(pencil, child_condition, p, answers)

    var add_child = document.createElement("div")
    add_child.classList.add("add-child")
    // add_child.setAttribute("onmouseout", "hideMenu(this)")

    var child_btn = document.createElement("button")
    child_btn.classList.add("child-btn")
    child_btn.innerText = "+"
    child_btn.setAttribute("onClick", "testchild(this)")


    var child_menu = document.createElement("div")
    child_menu.classList.add("child-menu")

    var p = document.createElement("p")
    p.innerText = 'Add a child question'
    var text_child = document.createElement("a")
    text_child.innerHTML = '<i class="fa fa-font"></i>Text'
    text_child.setAttribute("onClick", "incrementParent(this); addQuestion('text', this.parentNode.parentNode.parentNode.id); hideMenu(this)")

    var single_child = document.createElement("a")
    single_child.innerHTML = '<i class="far fa-dot-circle"></i>Single Select'
    single_child.setAttribute("onClick", "incrementParent(this);addQuestion('radio', this.parentNode.parentNode.parentNode.id); hideMenu(this)")

    var multi_child = document.createElement("a")
    multi_child.innerHTML = '<i class="fa fa-check-square"></i>Multi Select'
    multi_child.setAttribute("onClick", "incrementParent(this); addQuestion('checkbox', this.parentNode.parentNode.parentNode.id); hideMenu(this)")

    child_menu.append(p, text_child, single_child, multi_child)
    add_child.append(child_btn, child_menu)
    question.append(add_child)


    var edit_view = document.createElement("div")
    edit_view.classList.add("edit-view")

    var p = document.createElement("p")
    if (place == "text") {
        p.innerHTML = '<i class="fa fa-font"></i>TEXT QUESTION'
    } else if (place == "radio") {
        p.innerHTML = '<i class="far fa-dot-circle"></i>SINGLE SELECT QUESTION'
    } else {
        p.innerHTML = '<i class="fa fa-check-square"></i>MULTI SELECT QUESTION'
    }

    var input = document.createElement("input")
    input.type = "text"
    input.placeholder = "Enter your question here"

    var edit_buttons = document.createElement("div")
    edit_buttons.classList.add("edit-buttons")

    var delbtn = document.createElement("button")
    delbtn.classList.add("solid-btn", "red")
    delbtn.setAttribute("onClick", "deleteQuestion(this)")
    delbtn.innerText = "Delete"

    var div = document.createElement("div")
    var cancelbtn = document.createElement("button")
    cancelbtn.classList.add("outlined-btn")
    cancelbtn.setAttribute("onClick", "cancelEdit(this)")
    cancelbtn.innerText = "Cancel"

    var savebtn = document.createElement("button")
    savebtn.classList.add("solid-btn")
    savebtn.setAttribute("onClick", "saveEdit(this)")
    savebtn.innerText = "Save"

    question.append(edit_view)

    edit_view.append(p)

    var child_condition_select = document.createElement("div")
    if (parent != -1) {
        child_condition_select.classList.add("child-condition-select")

        var condition_p = document.createElement("p")
        condition_p.innerText = "Show if Answered: "

        var condition_answers = document.createElement("select")

        parentQuestion = document.getElementById(parent)
        var option = document.createElement("option")

        for (var answer of parentQuestion.getElementsByTagName("label")) {
            var option = document.createElement("option")
            option.innerText = answer.innerText
            condition_answers.append(option)
        }



        child_condition_select.append(condition_p, condition_answers)
    }
    edit_view.append(child_condition_select, input)

    if (place != "text") {
        var textarea = document.createElement("textarea")
        textarea.placeholder = "Enter Line-Separated Answers"
        edit_view.append(textarea)
    }

    edit_view.append(edit_buttons)
    edit_buttons.append(delbtn, div)
    div.append(cancelbtn, savebtn)

    if (parent == -1) {
        document.getElementById("form").appendChild(question)
    } else if (parseInt(document.getElementById(parent).getAttribute("data-childCount")) == 1){
        document.getElementById(parent).after(question)
    } else {
        var childCount = parseInt(document.getElementById(parent).getAttribute("data-childCount"))
        for (var i = childCount; i > 0; i--) {
            var currentID = document.getElementById(`${parent}.${i}`)
            if (currentID != null) {
                currentID.after(question)
                break
            }
        }
    }

    window.scrollTo(0, document.body.scrollHeight);
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}


var form_title = document.getElementById("form_title")
form_title.onblur = function () {
    //Save title to firebase
    console.log("test")
}

function toggleEdit(e) {
    var question = e.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[2].classList.toggle("hidden")
}

function cancelEdit(e) {
    var question = e.parentNode.parentNode.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[2].classList.toggle("hidden")
}

function saveEdit(e) {
    var type = e.parentNode.parentNode.parentNode.parentNode.getAttribute("name")
    var qID = e.parentNode.parentNode.parentNode.parentNode.id
    var question_view = e.parentNode.parentNode.parentNode.parentNode.children[0]
    var edit_view = e.parentNode.parentNode.parentNode.parentNode.children[2]

    question_view.children[2].innerText = `${qID}. ${edit_view.children[2].value}`

    if (edit_view.getElementsByTagName("select").length != 0) {
        var answers = edit_view.getElementsByTagName("select")[0]
        question_view.children[1].innerText = `Condition: ${answers.options[answers.selectedIndex].text}`
    }
    if (type != "text") {
        question_view.children[3].innerHTML = ""
        var temp = edit_view.children[3].value.split(/\r?\n/);
        for (a of temp) {
            var input = document.createElement("input");
            input.type = type;
            input.disabled = true;
            var label = document.createElement("label");
            label.appendChild(input)
            label.appendChild(document.createTextNode(a))
            question_view.children[3].appendChild(label)
        }
    }
    var question = e.parentNode.parentNode.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[2].classList.toggle("hidden")
}

function deleteQuestion(e) {
    e.parentNode.parentNode.parentNode.remove()
}

function testchild(e) {
    e.classList.toggle("active")
    e.parentNode.children[1].classList.toggle("expand")
}

// function hideMenu(e) {
//     e.children[0].classList.remove("active")
//     e.children[1].classList.remove("expand")
// }

function hideMenu(e) {
    e.parentNode.parentNode.children[0].classList.remove("active")
    e.parentNode.classList.remove("expand")
}

function incrementParent(e) {
    var childCount = parseInt(e.parentNode.parentNode.parentNode.getAttribute("data-childCount"))
    e.parentNode.parentNode.parentNode.setAttribute("data-childCount", ++childCount)
}