package org.example.study_room2.service;

import org.example.study_room2.entity.Todo;
import org.example.study_room2.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoMapper todoMapper;

    public List<Todo> getByUserId(Long userId) {
        return todoMapper.findByUserId(userId);
    }

    public Todo add(Long userId, String content) {
        Todo todo = new Todo();
        todo.setUserId(userId);
        todo.setContent(content);
        todo.setCompleted(0);
        todoMapper.insert(todo);
        return todo;
    }

    public boolean update(Long id, String content, Integer completed) {
        Todo todo = todoMapper.findById(id);
        if (todo == null) return false;
        todo.setContent(content);
        todo.setCompleted(completed);
        return todoMapper.update(todo) > 0;
    }

    public boolean delete(Long id) {
        return todoMapper.delete(id) > 0;
    }
}
