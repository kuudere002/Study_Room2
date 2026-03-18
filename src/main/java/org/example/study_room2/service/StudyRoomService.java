package org.example.study_room2.service;

import org.example.study_room2.entity.StudyRoom;
import org.example.study_room2.mapper.StudyRoomMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudyRoomService {

    @Autowired
    private StudyRoomMapper studyRoomMapper;

    public List<StudyRoom> getAll() {
        return studyRoomMapper.findAll();
    }

    public StudyRoom getById(Long id) {
        return studyRoomMapper.findById(id);
    }
}
