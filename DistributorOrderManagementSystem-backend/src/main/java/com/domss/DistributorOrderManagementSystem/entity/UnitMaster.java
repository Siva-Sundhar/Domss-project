package com.domss.DistributorOrderManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "unit_master")
public class UnitMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "product_uom", nullable = false, unique = true)
    private String productUom;

    @Column(name = "uom")
    private String uom;
}
