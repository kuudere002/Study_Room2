package org.example.study_room2.service;

import org.example.study_room2.entity.User;
import org.example.study_room2.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public User findById(Long id) {
        return userMapper.findById(id);
    }

    public User register(String username, String password, String nickname) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname(nickname != null ? nickname : username);
        userMapper.insert(user);
        return user;
    }

    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}
