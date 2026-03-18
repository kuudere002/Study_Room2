package org.example.study_room2.controller;

import org.example.study_room2.entity.FocusRecord;
import org.example.study_room2.service.FocusRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/focus")
@CrossOrigin(origins = "*")
public class FocusController {

    @Autowired
    private FocusRecordService focusRecordService;

    @GetMapping("/history")
    public ResponseEntity<List<FocusRecord>> getHistory(@RequestParam Long userId) {
        return ResponseEntity.ok(focusRecordService.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<FocusRecord> recordFocus(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long roomId = Long.valueOf(params.get("roomId").toString());
        Integer durationMinutes = Integer.valueOf(params.get("durationMinutes").toString());
        String startedAtStr = params.get("startedAt").toString();

        LocalDateTime startedAt = LocalDateTime.parse(startedAtStr);
        FocusRecord record = focusRecordService.add(userId, roomId, durationMinutes, startedAt);
        return ResponseEntity.ok(record);
    }
}
