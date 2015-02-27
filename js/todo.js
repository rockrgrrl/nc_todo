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
    showTodos();
    getTodos();
  };

  var hideSignIn = function(){
    $("#sign-in").hide();
  };

  var hideSignUp = function(){
    $("#sign-up").hide();
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

  var hideCompleted = function() {
    $("#completed-list-div").hide();
  };

  var addToList = function(todo){
    $("#todo-list").append("<li id='" + todo.id + "'>" + todo.description + "</li>");
  };



  hideSignUp();
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
      $("#sign-up").show();
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
            if (todo.isComplete !== true) {
              addToList(todo);
            }
          }
        }
      });
    };

  $("#new-task").click(function(event){
    event.preventDefault();
    $("#tasks").show();
  });

  $("#add-task").click(function(event){
    event.preventDefault();
    var description = document.getElementById("task").value
    $.ajax({
      url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos",
      type: "POST",
      dataType: "json",
      data: { api_token: sessionStorage.token, todo: { description: description } },
      success: function(todo) {
        addToList(todo);
        emptyInput(todo);
        hideTasks();
      }
    });
  });

  // $(document).on('dblclick', '#todo-list li', function() {
  //   var editButton = $("<input id='todo-edit' type='submit' value='Edit'/>")
  //   $(this).append(editButton);
  // });
  
 $(function() {
    $( "#todo-list" ).sortable();
    $( "#todo-list" ).disableSelection();
  });

  $("#sign-out-button").click(function(event){
    event.preventDefault();
    $("#sign-in").show();
    hideTodos();
    $.ajax({
      url: "http://recruiting-api.nextcapital.com/users/sign_out",
      type: "DELETE",
      dataType: "json",
      data: { user_id: sessionStorage.userId, api_token: sessionStorage.token }
    });
  });
});













