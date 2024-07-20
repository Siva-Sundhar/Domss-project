package com.domss.DistributorOrderManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ledger_master")
public class LedgerMaster {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "ledger_code", nullable = false, unique = true)
    private String ledgerCode;

    @Column(name = "ledger_name")
    private String ledgerName;
}
