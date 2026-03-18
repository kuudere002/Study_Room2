package org.example.study_room2.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.study_room2.entity.Todo;
import java.util.List;

@Mapper
public interface TodoMapper {
    List<Todo> findByUserId(@Param("userId") Long userId);
    Todo findById(@Param("id") Long id);
    int insert(Todo todo);
    int update(Todo todo);
    int delete(@Param("id") Long id);
}
