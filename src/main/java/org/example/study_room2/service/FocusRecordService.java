package org.example.study_room2.service;

import org.example.study_room2.entity.FocusRecord;
import org.example.study_room2.mapper.FocusRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FocusRecordService {

    @Autowired
    private FocusRecordMapper focusRecordMapper;

    public List<FocusRecord> getByUserId(Long userId) {
        return focusRecordMapper.findByUserId(userId);
    }

    public FocusRecord add(Long userId, Long roomId, Integer durationMinutes, LocalDateTime startedAt) {
        FocusRecord record = new FocusRecord();
        record.setUserId(userId);
        record.setRoomId(roomId);
        record.setDurationMinutes(durationMinutes);
        record.setStartedAt(startedAt);
        focusRecordMapper.insert(record);
        return record;
    }
}
