package com.domss.DistributorOrderManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "product_master")
public class ProductMaster {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_code", nullable = false, unique = true)
    private String productCode;

    @Column(name = "stock_item_name")
    private String description;

    @Column(name = "stock_category")
    private String stockCategory;

    @Column(name = "uom")
    private String uom;

    @Column(name = "stock_group")
    private String stockGroup;

    @Column(name = "standard_cost")
    private Double standardCost;

    @Column(name = "selling_price")
    private Double sellingPrice;

    @Column(name = "discount")
    private Double discount;


}
