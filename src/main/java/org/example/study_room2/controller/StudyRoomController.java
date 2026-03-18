package org.example.study_room2.controller;

import org.example.study_room2.entity.StudyRoom;
import org.example.study_room2.service.StudyRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class StudyRoomController {

    @Autowired
    private StudyRoomService studyRoomService;

    @GetMapping
    public ResponseEntity<List<StudyRoom>> getRooms() {
        return ResponseEntity.ok(studyRoomService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyRoom> getRoom(@PathVariable Long id) {
        StudyRoom room = studyRoomService.getById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinRoom(@PathVariable Long id, @RequestBody Map<String, Long> params) {
        StudyRoom room = studyRoomService.getById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("roomId", id, "message", "已加入" + room.getName()));
    }
}
