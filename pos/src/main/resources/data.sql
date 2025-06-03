-- Sample Items
INSERT INTO ITEM (id, code, name, category, base_price, type) 
VALUES ('1', 'ED-AMER-001', 'Americano', 'Espresso Drinks', 120.00, 'DRINK');

-- Sample Sizes (for H2, use JSON column if using PostgreSQL)
INSERT INTO ITEM_SIZES (item_id, name, price_modifier)
VALUES ('1', 'Small', 0.0), ('1', 'Large', 30.0);

-- Sample Customizations
INSERT INTO CUSTOMIZATION (id, name, item_id) 
VALUES (1, 'Milk', '1');

INSERT INTO CUSTOMIZATION_OPTIONS (customization_id, name, price)
VALUES (1, 'Soy Milk', 35.0), (1, 'Oat Milk', 40.0);