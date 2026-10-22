package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepo extends JpaRepository<Cart, Long> {
    Cart findByUserId(Long userId);
}
