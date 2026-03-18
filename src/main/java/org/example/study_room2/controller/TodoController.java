package org.example.study_room2.controller;

import org.example.study_room2.entity.Todo;
import org.example.study_room2.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todo")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping
    public ResponseEntity<List<Todo>> getTodos(@RequestParam Long userId) {
        return ResponseEntity.ok(todoService.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Todo> addTodo(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        String content = params.get("content").toString();
        return ResponseEntity.ok(todoService.add(userId, content));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        String content = params.get("content").toString();
        Integer completed = Integer.valueOf(params.get("completed").toString());
        boolean success = todoService.update(id, content, completed);
        return ResponseEntity.ok(Map.of("success", success));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        boolean success = todoService.delete(id);
        return ResponseEntity.ok(Map.of("success", success));
    }
}
