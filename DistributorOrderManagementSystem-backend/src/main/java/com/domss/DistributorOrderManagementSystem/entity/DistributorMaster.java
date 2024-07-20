package com.domss.DistributorOrderManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "distributor_master")
public class DistributorMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "distributor_code", nullable = false, unique = true)
    private String distributorCode;

    @Column(name = "distributor_company_name")
    private String distributorCompanyName;

    @Column(name = "distributor_owner_name")
    private String distributorOwnerName;

    @Column(name = "mobile_no")
    private String mobileNo;

    @Column(name = "executive_code")
    private String executiveCode;

    @Column(name = "executive_master")
    private String executiveMaster;

    @Column(name = "region_code")
    private String regionCode;

    @Column(name = "region_master")
    private String regionMaster;

    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "contact_mobile_no")
    private String contactMobileNo;

}
