"use strict";

/*
    tasks.js
    Script for the index.html page
    This code will use Parse.com's JavaScript library to create new tasks, save them, query them
    mark them as done, and purge done tasks
 */

//use jQuery to register a function that is called when the document is ready for manipulation
$(function() {
    var currentUser = Parse.User.current();
    if (!currentUser) {
        window.location = "signin.html";
    }
    $('.nav-link-sign-out').click(function(e) {
        e.preventDefault();
        Parse.User.logOut();
        window.location = "signin.html";
    });
    $('.user-name').text(currentUser.get('firstname') + " " + currentUser.get('lastname'));

    var Task = Parse.Object.extend('Task');
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.equalTo('user', currentUser);
    tasksQuery.ascending('done, createdAt');
    var TaskList = Parse.Collection.extend({
        model: Task,
        query: tasksQuery,
        getCompleted: function() {
            return this.filter(function(task) {
                return task.get('done');
            });
        }
    });

    var tasks = new TaskList();
    tasks.on('all', function() {
        var taskList = $('.task-list');
        taskList.empty();
        this.forEach(function(task) {
            var li = $(document.createElement('li'));
            li.text(task.get('title'));
            if (task.get('done')) li.addClass('task-done');
            taskList.append(li);
            li.click(function() {
                task.set('done', !task.get('done'));
                task.save();
            });
        });
        if (this.getCompleted().length > 0) {
            $('.btn-purge').fadeIn(200);
        } else {
            $('.btn-purge').fadeOut(200);
        }
    });

    tasks.fetch();

    $('.form-new-task').submit(function(e) {
        e.preventDefault();
        var taskForm = $(this);
        var newInput = taskForm.find('.new-task-title');
        var task = new Task();
        task.set('title', newInput.val());
        task.set('user', currentUser);
        task.set('done', false);
        task.save().then(function() {
            clearError();
            tasks.add(task);
            newInput.val("");
        }, function(err) {
            showError(err);
        });
    });

    $('.btn-purge').click(function() {
        Parse.Object.destroyAll(tasks.getCompleted());
    });
});