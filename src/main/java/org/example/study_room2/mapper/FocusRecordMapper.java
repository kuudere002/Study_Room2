package org.example.study_room2.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.study_room2.entity.FocusRecord;
import java.util.List;

@Mapper
public interface FocusRecordMapper {
    List<FocusRecord> findByUserId(@Param("userId") Long userId);
    int insert(FocusRecord record);
}
