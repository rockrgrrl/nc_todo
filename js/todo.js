$(document).ready(function(){

  var Todo = function(data){
    this.id = data.id;
    this.description = data.description;
    this.isComplete = data.is_complete;
  };

  var startSession = function(data){
    sessionStorage.setItem("userId", data.id); 
    sessionStorage.setItem("token", data.api_token);
    hideSignIn();
    hideSignUp();
    showSignOut();
    showTodos();
    getTodos()
    showTasks();
    showCompleted();
  };

  var hideSignIn = function(){
    $("#sign-in").hide();
  };

  var hideSignUp = function(){
    $("#sign-up").hide();
  };

  var hideSignOut = function(){
    $("#sign-out-button").hide();
  };

  var showSignOut = function(){
    $("#sign-out-button").show();
  };

  var hideTodos = function(){
    $("#todos").hide();
  };

  var showTodos = function(){
    $("#todos").show();
  };

  var emptyInput = function(){
    $("input:text").val("");
    $("input:password").val("");
  };

  var hideTasks = function(){
    $("#tasks").hide();
  };

  var showTasks = function(){
    $("#tasks").show();
  }

  var hideCompleted = function() {
    $("#completed-list-div").hide();
  };

  var showCompleted = function() {
    $("#completed-list-div").show();
  };

  var addToList = function(todo){
    $("#todo-list").append("<li id='" + todo.id + "'>" + todo.description + "<span class='glyphicon glyphicon-ok'></span><span class='glyphicon glyphicon-edit'></span></li>");
  };

  var addToCompleted = function(todo){
    $("#completed-list").append("<li id='" + todo.id + "'>" + todo.description + "</li>");
  };

  hideSignUp();
  hideSignOut();
  hideTodos();
  hideTasks();
  hideCompleted();

  $("#sign-in").submit(function(event){
    event.preventDefault();
    var email = document.getElementById("sign-in-email").value
    var password = document.getElementById("sign-in-password").value
    $.ajax({
      url: "http://recruiting-api.nextcapital.com/users/sign_in",
      type: "POST",
      dataType: "json",
      data: {email: email, password: password},
      success: function(data){
        emptyInput();
        startSession(data);
      },
      error: function(data){
        emptyInput();
        $("#sign-in-form").prepend("<p>Invalid email or password</p>");
      }
    });
    $("sign-in-form p").empty();
  });

  $("#new-to-site").click(function(event){
    event.preventDefault();
      $("#sign-up").toggle();
  });

  $("#sign-up").submit(function(event){
    event.preventDefault();
      var email = document.getElementById("sign-up-email").value
      var password = document.getElementById("sign-up-password").value
      $.ajax({
        url: "http://recruiting-api.nextcapital.com/users",
        type: "POST",
        dataType: "json",
        data: {email: email, password: password},
        success: function(data){
          emptyInput();
          startSession(data);
        },
        error: function(data){
          $("#sign-up-form").prepend("<p>Invalid email or password.<p>");
        }
      });
      $("#sign-up-form p").empty();
  });

    var getTodos = function(){
      $.ajax({
        url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos.json?api_token=" + sessionStorage.token,
        type: "GET",
        success: function(data) {
          for (i = 0; i < data.length; i++) {
            var todo = new Todo(data[i]);
            if (todo.isComplete === false) {
              addToList(todo);
            }
            else
              addToCompleted(todo);
          }
        }
      });
    };

  $("#tasks").submit(function(event){
    event.preventDefault();
    var description = $("#tasks input[name=new-task]").val()
    if (description != "") {
      $.ajax({
        url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos",
        type: "POST",
        dataType: "json",
        data: { api_token: sessionStorage.token, todo: { description: description } },
        success: function(todo) {
          addToList(todo);
          emptyInput(todo);
        }
      });
    }
  });

  $(document).on("click", ".glyphicon-edit", function(){
    var currentText = $(this).parent().text();
    var editForm = ("<form id='edit-form'><input id='edit-description' type='text' value=" + currentText + "></form>");
    var updatedTodo = $(this).parent().replaceWith(editForm).fadeIn();
  });

  $(document).on("click", ".glyphicon-ok", function(){
    $(this).css("color", "green");
    var currentTask = $(this).parent();
    var todoId = $(this).parent().attr("id");
    var description = $(this).parent().text();
    $.ajax({
      url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos/" + todoId,
      type: "PUT",
      dataType: "json",
      data: { api_token: sessionStorage.token, todo: { description: description, is_complete: true} },
      success: function(todo){
        currentTask.remove();
        showCompleted();
        addToCompleted(todo);
      }
    });
  });
  
 $(function() {
    $( "#todo-list" ).sortable();
    $( "#todo-list" ).disableSelection();
  });

  $(".list").mouseover(function(){
    $(this).css("cursor", "default");
  });

  $("#sign-out-button").click(function(event){
    event.preventDefault();
    $("#sign-in").show();
    hideTodos();
    hideSignOut();
    $.ajax({
      url: "http://recruiting-api.nextcapital.com/users/sign_out",
      type: "DELETE",
      data: { user_id: sessionStorage.userId, api_token: sessionStorage.token }
    });
    location.reload();
  });
});


