package org.example.study_room2.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.study_room2.entity.StudyRoom;
import java.util.List;

@Mapper
public interface StudyRoomMapper {
    List<StudyRoom> findAll();
    StudyRoom findById(@Param("id") Long id);
    int insert(StudyRoom room);
}
