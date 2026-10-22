package com.priyadarshini.user_service.service;
import com.priyadarshini.user_service.entity.Products;
import com.priyadarshini.user_service.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;
    public Products addProduct(String name,
                               Double price,
                               String description,
                               Long category,
                               Integer stock,
                               MultipartFile file)throws IOException {
        Products product = new Products();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setCategory(category);
        product.setStock(stock);

        if (file != null && !file.isEmpty()) {

            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            product.setImages(base64Image);
        }
        return repo.save(product);
    }
    public Products saveProduct(Products product){
        return repo.save(product);
    }
    public List<Products> getAll(){return repo.findAll();}
    public List<Products> searchProductsByName(String name){
        List<Products> products =  repo.findByNameContainingIgnoreCase(name);
        if (products.isEmpty()) {
            throw new RuntimeException("PRODUCTS DOES NOT EXIST");
        }
        return products;
    }
    public Products searchProductsById(String id){
        Long idValue = Long.valueOf(id);
        return repo.findById(idValue).orElseThrow(() -> new RuntimeException("PRODUCT DOES NOT EXIST"));
    }
    public List<Products> searchProductsByCategory(String categoryName){
        List<Products> products =  repo.findByCategoryNameContainingIgnoreCase(categoryName);
        if (products.isEmpty()) {
            throw new RuntimeException("PRODUCTS DOES NOT EXIST");
        }
        return products;
    }
    public void deleteProduct(Long id) {
        Products product = repo.findById(id).orElseThrow(() -> new RuntimeException("PRODUCT DOES NOT EXIST"));
        repo.delete(product);
    }
    public void deleteProductByCategory(Long id) {
        List<Products> product = repo.findProductByCategory(id);
        if (product.isEmpty()) {
            throw new RuntimeException("PRODUCTS DOES NOT EXIST");
        }
        repo.deleteAll(product);
    }
    public Products getById(Long id){
        return repo.findById(id).orElseThrow(()->new RuntimeException("PRODUCT DOES NOT EXIST"));
    }
    public List<Products> getByCategoryId(Long id){
        List<Products> products = repo.findProductByCategory(id);
        if (products.isEmpty()) {
            throw new RuntimeException("PRODUCTS DOES NOT EXIST");
        }
        return products;
    }

    public Products updateById(Long id, String name,
                               Double price,
                               String description,
                               Long category,
                               Integer stock,
                               MultipartFile file)throws IOException {
        Products product= repo.findById(id).orElseThrow(()->new RuntimeException("PRODUCT DOES NOT EXIST"));
        product.setCategory(category);
        product.setDescription(description);
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        if (file != null && !file.isEmpty()) {

            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            product.setImages(base64Image);
        }
        return repo.save(product);
    }
}
