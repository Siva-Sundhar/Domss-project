package com.domss.DistributorOrderManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "executive_master")
public class ExecutiveMaster {

    @Id
    @SequenceGenerator(name = "id_seq", sequenceName = "id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "id_seq")
    @Column(name = "id")
    private Long id;


    @Column(name = "executive_code", nullable = false, unique = true)
    private String executiveCode;

    @Column(name = "executive_master")
    private  String executiveMaster;

    @Column(name = "date_of_join")
    private String dateOfJoin;

    @Column(name = "mobile_no")
    private  String mobileNo;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "status")
    private String status;


}
