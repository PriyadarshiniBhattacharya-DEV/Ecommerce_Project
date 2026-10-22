package com.priyadarshini.user_service.service;
import com.priyadarshini.user_service.entity.Category;
import com.priyadarshini.user_service.entity.Products;
import com.priyadarshini.user_service.repository.CategoryRepo;
import org.atteo.evo.inflector.English;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo repo;
    public Category addCategory(String name, MultipartFile file) throws IOException
    {
        if (isCategoryDuplicate(name)) {
            throw new IllegalArgumentException("Category '" + name + "' (or its plural/singular form) already exists.");
        }
        Category category = new Category();
        category.setName(name);
        if (file != null && !file.isEmpty()) {

            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            category.setImage(base64Image);
        }
        return repo.save(category);
    }

    private boolean isCategoryDuplicate(String name) {
        if (name == null) return false;

        String cleanInput = name.trim().toLowerCase();

        List<Category> allCategories = repo.findAll();

        return allCategories.stream().anyMatch(existing -> {
            String cleanExisting = existing.getName().trim().toLowerCase();
            if (cleanInput.equals(cleanExisting)) return true;

            Set<String> forms1 = generateStandardForms(cleanInput);
            Set<String> forms2 = generateStandardForms(cleanExisting);

            // If any generated variation overlaps, they are treated as duplicates
            forms1.retainAll(forms2);
            return !forms1.isEmpty();
        });
    }
    private Set<String> generateStandardForms(String name){
        Set<String> forms = new HashSet<>();
        forms.add(name);

        if (name.endsWith("s") && !name.endsWith("ss") && name.length() > 2) {
            forms.add(name.substring(0, name.length() - 1));
        }

        if (name.endsWith("ies") && name.length() > 3) {
            forms.add(name.substring(0, name.length() - 3) + "y");
            forms.add(name.substring(0, name.length() - 1));
        }

        if (name.endsWith("es") && name.length() > 3) {
            forms.add(name.substring(0, name.length() - 2));
        }

        return forms;
    }
    public List<Category> getAll()
    {
        return repo.findAll();
    }
    public Category getById(Long id){
        return repo.findById(id).orElseThrow(()->new RuntimeException("CATEGORY DOES NOT EXIST"));
    }
    public void deleteCategory(Long id){
        Category category = repo.findById(id).orElseThrow(() -> new RuntimeException("Category does not exist"));
        repo.delete(category);
    }
    public Category updateCategoryById(Long id, String name,
                               MultipartFile file)throws IOException {
        Category cat= repo.findById(id).orElseThrow(()->new RuntimeException("CATEGORY DOES NOT EXIST"));
        cat.setName(name);
        if (file != null && !file.isEmpty()) {

            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            cat.setImage(base64Image);
        }
        return repo.save(cat);
    }

    public List<Category> searchCategoryByName(String name){
        List<Category> category =  repo.findByNameContainingIgnoreCase(name);
        if (category.isEmpty()) {
            throw new RuntimeException("PRODUCTS DOES NOT EXIST");
        }
        return category;
    }
    public Category searchCategoryById(String id){
        Long idValue = Long.valueOf(id);
        return repo.findById(idValue).orElseThrow(() -> new RuntimeException("PRODUCT DOES NOT EXIST"));
    }
}
