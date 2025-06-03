package com.example.pos.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Item {
    @Id
    private String id;
    
    private String code;
    private String name;
    private String category;
    private double basePrice;
    
    @Enumerated(EnumType.STRING)
    private ItemType type;
    
    @ElementCollection
    private List<SizeOption> sizes;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Customization> customizations;
    
    public enum ItemType {
        DRINK, FOOD, MERCHANDISE
    }
}

@Embeddable
@Data
class SizeOption {
    private String name;
    private double priceModifier;
}

@Entity
@Data
class Customization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<CustomizationOption> options;
}

@Embeddable
@Data
class CustomizationOption {
    private String name;
    private double price;
}