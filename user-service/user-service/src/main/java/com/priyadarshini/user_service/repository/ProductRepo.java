package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepo extends JpaRepository<Products, Long> {
    List<Products> findByNameContainingIgnoreCase(String name);
    List<Products> findProductByCategory(Long category);
    @Query("SELECT p FROM Products p, Category c WHERE p.category = c.id AND LOWER(c.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))")
    List<Products> findByCategoryNameContainingIgnoreCase(@Param("categoryName") String categoryName);
}
