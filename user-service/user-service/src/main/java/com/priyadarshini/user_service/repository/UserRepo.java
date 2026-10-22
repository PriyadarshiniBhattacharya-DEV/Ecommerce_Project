package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepo extends JpaRepository<User, Long> {

    //List<User> id(Long id);
    List<User> findByNameContainingIgnoreCase(String name);
    User findByEmail(String email);
    List<User> findByIdOrEmailContainingIgnoreCase(Long id, String name);
    List<User> findByEmailContainingIgnoreCase(String email);
}
