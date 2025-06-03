package com.example.pos.controller;
import com.example.pos.entity.Item;
import com.example.pos.repository.ItemRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemRepository repository;
    public ItemController(ItemRepository repository) {
        this.repository = repository;
    }
    
    @GetMapping
    public List<Item> getAllItems() {
        return repository.findAll();
    }
}