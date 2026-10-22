package com.priyadarshini.user_service.controller;

import com.priyadarshini.user_service.entity.Products;
import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.service.ProductService;
import com.priyadarshini.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping ("/api/products")
@CrossOrigin(origins = "*")

public class ProductController {
    @Autowired
    private ProductService productService;
    @PostMapping("/addproduct")
    public ResponseEntity<?> addProduct(@RequestParam("name") String name,
                                               @RequestParam("price") Double price,
                                               @RequestParam("description") String description,
                                               @RequestParam("category") Long category,
                                               @RequestParam("stock") Integer stock,
                                               @RequestParam(value = "image", required = false) MultipartFile file){
        try {
            Products newProduct = productService.addProduct(name, price, description, category, stock, file);
            return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
        }
        catch (IllegalArgumentException | IOException e) {
            // Returns a 400 Bad Request with the duplicate error message
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/productlist")
    public ResponseEntity<List<Products>> getAllProducts(){
        List<Products> productsList=productService.getAll();
        return ResponseEntity.ok(productsList);
    }
    @GetMapping("/searchbyname/{keyword}")
    public ResponseEntity<List<Products>> searchProductsByName(@PathVariable String keyword){
        List<Products> products=productService.searchProductsByName(keyword);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/searchbyid/{keyword}")
    public ResponseEntity<List<Products>> searchProductsById(@PathVariable String keyword){
        Products product=productService.searchProductsById(keyword);
        List<Products> products = List.of(product);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/searchbycategory/{keyword}")
    public ResponseEntity<List<Products>> searchProductsByCategory(@PathVariable String keyword){
        List<Products> products=productService.searchProductsByCategory(keyword);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/getProduct/{id}")
    public ResponseEntity<Products> getProductById(@PathVariable Long id){
        Products product= productService.getById(id);
        return ResponseEntity.ok(product);
    }
    @GetMapping("/getproductbycategory/{id}")
    public ResponseEntity<List<Products>> getProductByCategoryId(@PathVariable Long id){
        List<Products> product= productService.getByCategoryId(id);
        return ResponseEntity.ok(product);
    }
    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<?> updateProductById(@PathVariable Long id, @RequestParam("name") String name,
                                                      @RequestParam("price") Double price,
                                                      @RequestParam("description") String description,
                                                      @RequestParam("category") Long category,
                                                      @RequestParam("stock") Integer stock,
                                                      @RequestParam(value = "image", required = false) MultipartFile file){
        try {
            Products updatedProduct = productService.updateById(id, name, price, description, category, stock, file);
            return new ResponseEntity<>(updatedProduct, HttpStatus.CREATED);
        }
        catch (IllegalArgumentException | IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PutMapping("/increaseStock/{id}")
    public ResponseEntity<Products> increaseProductById(@PathVariable Long id){
        Products product= productService.getById(id);
        product.setStock(product.getStock() + 1);
        Products updatedProducts = productService.saveProduct(product);
        return ResponseEntity.ok(updatedProducts);
    }
    @PutMapping("/decreaseStock/{id}")
    public ResponseEntity<Products> decreaseProductById(@PathVariable Long id){
        Products product= productService.getById(id);
        product.setStock(product.getStock() - 1);
        Products updatedProducts = productService.saveProduct(product);
        return ResponseEntity.ok(updatedProducts);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProducts(@PathVariable Long id){
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted.");
    }
    @DeleteMapping("/deletecategoryproducts/{category}")
    public ResponseEntity<String> deleteProductsByCategory(@PathVariable Long category){
        productService.deleteProductByCategory(category);
        return ResponseEntity.ok("Product deleted.");
    }

}
