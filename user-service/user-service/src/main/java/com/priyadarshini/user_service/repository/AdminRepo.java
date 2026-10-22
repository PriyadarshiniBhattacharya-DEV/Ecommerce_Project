package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<Admin, Long> {
    Admin findByEmail(String email);
}
