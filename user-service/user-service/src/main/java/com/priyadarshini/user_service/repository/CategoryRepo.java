package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.Category;
import com.priyadarshini.user_service.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
}
