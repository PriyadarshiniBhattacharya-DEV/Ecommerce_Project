package com.priyadarshini.user_service.controller;

import com.priyadarshini.user_service.entity.Category;
import com.priyadarshini.user_service.entity.Products;
import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.service.CategoryService;
import com.priyadarshini.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.PrivateKey;
import java.util.List;

@RestController
@RequestMapping ("/api/category")
@CrossOrigin(origins = "*")

public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/addcategory")
    public ResponseEntity<?> addCategory(@RequestParam("name") String name,
                                         @RequestParam(value = "image", required = false) MultipartFile file){
        try {
            Category newCategory = categoryService.addCategory(name, file);
            return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
        } catch (IllegalArgumentException | IOException e) {
            // Returns a 400 Bad Request with the duplicate error message
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }    }

    @GetMapping("/categoryList")
    public ResponseEntity<List<Category>> getAllCategories(){
        List<Category> allCategories = categoryService.getAll();
        return ResponseEntity.ok(allCategories);
    }
    @GetMapping("/getcategory/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id){
        Category category= categoryService.getById(id);
        return ResponseEntity.ok(category);
    }
    @PutMapping("/updatecategory/{id}")
    public ResponseEntity<?> editCategoryById(@PathVariable Long id, @RequestParam("name") String name,
                                                     @RequestParam(value = "image", required = false) MultipartFile file){
        try {
            Category updatedCategory = categoryService.updateCategoryById(id, name, file);
            return new ResponseEntity<>(updatedCategory, HttpStatus.CREATED);
        }
        catch (IllegalArgumentException | IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/deletecategory/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted.");
    }

    @GetMapping("/searchcategorybyname/{keyword}")
    public ResponseEntity<List<Category>> searchCategoryByName(@PathVariable String keyword){
        List<Category> category=categoryService.searchCategoryByName(keyword);
        return ResponseEntity.ok(category);
    }
    @GetMapping("/searchcategorybyid/{keyword}")
    public ResponseEntity<List<Category>> searchCategoryById(@PathVariable String keyword){
        Category category=categoryService.searchCategoryById(keyword);
        List<Category> products = List.of(category);
        return ResponseEntity.ok(products);
    }

}
